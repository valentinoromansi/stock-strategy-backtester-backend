const fs = require("fs");
const yaml = require("js-yaml");

let data;

function getData() {
  return data;
}

function loadYaml() {
  try {
    let fileContents = fs.readFileSync("./resources/properties.yml", "utf8");
    data = yaml.safeLoad(fileContents);
  } catch (e) {}
}

module.exports = { getData, loadYaml };
