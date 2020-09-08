"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var app_1 = require("./app");
var port = process.env.port || 4000;
var server = http_1.createServer(app_1.app);
server.listen(port);
