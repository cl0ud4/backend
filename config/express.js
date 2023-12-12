const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
const morgan = require("morgan");
var cors = require("cors");

module.exports = function () {
  const app = express();

  app.use(compression());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(methodOverride());

  app.use(morgan("dev"));

  app.use(cors());
  // app.use(express.static(process.cwd() + '/public'));

  require("../src/app/User/userRoute")(app);
  require("../src/app/Nemo/nemoRoute")(app);
  // require('../src/app/Board/boardRoute')(app);
  // require("../src/app/Test/testRoute")(app);
  require("../src/app/Question/questionRoute")(app);

  return app;
};
