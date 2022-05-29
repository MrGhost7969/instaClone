import {select} from "d3-selection";
import {JSDOM} from "jsdom";

const jsdom = new JSDOM(html);
const svg = select(jsdom.window.document.body).append("svg");
const Account = require('./model/account')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();

let loginInput = d3.select('loginInput')

router.get('/', (req, res) =>{
    if(req.isAuthenticated()){
        loginInput.remove();
    }
})

router.get('/account', (req, res) =>{
    if(req.isAuthenticated()){
        loginInput.remove();
    }
})

module.exports = loginInput;
// Check if user's logged in
// if(loginInput)