(function(window, document, undefined) {
  var SearchModel = {};

  var SEARCH_URL = '/search';
  var STATUS_OK = 200;

  /**
   * Loads API search results for a given query.
   *
   * Calls: callback(error, results)
   *  error -- the error that occurred or NULL if no error occurred
   *  results -- an array of search results
   */
  SearchModel.search = function(query, callback) {

    /*In this, it will send a get request with /search as the extension, and will
    * receive a stringified JSON array of the top result from each of the APIs
    * so parse that and call the callback on that, if there was no error
    */
    var request = new XMLHttpRequest();
    request.addEventListener('load', function()
    {
      if(request.status != STATUS_OK)
      {
        callback(request.responseText);
      }
      else
      {
        callback(null, JSON.parse(request.responseText))
      }
    });

    //Takes care of special characters
    var formattedQuery = encodeURIComponent(query);
    request.open("GET", "http://localhost:3000/search?query=" + formattedQuery);
    request.send();
  };

  window.SearchModel = SearchModel;
})(this, this.document);
