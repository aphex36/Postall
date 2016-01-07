var request = require('request');

var YT_URL = 'https://www.googleapis.com/youtube/v3/search';
var YT_API_KEY = 'AIzaSyDDP01Gnj3-wfoqM59xQz6pryJQhmYWCt8';
var YT_EMBED_URL = 'http://www.youtube.com/embed/';
var STATUS_OK = 200;

/**
 * Queries YouTube for tracks that match the given query
 *
 * @param query - the search query to send to YouTube
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {

  /* callbackYoutube will be the callback made on the results received from the get request
  * Take results array (filled with the return values) and for each of the result
  * take create a simplifiedVideo reference and add specific attributes and then
  * push each of those simplifiedVideoResults and call the callback(null, simplifiedResults)
  */
  var callbackYoutube = function(error, response, body)
  {
    if(error == null && response.statusCode == STATUS_OK)
    {
      var simplifiedResults = [];
      var results = JSON.parse(body);
      for(var i = 0; i <= results.items.length - 1; i++)
      {
        var simplifiedVideo = {'title': results.items[i].snippet.title, 'source': YT_EMBED_URL + results.items[i].id.videoId};
        simplifiedResults.push(simplifiedVideo);
      }
      callback(null, simplifiedResults);
    }
    else
    {
      //Error occurred so just call callback(error);
      callback(error);
    }
  };

  var modifiedQuery = query.split(" ").join("+");
  var url = YT_URL+ "?part=snippet&q=" + modifiedQuery + "&key=" + YT_API_KEY;

  //Send the request on the given url
  request(url, callbackYoutube);
};
