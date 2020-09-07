"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var excel_extractor_1 = require("./data-extractor/excel-extractor");
var express_1 = __importDefault(require("express"));
var response_service_1 = require("./response-service/response-service");
function setHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Content-Type", "application/json");
}
exports.app = express_1.default();
var priceExtractor = new excel_extractor_1.ExcelExtractor();
// Get all strategies name, description and visual data
exports.app.get("/strategies", function (req, res) {
    setHeaders(res);
    res.send(response_service_1.getStrategies());
});
// Get all strategies name, description and visual data
/*app.get("/strategy....", (req: any, res: any) => {
  setHeaders(res)
  priceExtractor.readPriceData().then((data: any) => res.send(JSON.stringify({ stocksData: data }, null, 2)))
})
*/
