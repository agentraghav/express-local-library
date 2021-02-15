const async = require('async');

const { validationResult } = require('express-validator');

const Author = require('../models/author');

const Book = require('../models/book');

const genre = require('../models/genre');

//Display author list

exports.author_list = function (req, res, next) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) {
        return next(err);
      }

      res.render('author_list', {
        title: 'Author List',
        author_list: list_authors,
      });
    });
};

// Display author details

exports.author_detail = function (req, res, next) {
  const { id } = req.params;
  async.parallel(
    {
      author: function (callback) {
        Author.findById(id).exec(callback);
      },
      author_books: function (callback) {
        Book.find({ author: id }, 'title summary').exec(callback);
      },
    },
    function (err, result) {
      if (err) {
        return next(err);
      }
      if (result.author === null) {
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }

      res.render('author_detail', {
        author: result.author,
        author_books: result.author_books,
      });
    }
  );
};

// Author Create Form on GET

exports.author_create_get = function (req, res, next) {
  res.render('author_form', { title: 'Create Author' });
};

// Handle Author Create Form on Post request

exports.author_create_post = function (req, res, next) {
  const { first_name, family_name, date_of_birth, date_of_death } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('author_form', {
      title: 'Create Author',
      author: req.body,
      errors: errors.array(),
    });
    return;
  } else {
    var author = new Author({
      first_name: first_name,
      family_name: family_name,
      date_of_birth: date_of_birth,
      date_of_death: date_of_death,
    });
    author.save(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect(author.url);
    });
  }
};

// Author delete get

exports.author_delete_get = function (req, res, next) {
  const { id } = req.params;

  async.parallel(
    {
      author: function (callback) {
        Author.findById(id).exec(callback);
      },

      author_books: function (callback) {
        Book.find({ author: id }).exec(callback);
      },
    },
    function (err, result) {
      if (err) {
        return next(err);
      }

      if (result.author === null) {
        res.redirect('/catalog/authors');
      }

      res.redner('author_delete', {
        title: 'Delete Author',
        author: result.author,
        author_books: result.author_books,
      });
    }
  );
};

// Handle Author delete Post

exports.author_delete_post = function (req, res, next) {
  const { authorId } = req.body;

  async.parallel(
    {
      author: function (callback) {
        Author.findById(authorId).exec(callback);
      },
      author_books: function (callback) {
        Book.find({ author: authorId }).exec(callback);
      },
    },
    function (err, result) {
      if (err) {
        return next(err);
      }
      if (result.author_books.length > 0) {
        res.render('author_delete', {
          title: 'Delete Author',
          author: result.author,
          author_books: result.author_books,
        });
        return;
      } else {
        Author.findByIdAndRemove(authorid, function deleteAuthor(err) {
          if (err) {
            return next(err);
          }
          res.redirect('/catalog/authors');
        });
      }
    }
  );
};

// Display Author on update get

exports.author_update_get = function (req, res, next) {
  const { id } = req.params;

  async.parallel(
    {
      author: function (callback) {
        Author.findById(id).exec(callback);
      },
    },
    function (err, result) {
      if (err) {
        return next(err);
      }
      if (result.author === null) {
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }
      res.render('author_form', {
        title: 'Update Author',
        author: result.author,
      });
    }
  );
};

// Handle author update on post

exports.author_update_post = function (req, res, next) {
  const { first_name, family_name, date_of_birth, date_of_death } = req.body;
  const { id } = req.params;
  const errors = validationResult(req);

  var author = new Author({
    first_name: first_name,
    family_name: family_name,
    date_of_birth: date_of_birth,
    date_of_death: date_of_death,
    _id: id,
  });
  if (!errors.isEmpty()) {
    res.render('author_form', {
      title: 'Update Form',
      author: author,
      errors: errors.array(),
    });
    return;
  } else {
    Author.findByIdAndUpdate(id, author, {}, function (err, theauthor) {
      if (err) {
        return next(err);
      }
      res.redirect(theauthor.url);
    });
  }
};
