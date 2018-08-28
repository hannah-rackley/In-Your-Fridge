const jwt = require('jsonwebtoken');
const express = require('express');
const pg = require('pg-promise')();
const {SIGNATURE, name } = require('./variables');
const dbConfig = `postgres://${name}@localhost:5432/fridge`;
const db = pg(dbConfig);

//Create token
let createToken = user => {
    jwt.sign(
        {userId: user.id}, 
        SIGNATURE, 
        { expiresIn: '7d'}
    );
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
        let user = db.query(`select * from users where users.email = ${email}`);
        if (user.password === password && user.email === email) {
            let token = createToken(user);
            res.send(token);
            //later we will add in the ability to store this token in the users local storage
        } else {
            res.send('Uh-oh! I cannot assign a token for you!');
        }
    });
}

// GET /.inyourfridge/private
let privatePage = (req, res) => {
    res.send(`Hello, user #${req.jwt.userId}`);
};
  
let checkToken = async (req, res, next) => {
    let { authorization: token } = req.headers;
    let payload;
    try {
        payload = jwt.verify(token, SIGNATURE);
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

let server = express();
server.post('/tokens', postToken)
// server.get('/tokens')
server.listen(3000);