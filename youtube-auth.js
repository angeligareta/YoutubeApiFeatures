let fs = require('fs');
let readline = require('readline');
let { google } = require('googleapis');
let { OAuth2Client } = require('google-auth-library');

const {table, getBorderCharacters} = require('table');
const colors = require('colors');
const inspect = require("util").inspect;
let ins = (x) => inspect(x, { depth: null });

// ** YOUTUBE API FUNCTIONS **
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/google-apis-nodejs-quickstart.json
let SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
let TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
let TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';

/**
 * Create an OAuth2 clieauthnt with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, requestData, callback) {
  let clientSecret = credentials.installed.client_secret;
  let clientId = credentials.installed.client_id;
  let redirectUrl = credentials.installed.redirect_uris[0];
  let oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, requestData, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, requestData);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, requestData, callback) {
  let authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, requestData);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Create a JSON object, representing an API resource, from a list of
 * properties and their values.
 *
 * @param {Object} properties A list of key-value pairs representing resource
 *                            properties and their values.
 * @return {Object} A JSON object. The function nests properties based on
 *                  periods (.) in property names.
 */
function createResource(properties) {
  let resource = {};
  let normalizedProps = properties;
  for (let p in properties) {
    let value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      let adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }
  for (let p in normalizedProps) {
    // Leave properties that don't have values out of inserted resource.
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      let propArray = p.split('.');
      let ref = resource;
      for (let pa = 0; pa < propArray.length; pa++) {
        let key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    };
  }
  return resource;
}

// Start is a method that receives a mode depending on the wanted output and the necessary parameters for getting that output.
function startFunctionOnMode(mode, authorizeParameters) {
  return new Promise(function(resolve, reject) {
    authorizeParameters.callBack = resolve;

    // Load client secrets from a local file and execute a function depending on the function argument.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      switch (mode) {
        case 0: // Given a video ID, it shows all the comments.
        if (typeof authorizeParameters.videoId === 'undefined') {
          throw new TypeError('Invalid argument for show youtube comments. Missing videoId attribute.');
        }
        else {
          authorize(JSON.parse(content), authorizeParameters, commentsList);
        }
        break;
        case 1: // Given a channel id or name, it shows the description.
        if ((typeof authorizeParameters.id === 'undefined') && (typeof authorizeParameters.forUsername === 'undefined')) {
          throw new TypeError('Invalid argument for show youtube videos. Missing id or forUsername attribute.');
        }
        else {
          authorize(JSON.parse(content), authorizeParameters, channelInfo);
        }
        break;
        case 2: // Given a channel name, it shows it's last uploads.
        if (typeof authorizeParameters.forUsername === 'undefined') {
          throw new TypeError('Invalid argument for show youtube videos. Missing forUsername attribute.');
        }
        else {
          authorize(JSON.parse(content), authorizeParameters, videoList);
        }
        break;
        case 3: // Given a quest, it looks for videos in youtube search.
        if (typeof authorizeParameters.q === 'undefined') {
          throw new TypeError('Invalid argument for show youtube videos. Missing q attribute.');
        }
        else {
          authorize(JSON.parse(content), authorizeParameters, searchVideo);
        }
        break;
        case 4: // Given a quest, it looks for channels in youtube search.
        if (typeof authorizeParameters.q === 'undefined') {
          throw new TypeError('Invalid argument for show youtube videos. Missing q attribute.');
        }
        else {
          authorize(JSON.parse(content), authorizeParameters, searchChannel);
        }
        break;
      }
    });
  });
}

// // Given a video ID, it shows all the comments.
function commentsList(auth, requestData) {
  let service = google.youtube('v3');
  let parameters = {'auth': auth, 'part': 'snippet,replies', videoId: requestData.videoId};

  let totalComments = (typeof requestData.totalComments !== 'undefined') ? requestData.totalComments : 20;
  let tableHeader = [colors.red('NUMBER'), colors.green('DATE'), colors.blue('AUTHOR'), colors.yellow('COMMENTS')];
  readComments(auth, requestData.videoId, undefined, totalComments, [tableHeader], requestData.callBack);
}

function readComments(auth, videoId, responseData, totalComments, returnData, callBack) {
  let service = google.youtube('v3');
  let parameters;
  if (responseData !== undefined) {
    parameters = {'auth': auth, 'part': 'snippet,replies', videoId: videoId, pageToken: responseData.nextPageToken};
  }
  else {
    parameters = {'auth': auth, 'part': 'snippet,replies', videoId: videoId};
  }

  service.commentThreads.list(parameters, function(err, response) {
    if (err) {
      console.log('Do you have internet? The API returned an error: ' + err);
      return;
    }

    let nextResponseData = response.data;
    let currentTotalComments = totalComments;
    let currentReturnData = returnData;

    if (nextResponseData.items.length > 0) {
      nextResponseData.items.forEach(function(item) {
        let topComment = item.snippet.topLevelComment;
        let index = currentReturnData.length;
        let date = topComment.snippet.publishedAt;
        let author = topComment.snippet.authorDisplayName;
        let text = topComment.snippet.textOriginal;
        text = text.replace(/\n/g, ''); // Remove control characters for table module.

        let row = [index, date, author, text];

        let textPresent = false;
        currentReturnData.forEach(([index, date, author, comment]) => {
          if (comment == text) {
            textPresent = true;
          }
        });

        if (!textPresent) {
          currentReturnData.push(row);
        }
        currentTotalComments --;
      });
      if (currentTotalComments > 0) {
        readComments(auth, videoId, nextResponseData, currentTotalComments, currentReturnData, callBack);
      }
      else {
        let tableConfig = {
          border: getBorderCharacters(`norc`),
          columns: {
            3: { width: 100 }
          }
        };
        let resultingTable = table(currentReturnData, tableConfig);
        callBack(resultingTable);
      }
    }
    else {
      let tableConfig = {
        border: getBorderCharacters(`norc`),
        columns: {
          3: { width: 100 }
        }
      };
      let resultingTable = table(currentReturnData, tableConfig);
      callBack(resultingTable);
    }
  });
}

