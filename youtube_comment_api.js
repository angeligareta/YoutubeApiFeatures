let startFunctionOnMode = require('./youtube-auth.js');

// const VIDEO_ID = "6O0vS4b0n4k";
// startFunctionOnMode(0, {videoId : VIDEO_ID}).then((returnData) => console.log(returnData));

// let CHANNEL_ID = "UChBkxLPlKqEjl7_g3pfIlqw";
// startFunctionOnMode(1, {id: CHANNEL_ID}).then((returnData) => console.log(returnData));

// Given a channel name, it shows the description.
// let CHANNEL_NAME = "WorkingAndroid";
// startFunctionOnMode(1, {forUsername: CHANNEL_NAME}).then((returnData) => console.log(returnData));
//
// Given a channel name, it shows it's last uploads.
let CHANNEL_NAME_2 = "WorkingAndroid";
startFunctionOnMode(2, {forUsername: CHANNEL_NAME_2}).then((returnData) => console.log(returnData));
//
// // Given a quest, look for videos in the youtube search.
// let quest = "Feeling The Net";
// startFunctionOnMode(3, {q: quest}).then((returnData) => console.log(returnData));
//
// // Given a quest, look for channels in the youtube search.
// startFunctionOnMode(4, {q: quest}).then((returnData) => console.log(returnData));
