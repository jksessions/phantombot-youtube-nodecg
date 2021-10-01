# phantombot-youtube-nodecg
 Implements the phantombot youtube player into nodecg

## Installing
To install the bundle, you must have first installed [NodeJS and npm](https://nodejs.org/en/).
Also make sure [Git](http://git-scm.com/) is installed

Create an install directory for NodeCG. on linux: `mkdir nodecg`

Install the NodeCG cli `npm install -g nodecg-cli`

CD into the NodeCG directory `cd nodecg`

Run these commands
```
nodecg setup
nodecg install jksessions/phantombot-youtube-nodecg
cd bundles/phantombot-youtube-nodecg
nodecg defaultconfig
npm run bild
```

Edit the config file created in the nodecg install directory `.cfg/phantombot-youtube-nodecg.json`.
This MUST be changed in order to run the bundle.

Then your ready to start. Go the the install directory and run `nodecg start`.

## API Reference
### Replicants
NodeCG has replicants. This bundle uses replicants in order to share data between files. Refer to the [NodeCG docs](https://nodecg.dev/docs/what-is-nodecg).

The replicants open are: `websocket`, `youtubeSonglist`, `youtubePlaylist`, `youtubeCurrentSong`, `youtubePlayPause`, `youtubePlayState`, `youtubeVolume`, `youtubePlayerReady`, `youtubeMute` and `youtubeDuration`

#### `websocket` 
##### Is the phantombot websocket connected
Returns `true` or `false`

#### `youtubeSonglist` Request List
##### Whatevers in the up next queue

```json
[{
 "song":"A5UXA4fKSME",
 "title":"WIN THE RACE On Drums!",
 "duration":"03:55",
 "requester":"jksessions"
},
...
]
```
`song` is the youtube id of the track cued.
`title` as stated, the title of the song.
`duration` how long the given track is.
`requester` who sends the request.

#### `youtubePlaylist` Playlist
##### Whatever plays when the queue is empty
Sends the following
```json
{
    "playlistname": "default",
    "playlist": [{
        "song": "E4R14RpWIi0",
        "title": "Friends (Hyper Potions) | Concert Band | Sonic Mania",
        "duration": "03:16"
    },
    ... 
    ]
}
```
`playlistname` is the name of the playlist, usually default.
`playlist` contains the array of the playlist.
`song` is the youtube id of the track cued.
`title` as stated, the title of the song.
`duration` how long the given track is.

#### `youtubeCurrentSong`
##### Current song playing
```json
{
 "id":"YS2-v6nqYQg",
 "title":"The Super Mario Super Medley - A Collaborative Musical Tribute to the History of Mario | FamilyJules",
 "user":"jksessions",
 "duration":"19:21"}
```
`id` is the youtube id of the track cued.
`title` as stated, the title of the song.
`user` who sends the request.
`duration` how long the given track is.

#### `youtubePlayPause`
##### Is the player playing or paused
Returns `true` or `false`

#### `youtubePlayState`
##### Players playstate
Returns an integer
```
-1 - Unstarted
0 - Ended
1 - Playing
2 - Paused
3 - Buffering
5 - Video Cued // Not used in current implementation
```
Refer to the [Youtube player API Reference](https://developers.google.com/youtube/iframe_api_reference#Playback_status)

#### `youtubeVolume`
##### Volume of the player
Returns an integer between `0-100`

#### `youtubePlayerReady`
##### Is the player loaded up yet
Returns `true` or `false`

#### `youtubeMute`
##### Is mute activated
Returns `true` or `false`

#### `youtubeDuration`
##### How far are we into the track
returns the following
```json
{
 "current":271.0033450915527,
 "max":1160.181
}
```
`current` is the amount of time (seconds) into the track.
`max` is the amount of time (seconds) that the track plays for.

### Messages

The bundle also uses NodeCG's `sendMessage()` function in order to forward data onto the websocket.

Straight commands without arguments are `'skipSong'`, `'stealSong'`, `'unstealSong'` and `'shufflePlaylist'`.

Command with variables are `'setVolume'`, `'updateSong'`, `'removeSongFromPlaylist'`, `'addSongToPlaylist'`, `'removeSongFromRequest'`, `'addSongToQueue'`, `'dbQuery'` and `'dbUpdate'`.

#### `'skipSong'`
##### Skip the song currently playing

#### `'stealSong'`
##### Adds current song playing to playlist

#### `'unstealSong'`
##### Removes current song playing from playlist

#### `'shufflePlaylist'`
##### Shuffles or unshuffles the playlist

#### `'setVolume'`
##### Lets the bot know of the volume change
`value` integer between `0-100`

#### `'updateSong'`
##### Changes the song to the one requested
`value` is the youtube id of the track cued.

#### `'removeSongFromPlaylist'`
##### Removes a given song from the playlist
`value` is the youtube id of the track cued.

#### `'addSongToPlaylist'`
##### Adds a given song from to playlist
`value` is the youtube id of the track cued.

#### `'removeSongFromRequest'`
##### Removes a given song from the Queue
`value` is the youtube id of the track cued.

#### `'addSongToQueue'`
##### Adds a given song to the Queue
`value` is the youtube id of the track cued.

#### `'getPlaylists'`
##### returns all the playlists in the database

#### `'ytSettings'`
##### returns all the settings in the database

#### `'dbQuery'`
##### Checks the database for data
Sent as the following
```
{
 command: 'dbQuery',
 callback_id: 'yt_settings',
 table: 'ytSettings'
}
```
`callback_id` is the id it uses to return data.
`table` is the SQLLite table it references to.
This does send a message with the given table.

#### `'dbUpdate'`
##### Sends data back to the SQLLite database
Sent as the following
```
{
 command: 'dbUpdate',
 callback_id: 'max_song_up',
 table: 'ytSettings',
 key: 'songRequestsMaxParallel',
 value: String(maxDuration)
}
```
`callback_id` the id it references to if a callback is needed.
`table` is the SQLLite table it writes to.
`key` is the datapoint to change.
`value` is the data to put in.

### Have Fun with it
