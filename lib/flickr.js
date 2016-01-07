var request = require('request');

var FLICKR_URL = 'https://api.flickr.com/services/rest/?';
var FLICKR_API_KEY = '3cffcc97867ea6aaf3d7fa2690f0ae10';
var STATUS_OK = 200;

/**
 * Queries Flickr for photos that match the given query.
 *
 * @param query -- the search query to send to Flickr
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {

  /*Define a method callbackFlickr that will take error, response, and body
  This will take the body, parse it as results (from the Flickr get request)
  for each result, take the title, and create the source, and stuff all that in
  simplifiedResults and call the callback with simplifiedResults*/

  var callbackFlickr = function(error, response, body)
  {
    if(error == null && response.statusCode == STATUS_OK)
    {
      var simplifiedResults = [];
      var results = JSON.parse(body);
      for(var i = 0; i <= results.photos.photo.length-1; i++)
      {
        var simplifiedPhoto = {
          'title': results.photos.photo[i].title,
          'source': 'https://farm' + results.photos.photo[i].farm + '.staticflickr.com/'
                    + results.photos.photo[i].server + '/' + results.photos.photo[i].id + '_'
                    + results.photos.photo[i].secret + '_z.jpg'
        };

        simplifiedResults.push(simplifiedPhoto);
      }
      callback(null, simplifiedResults);
    }
    else
    {
      //There was an error, so call callback(error);
      callback(error);
    }
  };

  //Form the url for the Flickr Search Request and call request(url, callbackFlickr)
  //callbackFlickr was defined earlier
  var url = FLICKR_URL + "api_key=" + FLICKR_API_KEY + "&text=" + query
            + "&method=flickr.photos.search&format=json&media=photos&sort=relevance&nojsoncallback=1";
  request(url, callbackFlickr);
};
