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
const express = require("express");
const router = express.Router();
const passport = require("passport");
// // User Filteration
const Control = require("../db/models/control");
// router.use(nocache)
const checkAuthenticated = function (req, res, next) {
    console.log("req.isAuthenticated  in Dashbaord ", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
};
router.use(checkAuthenticated);
///////////
function makeid(length) {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
////////
router.get("/control", checkAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
router.post("/control", checkAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
module.exports = router;
