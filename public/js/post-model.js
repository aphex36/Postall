(function(window, document, undefined) {
  var PostModel = {};

  var POSTS_URL= '/posts';
  var STATUS_OK = 200;

  /**
   * Loads all newsfeed posts from the server.
   *
   * Calls: callback(error, posts)
   *  error -- the error that occurred or null if no error occurred
   *  results -- an array of newsfeed posts
   */
  PostModel.loadAll = function(callback) {

    /*Create a new request (a get to /posts/) and in its callback, it will receive the
    * all posts so call callback with the parsed responseText (which is all posts)
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
        callback(null, JSON.parse(request.responseText));
      }
    });
    request.open("GET", "http://localhost:3000/posts");
    request.send();
  };

  /* Adds the given post to the list of posts. The post must *not* have
   * an _id associated with it.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the post added, with an _id attribute
   */
  PostModel.add = function(post, callback) {

    /*Create a new request (a post with extension /posts/) and in its callback, it will receive the
    * stringified new post so call callback with the parsed
    * new post, if there was no error
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
        callback(null, JSON.parse(request.responseText));
      }
    });
    request.open("POST", "http://localhost:3000/posts");
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(post));
  };

  /* Removes the post with the given id.
   *
   * Calls: callback(error)
   *  error -- the error that occurred or null if no error occurred
   */
  PostModel.remove = function(id, callback) {

    /*Create a new request (a post to /posts/remove) and in its callback, it will receive
    * nothing (server will haveremoved the post and sent an empty body)
    * so if no error just execute callback(request.responseText);
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
        callback(null);
      }
    });
    request.open("POST", "http://localhost:3000/posts/remove");
    request.setRequestHeader('Content-type', 'application/json');

    var postToDelete = {id: id};
    request.send(JSON.stringify(postToDelete));
  };

  /* Upvotes the post with the given id.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the updated post model
   */
  PostModel.upvote = function(id, callback) {

    /*Create a new request (a post to /posts/upvote) and in its callback, it will receive the
    * stringified updated post (with one more upvote) so call callback with the parsed
    * updated post.
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
        callback(null, JSON.parse(request.responseText));
      }
    });
    request.open("POST", "http://localhost:3000/posts/upvote");
    request.setRequestHeader('Content-type', 'application/json');
    var postToUpdate = {id: id};
    request.send(JSON.stringify(postToUpdate));
  };
  
  window.PostModel = PostModel;
})(this, this.document);
