"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyRule = void 0;
/*
Entity => price or indicator
id defines entity moved from current price => entity[0] would be current entity, entity[2] would me 2 entities away form current entity
{
    "entity1":
        "id1": "0"
        "name1": "open",
    "position": "below",
    "positionOffset": 10 // used as percentage
    "entity2":
        "id2": "0",
        "name2": "EMA9",
}
*/
var StrategyRule = /** @class */ (function () {
    function StrategyRule(init) {
        Object.assign(this, init);
    }
    return StrategyRule;
}());
exports.StrategyRule = StrategyRule;
