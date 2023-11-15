import { SpotifyClient } from './api.js'

let spotify = new SpotifyClient('your_client_id_here', 'your_secret_here');

(async () => {
    await spotify.authenticate([]);
    let result

    try {
        result = await spotify.getPlaylist('7yOowMIM2QnbuRwzx96WMl')
    } catch (error) {
        console.log(error)
    }
})()