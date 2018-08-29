const jwt = require('jsonwebtoken');
const express = require('express');
const pg = require('pg-promise')();
const {SIGNATURE, name } = require('./variables');
const dbConfig = name;
const db = pg(dbConfig);
const fs = require('fs');

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
    });
}

// GET /.inyourfridge/private
let checkToken = async (req, res, next) => {
    console.log('headers:' + JSON.stringify(req.headers));
    let { authorization: token } = req.headers;
    let payload;
    try {
        payload = jwt.verify(token, SIGNATURE);
        console.log(payload);
    } catch(err) {
        console.log(err);
    }

    if (payload) {
        req.jwt = payload;
        console.log(req.jwt);
        next();
    } else {
        res.send('Woops! you do not have a token!');
    }
};

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

let renderHomepage = (req, res) => {
    fs.readFile('index.html', 'utf8', (error, contents) => {
        if (error) {
            console.log(error);
        }
        else {
            // console.log(contents);
            res.end(contents);
        }
    });
};

let sendCSS = (req, res) => {
    fs.readFile('styles.css', 'utf8', (error, contents) => {
        if (error) {
            console.log(error);
        }
        else {
            res.end(contents);
        }
    });
};

let sendJavascript = (req, res) => {
    fs.readFile('main.js', 'utf8', (error, contents) => {
        if (error) {
            console.log(error);
        }
        else {
            res.end(contents);
        }
    });
};

let server = express();
server.get('/', renderHomepage)
server.get('/styles.css', sendCSS)
server.get('/main.js', sendJavascript)
server.post('/tokens', postToken)
server.post('/users', postUserSignupInformation)
// server.get('/tokens')
server.listen(3000);