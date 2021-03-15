"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graph_entity_type_1 = require("../../src/backtester/types/graph-entity-type");
test("Value from enum string to enum", function () {
    expect(graph_entity_type_1.GraphEntityType["OPEN"]).toBe(graph_entity_type_1.GraphEntityType.OPEN);
    expect(graph_entity_type_1.GraphEntityType.OPEN.toString()).toBe("OPEN");
});