// Given a channel name or id, it shows the description.
function channelInfo(auth, requestData) {
  let service = google.youtube('v3');
  let parameters;
  if (typeof requestData.id !== 'undefined') {
    parameters = {auth: auth, part: 'snippet, contentDetails, statistics', id: requestData.id};
  }
  else {
    parameters = {auth: auth, part: 'snippet, contentDetails, statistics', forUsername: requestData.forUsername};
  }

  //console.log(service);
  service.channels.list(parameters, function(err, response) {
    if (err) {
      console.log('Do you have internet and does the channel exist? The API returned an error: ' + err);
      return;
    }
    let channelDetails = response.data.items[0].snippet;
    let channelStatistics = response.data.items[0].statistics;
    let channelPlaylists = response.data.items[0].contentDetails.relatedPlaylists;

    let returnData = "";
    returnData += "\t- Creation time: " + channelDetails.publishedAt + "\n";
    returnData += "\t- Number of total views: " + channelStatistics.viewCount + "\n";
    returnData += "\t- Number of subscribers: " + channelStatistics.subscriberCount + "\n";
    returnData += "\t- Number of videos: " + channelStatistics.videoCount + "\n";
    returnData += "\t- Upload playlist: " + channelPlaylists.uploads + "\n";
    returnData += "\t-Description of the channel: " + channelDetails.description + "\n";
    if (typeof requestData.callBack !== 'undefined') {
      requestData.callBack(returnData);
    }
  });
}

// Given a channel name, it shows it's last uploads.
function videoList(auth, requestData) {
  let service = google.youtube('v3');
  let parameters = {auth: auth, part: 'snippet, contentDetails, statistics', forUsername: requestData.forUsername};

  // Get the playlist of recent uploads of the channel.
  service.channels.list(parameters, function(err, response) {
    if (err) {
      console.log('Do you have internet and does the channel exist? The API returned an error: ' + err);
      return;
    }
    let channelPlaylists = response.data.items[0].contentDetails.relatedPlaylists;
    let playlist = channelPlaylists.uploads;

    let playListParameters = {auth: auth, part: 'snippet, contentDetails', playlistId: playlist};
    service.playlistItems.list(playListParameters, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }

      let returnData = "";
      let videoList = response.data.items;
      videoList.forEach(function (video, i) {
        let videoDetails = video.snippet;
        returnData += "#" + (i + 1) + ": " + videoDetails.title + "\n";
      });
      if (typeof requestData.callBack !== 'undefined') {
        requestData.callBack(returnData);
      }
    });
  });
}

// Given a quest, it shows the youtube search results.
function searchVideo(auth, requestData) {
  let service = google.youtube('v3');
  let parameters = {auth: auth, part: 'snippet', q: requestData.q, type: 'video', maxResults: 10};

  // Get the playlist of recent uploads of the channel.
  service.search.list(parameters, function(err, response) {
    if (err) {
      console.log('Do you have internet and does the channel exist? The API returned an error: ' + err);
      return;
    }

    let videoList = response.data.items;
    let returnData = "";
    videoList.forEach(function (video, i) {
      let videoDetails = video.snippet;
      returnData += "#" + (i + 1) + ": " + videoDetails.title + "\n";
    });
    if (typeof requestData.callBack !== 'undefined') {
      requestData.callBack(returnData);
    }
  });
}

// Given a quest, it shows the youtube search results.
function searchChannel(auth, requestData) {
  let service = google.youtube('v3');
  let parameters = {auth: auth, part: 'snippet', q: requestData.q, type: 'channel', maxResults: 10};

  // Get the playlist of recent uploads of the channel.
  service.search.list(parameters, function(err, response) {
    if (err) {
      console.log('Do you have internet and does the channel exist? The API returned an error: ' + err);
      return;
    }

    let videoList = response.data.items;
    let returnData = "";
    videoList.forEach(function (video, i) {
      let videoDetails = video.snippet;
      returnData += "#" + (i + 1) + ": " + videoDetails.title + "\n";
    });
    if (typeof requestData.callBack !== 'undefined') {
      requestData.callBack(returnData);
    }
  });
}

module.exports = startFunctionOnMode;
