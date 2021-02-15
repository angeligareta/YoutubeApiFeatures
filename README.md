<h1 align="center">YouTube API Features</h1>
<h4 align="center">Simple NPM Module for testing the YouTube API features</h4>

<p align="center">
  <img alt="ULL" src="https://img.shields.io/badge/University-La%20Laguna-%2354048c?style=flat-square" />  
  <img alt="License" src="https://img.shields.io/github/license/angeligareta/youtube-api-features?style=flat-square" />
  <a href="https://badge.fury.io/js/%40angeligareta%2Fyoutube-api-features"><img src="https://badge.fury.io/js/%40angeligareta%2Fyoutube-api-features.svg" alt="npm version" height="18"></a>
</p>

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
<p align="center">
  <a href="https://angeligareta.com" alt="Angel Igareta" target="_blank">
    <img
      style="max-width: 420px"
      src="https://lh3.googleusercontent.com/d/1a8GtvbvSP-kPeUBbFue3xuYZIMffFvFW=w600"
    />
  </a>
</p>
