(function(window, document, undefined) {
  var NewsfeedView = {};

  /* Renders the newsfeed into the given $newsfeed element. */
  NewsfeedView.render = function($newsfeed) {
    PostModel.loadAll(function(error, posts)
    {
      //Call renderPost on all posts
      for(var i = 0; i < posts.length; i++)
      {
        NewsfeedView.renderPost($newsfeed, posts[i], false);
      }
      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry({
          columnWidth: '.post',
          itemSelector: '.post'
        });
      });
    });
  };

  /* Given post information, renders a post element into $newsfeed. */
  NewsfeedView.renderPost = function($newsfeed, post, updateMasonry) {

    // Gets the newsfeedTemplate and compiles that in renderSpecificPost
    var newsfeedTemplateHTML = $('#newsfeed-post-template').html()
    var renderSpecificPost = Handlebars.compile(newsfeedTemplateHTML);

    //Takes the html of renderSpecificPost(post) and stores that in $post and prepends it
    //to newsfeed (to avoid expensive loading)
    var $post = $(renderSpecificPost(post));
    $newsfeed.prepend($post);

    //Add the click event handler for the remove button for the post
    $post.find('.remove').click(function(event)
    {
      event.preventDefault();
      PostModel.remove(post._id, function(error)
      {
        if(error)
        {
          $('.error').html(error);
        }
        else
        {
          //Re-render the grid with the removed post
          $newsfeed.masonry('remove', $post);
          $newsfeed.masonry();
        }
      });
    });

    //Add the click handler to the upvote button
    $post.find('.fa-chevron-up').click(function(event)
    {
      event.preventDefault();
      var parentNode = this.parentNode
      PostModel.upvote(post._id, function(error, post)
      {
        if(error)
        {
          $('.error').html(error);
        }
        else
        {
          //This is to get the sibling of the arrow so find up-vote count and set
          // it as whatever the server's response post
          $(parentNode).find('.upvote-count').html(post.upvotes);
        }
      });
    });

    if (updateMasonry) {
      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry('prepended', $post);
      });
    }
  };

  window.NewsfeedView = NewsfeedView;
})(this, this.document);
