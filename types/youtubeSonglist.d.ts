export interface youtubeSonglistItem {
    duration: string;
    requester: string;
    song: string;
    title: string;
}

export interface youtubeSonglist extends Array<youtubeSonglistItem> {}