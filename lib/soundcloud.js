var request = require('request');

var SC_URL = 'https://api.soundcloud.com/tracks.json';
var SC_CLIENT_ID = '1c3aeb3f91390630d351f3c708148086';
var SC_EMBED_URL = 'https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F';
var STATUS_OK = 200;

/**
 * Queries SoundCloud for tracks that match the given query.
 *
 * @param query -- the search query to send to SoundCloud
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {

  /* This will define the callbackSoundCloud as the callback to be called
   * when the request is made for all soundCloud query results
   * make a simplified track out of each of the results (soundcloud's tracks)
   * and stuff that into simplifiedResults and call the callback with simplifiedResults
   */
  var callbackSoundCloud = function(error, response, body)
  {
    if(error == null && response.statusCode == 200)
    {
      var simplifiedResults = [];
      var results = JSON.parse(body);
      for(var i = 0; i <= results.length-1; i++)
      {
        var simplifiedTrack = {'title': results[i].title, 'source': SC_EMBED_URL + results[i].id};
        simplifiedResults.push(simplifiedTrack);
      }
      callback(null, simplifiedResults);
    }
    else
    {
      //There was an error so callback(error)
      callback(error);
    }
  };
  var url = SC_URL+ "?client_id=" + SC_CLIENT_ID + "&q=" + query;

  //Make the get request using the above url
  request(url, callbackSoundCloud);
};
