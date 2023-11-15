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
function getAccessToken(clientId, clientSecret) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            },
            body: 'grant_type=client_credentials'
        });
        const data = yield response.json();
        console.log(data);
        return data.access_token;
    });
}
;
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield getAccessToken('42579b56482b4e99b4c98c169a704e75', 'c190b0220a46460abc60f83107ef9802'));
}))();
