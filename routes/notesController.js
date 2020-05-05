var Comment = require("../models/Comment");

module.exports = {
  get: function (data, cb) {
    Comment.find(
      {
        _articleId: data._id,
      },
      cb
    );
  },
  save: function (data, cb) {
    var newComment = {
      _articleId: data._id,
      commentText: data.commentText,
    };
    Comment.create(newComment, function (err, doc) {
      if (err) throw err;
      else {
        console.log(doc);
        cb(doc);
      }
    });
  },
  delete: function (data, cb) {
    Comment.remove(
      {
        _id: data._id,
      },
      cb
    );
  },
};
