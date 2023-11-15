export interface PlaylistData {
    name: string;
    tracks: TrackInfo[];
  }
  
export interface TrackInfo {
    name: string;
    artists: string[];
}

export declare class SpotifyClient {
    public clientid: string;

    constructor(clientid: string, secret: string);
    
    public getPlaylist(id: string): Promise<PlaylistData | undefined>;
    public getTrackInfo(id: string): Promise<TrackInfo | undefined>;
    public authenticate(scopes: [string?]): Promise<void>;
}