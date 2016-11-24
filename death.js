/*
* In a world where virtual life is almost as important as real life, I wanted
* to make something that would be able to speak instead of me when I'll die. And this
* is what this "death" plugin was made for. If you don't "tell" your website that you're
* still alive, it'll automatically shutdown and print a new page.
* 
* Licensed under GPL v3
* Copyright Kakise <me@kakise.xyz>
*
* Create a "dead.html" file in your assets folder.
*/

"use strict";
var express = require("express");
var router = express.Router();
var path = require('path');
var fs = require('fs');
var logic = require('../src/logic');
var md = require('marked');
var config = require('../config.json');
var main = require("../main");
var deadlog = path.join(__dirname, '../dead.log');
var deadPage = fs.readFileSync(path.join(__dirname, '../assets/dead.html'));

var deathStamp;
var buffer = '';
var bufferInt;

fs.access(path.join(__dirname, '../dead.log'), fs.R_OK | fs.W_OK, (err) => {
    if (err) {
        fs.writeFileSync(deadlog, new Date().getTime());
        var deathStamp = fs.readFileSync(deadlog);
        buffer = deathStamp.toString();
        bufferInt = parseInt(buffer, 10);
    }
});

function refreshStamp() {
    var deathStamp = fs.readFileSync(deadlog);
    buffer = deathStamp.toString();
    bufferInt = parseInt(buffer, 10);
}

router.get('/dead', function(req,res){
    var date = new Date();
    fs.writeFileSync(deadlog, new Date().getTime());
    res.end("You're still alive. That's great :)");
});

main.app.use(function(req, res, next){
  refreshStamp();
    if(new Date() > new Date(bufferInt + 172800000 * 7)){ // 14 jours
        res.writeHead(200);
        res.end(deadPage, "binary");
    }
    next();
});

exports.main = function() {
  console.log(`[${new Date().toISOString()}] Death notifier loaded !`)
  
}

exports.router = router;
