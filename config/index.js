require('dotenv').config();
const express = require("./config/express");

const port = 4000;
express().listen(port);
const env = process.env.NODE_ENV || "development";
console.log(`${env} - API Server Start At Port ${port}`);
