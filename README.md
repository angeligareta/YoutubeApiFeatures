# YoutubeApiFeatures
[![npm version](https://badge.fury.io/js/%40angeligareta%2Fyoutube-api-features.svg)](https://badge.fury.io/js/%40angeligareta%2Fyoutube-api-features)

## Description
Simple NPM Module for testing the features that the youtube api has. The module has the following features.
  - Given a channel id or name, it shows the description.
  - Given a channel name, it shows it's last uploads.
  - Given a quest, it looks for videos in youtube search.
  - Given a quest, it looks for channels in youtube search.

## How to use
First of all we have to follow the steps from: [Node.js QuickStart](https://developers.google.com/youtube/v3/quickstart/nodejs) and download our client_secret.json.
Note: We have to pass a callback to make something with the result.

Now, for using the features of the module, here we have an example of use:
```javascript
let startFunctionOnMode = require('@angeligareta/youtube-api-features');

// FUNCTIONS THAT CAN BE EXECUTED USING YOUTUBE API:
const VIDEO_ID = "EhkxgMchJrA";
startFunctionOnMode(0, {videoId : VIDEO_ID}).then((returnData) => console.log(returnData));

let CHANNEL_ID = "UChBkxLPlKqEjl7_g3pfIlqw";
startFunctionOnMode(1, {id: CHANNEL_ID}).then((returnData) => console.log(returnData));

// Given a channel name, it shows the description.
let CHANNEL_NAME = "WorkingAndroid";
startFunctionOnMode(1, {forUsername: CHANNEL_NAME}).then((returnData) => console.log(returnData));

// Given a channel name, it shows it's last uploads.
let CHANNEL_NAME_2 = "WorkingAndroid";
startFunctionOnMode(2, {forUsername: CHANNEL_NAME_2}).then((returnData) => console.log(returnData));

// Given a quest, look for videos in the youtube search.
let quest = "Feeling The Net";
startFunctionOnMode(3, {q: quest}).then((returnData) => console.log(returnData));

// Given a quest, look for channels in the youtube search.
startFunctionOnMode(4, {q: quest}).then((returnData) => console.log(returnData));
```

## Author
[Ángel Igareta](https://github.com/angeligareta)
