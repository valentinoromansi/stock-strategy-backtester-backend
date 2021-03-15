"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var excel_extractor_1 = require("./data-extractor/excel-extractor");
var express_1 = __importDefault(require("express"));
var vertical_slice_1 = require("./model/price/vertical-slice");
var direction_1 = require("./model/price/direction");
var pattern_conditions_1 = require("./backtester/pattern-conditions");
var strategy_rule_1 = require("./backtester/model/strategy-rule");
var graph_entity_1 = require("./backtester/model/graph-entity");
var graph_entity_type_1 = require("./backtester/types/graph-entity-type");
var graph_position_type_1 = require("./backtester/types/graph-position-type");
var backtest_1 = require("./backtester/backtest/backtest");
var price_type_1 = require("./backtester/types/price-type");
function setHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Content-Type", "application/json");
}
exports.app = express_1.default();
var priceExtractor = new excel_extractor_1.ExcelExtractor();
// Get price data
exports.app.get("/stock-data", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stockData, jsonNullReplacer, jsonStockData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('/stock-data called...');
                setHeaders(res);
                return [4 /*yield*/, priceExtractor.readPriceData(false)];
            case 1:
                stockData = _a.sent();
                jsonNullReplacer = function (key, value) {
                    if (value !== null)
                        return value;
                };
                jsonStockData = JSON.stringify(stockData, jsonNullReplacer, 2);
                res.send(jsonStockData, null, 2);
                console.log('/stock-data response = ' + jsonStockData);
                return [2 /*return*/];
        }
    });
}); });
// Do backtest
exports.app.get("/backtest", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stocksData, rules, backtestData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('/backtest called...');
                setHeaders(res);
                return [4 /*yield*/, priceExtractor.readPriceData(true)
                    // Defined rules
                ];
            case 1:
                stocksData = _a.sent();
                rules = [
                    new strategy_rule_1.StrategyRule({
                        graphEntity1: new graph_entity_1.GraphEntity({
                            id: 1,
                            period: null,
                            type: graph_entity_type_1.GraphEntityType.CLOSE,
                        }),
                        position: graph_position_type_1.GraphPositionType.ABOVE,
                        offsetPercentage: 0,
                        graphEntity2: new graph_entity_1.GraphEntity({
                            id: 0,
                            period: null,
                            type: graph_entity_type_1.GraphEntityType.OPEN,
                        }),
                    }),
                ];
                backtestData = new backtest_1.BacktestData(1);
                stocksData[0].first().executeEachIteration(direction_1.Direction.RIGHT, stocksData.length - 1, function (price) {
                    /*
                    WHY THE FCK DOES getPriceType RETURNES FALSE ALL THE FFCKING TIME!!!!!!!!!!!!!!!!!!!!!
                    */
                    console.log(pattern_conditions_1.isPatternValid(price, rules));
                    console.log(vertical_slice_1.VerticalSlice.getPriceType(price) == price_type_1.PriceType.BEARISH);
                    console.log(vertical_slice_1.VerticalSlice.getPriceType(price.next) == price_type_1.PriceType.BULLISH);
                    if (pattern_conditions_1.isPatternValid(price, rules) &&
                        vertical_slice_1.VerticalSlice.getPriceType(price) == price_type_1.PriceType.BEARISH &&
                        vertical_slice_1.VerticalSlice.getPriceType(price.next) == price_type_1.PriceType.BULLISH)
                        backtestData.doBacktest(price);
                });
                //console.log(JSON.stringify(backtestData))
                res.send({});
                return [2 /*return*/];
        }
    });
}); });
