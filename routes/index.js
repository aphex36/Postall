// TODO: put any require() calls here
var request = require("request");
var soundcloud = require("../lib/soundcloud.js");
var youtube = require("../lib/youtube.js");
var flickr = require("../lib/flickr.js");
var Post = require("../models/post.js");

module.exports = function(app) {

  /* Renders the newsfeed landing page. */
  app.get('/', function(request, response) {
    response.render('index.html');
  });

  // Search route
  app.get('/search', function(request, response)
  {
    //Get user input from request
    var q = request.query.query;

    //Set a counter to keep track each of the API calls, and a limit for API calls
    var counter = 0;
    var API_LIMIT = 3;

    //allResults stores one JSON object from each of the APIs
    var allResults = [];

    //Invoke SoundCloud API
    soundcloud.search(q, function(error, results)
    {
      //Increase the counter, and set the bestResult to null
      counter++;
      var bestResult = {};

      //If there is no error, get the results from the soundcloud search method
      //If the length isn't 0, that means there is a result, so store the first result in bestResult
      //otherwise it will add nothing. Now put that into allResults(which will contain all 3 top results from each API)
      if(error == null)
      {
        var soundCloudResultsArray = results;
        if(soundCloudResultsArray.length != 0)
        {
          bestResult = soundCloudResultsArray[0];
          bestResult.api = "soundcloud";
          allResults.push(bestResult);
        }
      }

      //Return if return value is the last API to return
      if(counter == API_LIMIT)
      {
        response.json(200, allResults);
      }
    });

    //Invoke Youtube API
    youtube.search(q, function(error, results)
    {
      counter++;
      var bestResult = {};

      //If there is no error, get the results from the youtube search method
      //If the length isn't 0, that means there is a result, so store the first result in bestResult
      //otherwise it will add nothing. Now put that into allResults(which will contain all 3 top results from each API)
      if(error == null)
      {
        var youtubeResultsArray = results;
        if(youtubeResultsArray.length != 0)
        {
          bestResult = youtubeResultsArray[0];
          bestResult.api = "youtube";
          allResults.push(bestResult);
        }
      }

      //Return if return value is the last API to return
      if(counter == API_LIMIT)
      {
        response.json(200, allResults);
      }
    });

    //Invoke Flickr API
    flickr.search(q, function(error, results)
    {
      counter++;
      var bestResult = {};

      //If there is no error, get the results from the flickr search method
      //If the length isn't 0, that means there is a result, so store the first result in bestResult
      //otherwise it will add nothing. Now put that into allResults(which will contain all 3 top results from each API)
      if(error == null)
      {
        var flickrSearchArray = results;
        if(flickrSearchArray.length != 0)
        {
          bestResult = flickrSearchArray[0];
          bestResult.api = "flickr";
          allResults.push(bestResult);
        }
      }

      //Return if return value is the last API to return
      if(counter == API_LIMIT)
      {
        response.json(200, allResults);
      }
    });
  });

  //Route for creating a post
  app.post('/posts', function(request, response)
  {
    //Create a new post based on the postSchema in post.js
    var newPost = new Post({
      api : request.body.api,
      title : request.body.title,
      source : request.body.source,
      upvotes : 0,
    });

    //Save that new post to the database, and send that post in the callback as a response
    // to PostModel.add()
    newPost.save(function(error)
    {
      if(error)
      {
        throw error;
      }

      response.json(200, newPost);
    });

  });

  //Route for getting every post
  app.get('/posts', function(request, response)
  {
    //Find all the posts and in the callback return that as a response to PostModel.loadAll()
    Post.find(function(error, posts)
    {
      if(error)
      {
        throw error;
      }
      response.json(200, posts);
    });
  });

  //Route for deleting a post
  app.post('/posts/remove', function(request, response)
  {
    //Use findByIdAndRemove, and send an empty response to PostModel.remove()
    Post.findByIdAndRemove(request.body.id, function(error)
    {
      if(error)
      {
        throw error;
      }
      response.json(200, {});
    });
  });

  //Route for upvoting a certain post
  app.post('/posts/upvote', function(request, response)
  {
    //Find that post using findById, and in the callback take that post
    //and increment its upvotes, and save that updated post, and then send it
    //in save's callback as a response to PostModel.upvote()

    Post.findById(request.body.id, function(error, upvotedPost)
    {
      if(error)
      {
        throw error;
      }
      upvotedPost.upvotes = upvotedPost.upvotes + 1;

      upvotedPost.save(function(error) {
    		if (error) {
  				throw error;
  			}
        response.json(200, upvotedPost);
  	   });
    });
  });

};
