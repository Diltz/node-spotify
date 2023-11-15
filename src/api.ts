const API_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const API_GET_TRACKINFO_ENDPOINT = 'https://api.spotify.com/v1/tracks/'
const API_GET_PLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/playlists/'

interface AuthSuccessBody {
    access_token: string,
    token_type: string,
    expires_in: number
}

export interface PlaylistData {
    name: string,
    tracks: TrackInfo[]
}

export interface TrackInfo {
    name: string,
    artists: string[]
}

export class SpotifyClient {
    private hasAuthenticated: boolean = false;
    private refreshTokenAt: Date = new Date();
    private token: string | undefined;
    private secret: string | undefined;
    public clientid: string;

    constructor (clientid: string, secret: string) {
        this.clientid = clientid;
        this.secret = secret
    }

    private async isTokenValid(): Promise<boolean> {
        if (!this.hasAuthenticated) {
            console.log('[SpotifyAPI] You must authenticate first before using other methods')
            return false
        } else if (new Date() < this.refreshTokenAt) return true;

        try {
            this.hasAuthenticated = false;
            console.log('[SpotifyAPI] access_token has expired. Refreshing')
            await this.authenticate([])
        } catch (error) {
            console.error('[SpotifyAPI] failed refreshing token.\n' + error)
            return false;
        }

        console.log(`[SpotifyAPI] access_token refreshed!`)

        return true;   
    }

    // this api request only requests for track name and artists data
    public async getPlaylist(id: string): Promise<PlaylistData | undefined> {
        if (!await this.isTokenValid()) return;

        let response

        try {
            response = await fetch(`${API_GET_PLAYLIST_ENDPOINT}${id}?fields=tracks%28items%28track%28artists%2Cname%29%29%29%2Cname`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })
        } catch (error) {
            throw new Error('[SpotifyAPI] Failed to get playlist data.\n Error: ' + error)
        }

        const body = await response.json()

        if (response.status != 200) {
            throw new Error(`[SpotifyAPI] Get Playlist Info failed.\nStatus: ${response.status}\nResponse body: ${JSON.stringify(body)}`)
        }

        const playlist: PlaylistData = {
            name: body.name,
            tracks: []
        }

        // add all tracks

        Object.values(body.tracks.items).forEach((track: any) => {
            let artists: string[] = []

            track.track.artists.forEach((artist: { name: string }) => {
                artists.push(artist.name)
            })

            playlist.tracks.push({
                name: track.track.name,
                artists: artists
            })
        })

        //

        return playlist;
    }

    public async getTrackInfo(id: string): Promise<TrackInfo | undefined> {
        if (!await this.isTokenValid()) return;

        let response;

        try {
            response = await fetch(API_GET_TRACKINFO_ENDPOINT + id, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })
        } catch (error) {
            throw new Error('[SpotifyAPI] Failed to get track token.\n Error: ' + error)
        }

        let body = await response.json()

        if (response.status != 200) {
            throw new Error(`[SpotifyAPI] Get Track Info failed.\nStatus: ${response.status}\nResponse body: ${JSON.stringify(body)}`)
        }

        let result: TrackInfo = {
            name: body.name,
            artists: []
        }

        body.artists.forEach((artist: { name: string; }) => {
            result.artists.push(artist.name)
        })

        return result
    }

    public async authenticate(scopes: [string?]) {
        // check if already authenticated

        if (this.hasAuthenticated) {
            return console.log('[SpotifyAPI] You already have authenticated.')
        }

        //

        let response
        let body = 'grant_type=client_credentials' // request body

        if (scopes?.length > 0) { // if we got scopes, we add them to request body
            body += '&scope=' + scopes.join(' ')
        }

        try {
            response = await fetch(API_TOKEN_ENDPOINT, { // new http request
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(this.clientid + ':' + this.secret).toString('base64')}` // authorization is Base64 encoded clientid:clientsecret
                },
                body: body
            })
        } catch (error) {
            throw new Error('[SpotifyAPI] Failed to access token.\n Error: ' + error)
        }

        const response_body: AuthSuccessBody = await response.json()

        if (response.status == 200) {
            console.log('[SpotifyAPI] Authentication successful.')
        } else {
            throw new Error(`[SpotifyAPI] Authentication failed.\nStatus: ${response.status}\nResponse body: ${JSON.stringify(response_body)}`)
        }

        // update class with auth data

        this.hasAuthenticated = true;
        this.refreshTokenAt = new Date(Date.now() + (response_body.expires_in - 10) * 1000);
        this.token = response_body.access_token
    }
}