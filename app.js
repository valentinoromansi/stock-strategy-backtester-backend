const excelParser = require("./excel-parser");
const yaml = require("./yml/yaml");

const express = require("express");
const app = express();

yaml.loadYaml();

function setHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-Type", "application/json");
}

app.get("/stock-data", (req, res) => {
  setHeaders(res);
  excelParser
    .getAllCsvData()
    .then((csvData) =>
      res.send(JSON.stringify({ stocksData: csvData }, null, 2))
    );
});

module.exports = app;
