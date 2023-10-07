// Create web server
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Use body parser to parse body of HTTP request
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/comments');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Define comment schema
var commentSchema = mongoose.Schema({
  username: String,
  comment: String,
  date: Date
});

// Create model from schema
var Comment = mongoose.model('Comment', commentSchema);

// GET all comments
router.get('/', function(req, res) {
  Comment.find(function(err, comments) {
    if (err) {
      res.send(err);
    }
    res.json(comments);
  });
});

// POST a new comment
router.post('/', function(req, res) {
  var comment = new Comment({
    username: req.body.username,
    comment: req.body.comment,
    date: new Date()
  });
  comment.save(function(err) {
    if (err) {
      res.send(err);
    }
    res.json({ message: 'Comment successfully added!' });
  });
});

// GET a comment by ID
router.get('/:id', function(req, res) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) {
      res.send(err);
    }
    res.json(comment);
  });
});

// DELETE a comment by ID
router.delete('/:id', function(req, res) {
  Comment.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.send(err);
    }
    res.json({ message: 'Comment successfully deleted!' });
  });
});

// PUT a comment by ID
router.put('/:id', function(req, res) {
  Comment.findByIdAndUpdate(req.params.id, req.body, function(err, comment) {
    if (err) {
      res.send(err);
    }
    res.json({ message: 'Comment successfully updated!' });
  });
});

module.exports = router;