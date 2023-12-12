require("dotenv").config();
const express = require("./config/express");

  express.get('/healthz', function(request, response) {
	  let code = 200;
	  console.log("in health");
	  response.status(code).send('OK');
  });

  express.get('/ready', function(request, response) {
	  let code = 200;
	  console.log("in ready");
	  response.status(code).send('OK');
  });

const port = 4000;
express().listen(port);
const env = process.env.NODE_ENV || "development";
console.log(`${env} - API Server Start At Port ${port}`);
