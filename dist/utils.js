"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomTokens = void 0;
const getRandomTokens = () => Math.floor(512 / (Math.floor(Math.random() * 6) + 1));
exports.getRandomTokens = getRandomTokens;
