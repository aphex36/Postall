var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the format (schema) that MongoDB will store posts as
// which is an object with api,source, title, and upvotes
var postSchema = new Schema({
    api : String,
    source : String,
    title : String,
    upvotes : Number,
  });

  //Store that in module.exports for use from routes (index.js)
  module.exports = mongoose.model('Post', postSchema);
