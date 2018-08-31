const jwt = require('jsonwebtoken');
const express = require('express');
const pg = require('pg-promise')();
const {SIGNATURE, name, recipeKey } = require('./variables');
const dbConfig = name;
const db = pg(dbConfig);
const fs = require('fs');
const fetch = require('node-fetch');
let newRecipes = [];

//Create token
let createToken = user => {
    let token = jwt.sign(
        {userId: user.id}, 
        SIGNATURE, 
        { expiresIn: '7d'}
    );
    return token;
}

//Read Body helper function 
let readBody = (req, callback) => {
    let body="";
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        callback(body);
    })
}

//Post tokens
let postToken = async (req, res) => {
    readBody(req, (body) => {
        let credentials = JSON.parse(body);
        let { email, password } = credentials;
        db.one(`select * from users where users.email = '${email}'`)
            .then(user => {
                if (user.password === password && user.email === email) {
                    let token = createToken(user);
                    res.send(token);
                    //later we will add in the ability to store this token in the users local storage
                } else {
                    res.send('Uh-oh! I cannot assign a token for you!');
                }
            })
            .catch((err) => {console.log(err)});
    });
}

// GET /.inyourfridge/private
let checkToken = async (req, res, next) => {
    // console.log('headers:' + JSON.stringify(req.headers));
    let { authorization: token } = req.headers;
    let payload;
    try {
        payload = jwt.verify(token, SIGNATURE);
        // console.log(payload);
    } catch(err) {
        console.log(err);
    }

    if (payload) {
        req.jwt = payload;
        // console.log(req.jwt);
        next();
    } else {
        res.send('Woops! you do not have a token!');
    }
};

let orderedByTime = (recipeArr) => {
    recipeArr.sort(function(a, b) {
    if (a[3] > b[3]) return 1;
    if (a[3] < b[3]) return -1;
    if (a[3] === b[3]) {
        if (a[0] > b[0]) return 1;
	    if (a[0] < b[0]) return -1;
    }
    }); 
    return(recipeArr);
};

let getRecipeInfo = function(recipeArrIds, res) {
    let prefixUrl = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids=';
    let suffixUrl = '&includeNutrition=false';
    let ingreRootUrl = recipeArrIds.join("%2C");
    let fetchPromise = fetch(prefixUrl + ingreRootUrl + suffixUrl, {
        method: "GET",
        headers: {
            "X-Mashape-Key": recipeKey,
            Accept: 'application/json'
        }
    })
        .then(function (result) {
            let promiseRecipes = result.json();
            return promiseRecipes;
        })
        .then(function(recipeObjArr) {
            newRecipes = recipeObjArr.map(recipe => [recipe.title, recipe.spoonacularSourceUrl, recipe.image, recipe.readyInMinutes]);
            return JSON.stringify(newRecipes);
        })
        .catch(function (err) {
            console.log(err);
        });
    return fetchPromise;
}

let getRecipesfromIngreds = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
              "Origin, X-Requested-With, Content-Type, Accept, token");
    res.header("Access-Control-Allow-Methods", "*");
    readBody(req, (body) => {
        let foodArr = JSON.parse(body);
        let prefixUrl =
        "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=";
        let suffixUrl = "&limitLicense=false&number=5&ranking=2"
        let ingreRootUrl = foodArr.join("%2C");
        fetch(prefixUrl + ingreRootUrl + suffixUrl, {
            method: "GET",
            headers: {
                "X-Mashape-Key": recipeKey,
                Accept: 'application/json'
            }
        })
            .then(function (result) {
                let promiseRecipes = result.json();
                return promiseRecipes;
            })
        .then(function(recipeObjArr) {
            let recipeArrIds = recipeObjArr.map(recipes => recipes.id);
            getRecipeInfo(recipeArrIds, res)
            .then((results) => {
                results = orderedByTime(results);
                res.send(results)})
            .catch(err => console.log(err));
        })
        .catch(function (err) {
            console.log(err);
        });
    });
}

let postUserSignupInformation = (req, res) => {
    readBody(req, (body) => {
        let userInformation = JSON.parse(body);
        db.query(`INSERT INTO
                        users (email, password)
                        VALUES ('` + userInformation.email + `', '` + userInformation.password + `')`)
            .then((contents) => {
                res.end('You are now signed up!');
            })
            .catch((err) => {console.log(err)});
    });
};

let postStaples = (req, res) => {
    readBody(req, (body) => {
        let stapleIngredients = JSON.parse(body);
        console.log(stapleIngredients);
        let { authorization: token } = req.headers;
        let payload = jwt.verify(token, SIGNATURE);
        let userId = payload.userId;
        // console.log(stapleIngredients);
        db.query(`SELECT * FROM ingredients WHERE userid = ` + userId)
            .then((contents) => {
                // console.log(contents.length);
                if (contents.length === 0) {
                    db.query(`INSERT INTO 
                        ingredients (userid, included)
                        VALUES ('` + userId + `', '{` + stapleIngredients + `}')`)
                        .then((contents) => {
                            res.end('Your staple ingredients have been stored!');
                        })
                        .catch((err) => {console.log(err)});
                }
                else {
                    db.query(`UPDATE 
                        ingredients 
                        SET included = '{` + stapleIngredients + `}'
                        WHERE userid = '` + userId + `'`)
                        .then((contents) => {
                            res.end('Your staple ingredients have been updated!')
                        })
                        .catch((err) => {console.log(err)});
                }
            });
        
    });
};

let getStaples = (req, res) => {
    let { authorization: token } = req.headers;
    let payload = jwt.verify(token, SIGNATURE);
    let userId = payload.userId;
    db.query(`SELECT included FROM ingredients WHERE userid = '` + userId + `'`)
        .then((contents) => {
            let contentsObject = contents[0];
            res.send(JSON.stringify(contentsObject.included));
        })
};

let returnEmail = (req, res) => {
    let { authorization: token } = req.headers;
    let payload = jwt.verify(token, SIGNATURE);
    let userId = payload.userId;
    db.query(`SELECT email FROM users WHERE id = '` + userId + `'`)
        .then((contents) => {
            let contentsObject = contents[0];
            res.send(JSON.stringify(contentsObject.email));
        })
};

let server = express();
server.use(express.static('./public'))
server.get('/retrieveemail', checkToken, returnEmail);
server.get('/retrieveingredients', checkToken, getStaples);
server.post('/tokens', postToken);
server.post('/users', postUserSignupInformation);
server.post('/staples', checkToken, postStaples);
server.post('/ingredients', checkToken, getRecipesfromIngreds);
// server.get('/tokens')
server.listen(3000);
