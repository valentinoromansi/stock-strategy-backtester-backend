"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicatorList = void 0;
var IndicatorList = /** @class */ (function () {
    function IndicatorList() {
    }
    IndicatorList.prototype.findFirst = function (targetIndiType) {
        this.indicators.forEach(function (indicator) {
            if (indicator.type == targetIndiType)
                return indicator;
        });
        return null;
    };
    IndicatorList.prototype.exist = function (targetIndiType) {
        this.indicators.forEach(function (indicator) {
            if (indicator.type == targetIndiType)
                return true;
        });
        return false;
    };
    return IndicatorList;
}());
exports.IndicatorList = IndicatorList;
