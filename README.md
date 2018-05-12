# YoutubeApiFeatures

## Description
Simple NPM Module for testing the features that the youtube api has. The module has the following features.
  - Given a channel id or name, it shows the description.
  - Given a channel name, it shows it's last uploads.
  - Given a quest, it looks for videos in youtube search.
  - Given a quest, it looks for channels in youtube search.

## How to use
First of all we have to follow the steps from: [Node.js QuickStart](https://developers.google.com/youtube/v3/quickstart/nodejs) and download our client_secret.json.

Now, for using the features of the module, here we have an example of use:

```javascript
let startFunctionOnMode = require('@angeligareta/youtube-api-features');

// FUNCTIONS THAT CAN BE EXECUTED USING YOUTUBE API:
// Given a video ID, it shows all the comments.
const VIDEO_ID = "EhkxgMchJrA";
startFunctionOnMode(0, {videoId : VIDEO_ID});

// Given a channel id, it shows the description.
let CHANNEL_ID = "UChBkxLPlKqEjl7_g3pfIlqw";
startFunctionOnMode(1, {id: CHANNEL_ID});

// Given a channel name, it shows the description.
let CHANNEL_NAME = "WorkingAndroid";
startFunctionOnMode(1, {forUsername: CHANNEL_NAME});

// Given a channel name, it shows it's last uploads.
let CHANNEL_NAME_2 = "WorkingAndroid";
startFunctionOnMode(2, {forUsername: CHANNEL_NAME_2});

// Given a quest, look for videos in the youtube search.
let quest = "Feeling The Net";
startFunctionOnMode(3, {q: quest});

// Given a quest, look for channels in the youtube search.
startFunctionOnMode(4, {q: quest});
```

## Author
[Ángel Igareta](https://github.com/angeligareta)
