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
Object.defineProperty(exports, "__esModule", { value: true });
const api_js_1 = require("./api.js");
let spotify = new api_js_1.spotifyAPI('42579b56482b4e99b4c98c169a704e75', 'c190b0220a46460abc60f83107ef9802');
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield spotify.authenticate([]);
    let result;
    try {
        result = yield spotify.getPlaylist('7yOowMIM2QnbuRwzx96WMl');
    }
    catch (error) {
        console.log(error);
    }
    console.log(result);
}))();
