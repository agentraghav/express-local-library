const async = require('async');

const { body, validationResult } = require('express-validator');

const Genre = require('../models/genre');

const Book = require('../models/book');

const Author = require('../models/author');

// Display list of genres

exports.genre_list = function (req, res, next) {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genre) {
      if (err) {
        return next(err);
      }
      res.render('genre_list', {
        title: 'Genre List',
        genre_list: list_genre,
      });
    });
};

// Display genre details

exports.genre_detail = function (req, res, next) {
  const { id } = req.params;

  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(id).exec(callback);
      },
      genre_books: function (callback) {
        Book.findById({ genre: id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre === null) {
        var err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      res.render('genre_detail', {
        title: 'Genre Details',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// Genre create form on get

exports.genre_create_get = function (req, res, next) {
  res.render('genre_form', { title: 'Create Genre' });
};

// Genre create form on post

exports.genre_create_post = (req, res, next) => {
  const errors = validationResult(req);

  const genre = new Genre({ name: req.body.name });

  if (!errors.isEmpty()) {
    res.render('genre_form', {
      title: 'Create Genre',
      genre: genre,
      errors: errors.array(),
    });
    return;
  } else {
    Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
      if (err) {
        return next(err);
      }
      if (found_genre) {
        res.redirect(found_genre.url);
      } else {
        genre.save(function (err) {
          if (err) {
            return nexrt(err);
          }
          res.redirect(genre.url);
        });
      }
    });
  }
};

// Genre delete on get

exports.genre_delete_get = function (req, res, next) {
  const { id } = req.params;

  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(id).exec(callback);
      },
      genres_books: function (callback) {
        Book.find({ genre: id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre === null) {
        res.redirect('/catalog/genres');
      }
      res.render('genre_delete', {
        title: 'Delete Genre',
        genre: results.genre,
        genres_books: results.genres_books,
      });
    }
  );
};

// genre delete on post

exports.genre_delete_post = function (req, res, next) {
  const { genreId } = req.body;

  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(genreId).exec(callback);
      },
      genres_books: function (callback) {
        Book.find({ genre: genreId }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      if (results.genres_books.length > 0) {
        res.render('genre_delete', {
          title: 'Delete Genre',
          genre: results.genre,
          genres_books: results.genres_books,
        });
        return;
      } else {
        Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
          if (err) {
            return next(err);
          }
          res.redirect('/catalog/genres');
        });
      }
    }
  );
};

// update genre on get

exports.genre_update_get = function (req, res, next) {
  const { id } = req.params;

  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(id).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      res.render('genre_form', {
        title: 'Update Genre',
        genre: results.genre,
      });
    }
  );
};

// update genre on post

exports.genre_update_post = (req, res, next) => {
  const errors = validationResult(req);
  const { title, name } = req.body;
  const { id } = req.params;
  var genre = new Genre({
    title: title,
    name: name,
    _id: id,
  });

  if (!errors.isEmpty()) {
    async.parallel(
      {
        genre: function (callback) {
          Genre.findById(id).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        res.render('genre_form', {
          title: 'Update Genre',
          genre: results.genre,
          errors: errors.array(),
        });
      }
    );
    return;
  } else {
    Genre.findOne({ name: name }).exec(function (err, found_genre) {
      if (err) {
        return next(err);
      }
      if (found_genre) {
        res.redirect(found_genre.url);
      } else {
        Genre.findByIdAndUpdate(id, genre, {}, function (err, thegenre) {
          if (err) return next(err);
          res.redirect(thegenre.url);
        });
      }
    });
  }
};
