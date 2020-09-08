"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allLessThen = void 0;
function allLessThen(values, value) {
    return values.every(function (v) { return v < value; });
}
exports.allLessThen = allLessThen;
