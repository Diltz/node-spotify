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
exports.spotifyAPI = void 0;
const API_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_GET_TRACKINFO_ENDPOINT = 'https://api.spotify.com/v1/tracks/'; // {id}
const API_GET_PLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/playlists/';
class spotifyAPI {
    constructor(clientid, secret) {
        this.hasAuthenticated = false;
        this.refreshTokenAt = new Date();
        this.clientid = clientid;
        this.secret = secret;
    }
    isTokenValid() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasAuthenticated) {
                console.log('[SpotifyAPI] You must authenticate first before using other methods');
                return false;
            }
            else if (new Date() < this.refreshTokenAt)
                return true;
            try {
                this.hasAuthenticated = false;
                console.log('[SpotifyAPI] access_token has expired. Refreshing');
                yield this.authenticate([]);
            }
            catch (error) {
                console.error('[SpotifyAPI] failed refreshing token.\n' + error);
                return false;
            }
            console.log(`[SpotifyAPI] access_token refreshed!`);
            return true;
        });
    }
    // this api request only requests for track name and artists data
    getPlaylist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isTokenValid()))
                return;
            let response;
            try {
                response = yield fetch(`${API_GET_PLAYLIST_ENDPOINT}${id}?fields=tracks%28items%28track%28artists%2Cname%29%29%29%2Cname`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            }
            catch (error) {
                throw new Error('[SpotifyAPI] Failed to get playlist data.\n Error: ' + error);
            }
            const body = yield response.json();
            if (response.status != 200) {
                throw new Error(`[SpotifyAPI] Get Playlist Info failed.\nStatus: ${response.status}\nResponse body: ${JSON.stringify(body)}`);
            }
            const playlist = {
                name: body.name,
                tracks: []
            };
            // add all tracks
            Object.values(body.tracks.items).forEach((track) => {
                let artists = [];
                track.track.artists.forEach((artist) => {
                    artists.push(artist.name);
                });
                playlist.tracks.push({
                    name: track.track.name,
                    artists: artists
                });
            });
            //
            return playlist;
        });
    }
    getTrackInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isTokenValid()))
                return;
            let response;
            try {
                response = yield fetch(API_GET_TRACKINFO_ENDPOINT + id, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            }
            catch (error) {
                throw new Error('[SpotifyAPI] Failed to get track token.\n Error: ' + error);
            }
            let body = yield response.json();
            if (response.status != 200) {
                throw new Error(`[SpotifyAPI] Get Track Info failed.\nStatus: ${response.status}\nResponse body: ${JSON.stringify(body)}`);
            }
            let result = {
                name: body.name,
                artists: []
            };
            body.artists.forEach((artist) => {
                result.artists.push(artist.name);
            });
            return result;
        });
    }
    authenticate(scopes) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if already authenticated
            if (this.hasAuthenticated) {
                return console.log('[SpotifyAPI] You already have authenticated.');
            }
            //
            let response;
            let body = 'grant_type=client_credentials'; // request body
            if ((scopes === null || scopes === void 0 ? void 0 : scopes.length) > 0) { // if we got scopes, we add them to request body
                body += '&scope=' + scopes.join(' ');
            }
            try {
                response = yield fetch(API_TOKEN_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${Buffer.from(this.clientid + ':' + this.secret).toString('base64')}` // authorization is Base64 encoded clientid:clientsecret
                    },
                    body: body
                });
            }
            catch (error) {
                throw new Error('[SpotifyAPI] Failed to access token.\n Error: ' + error);
            }
            const response_body = yield response.json();
            if (response.status == 200) {
                console.log('[SpotifyAPI] Authentication successful.');
            }
            else {
                throw new Error(`[SpotifyAPI] Authentication failed.\nStatus: ${response.status}\nResponse body: ${JSON.stringify(response_body)}`);
            }
            // update class with auth data
            this.hasAuthenticated = true;
            this.refreshTokenAt = new Date(Date.now() + (response_body.expires_in - 10) * 1000);
            this.token = response_body.access_token;
        });
    }
}
exports.spotifyAPI = spotifyAPI;
