const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");
const yaml = require("./yml/yaml");
const { count } = require("console");

async function getParsedCsv(path) {
  return new Promise((resolve, rej) => {
    let results = [];
    fs.createReadStream(path)
      .pipe(csv({}))
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      });
  });
}

async function getFileNames(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) reject("Unable to scan directory: " + err);
      resolve(files);
    });
  });
}

function getAllCsvData() {
  return new Promise(async (resolve, rej) => {
    excelFolderPath = "./" + yaml.getData().excel.folder;
    const fileNames = await getFileNames(excelFolderPath);
    let allParsedCsv = [];
    for (let i = 0; i < fileNames.length; i++) {
      allParsedCsv.push(
        await getParsedCsv(excelFolderPath + "/" + fileNames[i])
      );
    }
    resolve(allParsedCsv);
  });
}

module.exports = { getAllCsvData };
