const async = require('async');

const { validationResult } = require('express-validator');

const BookInstance = require('../models/bookinstance');

const Book = require('../models/book');

// bookinstance list

exports.bookinstance_list = function (req, res, next) {
  BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstance) {
      if (err) {
        return next(err);
      }
      res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: list_bookinstance,
      });
    });
};

// Display bookinstance detail

exports.bookinstance_detail = function (req, res, next) {
  const { id } = req.params;
  BookInstance.findById(id)
    .populate('book')
    .exec(function (err, bookInstance) {
      if (err) {
        return next(err);
      }
      if (bookInstance === null) {
        var err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }

      res.render('bookinstance_detail', {
        title: 'Copy: ' + bookInstance.book.title,
        bookinstance: bookInstance,
      });
    });
};

// Display book instance form on get

exports.bookinstance_create_get = function (req, res, next) {
  Book.find({}, 'title').exec(function (err, books) {
    if (err) {
      return next(err);
    }
    res.render('bookinstance_form', {
      title: 'Create BookInstance',
      book_list: books,
    });
  });
};

// Handle book instance on post

exports.bookinstance_create_post = (req, res, next) => {
  const errors = validationResult(req);

  const { book, imprint, status, due_back } = req.body;

  var bookinstance = new BookInstance({
    book: book,
    imprint: imprint,
    status: status,
    due_back: due_back,
  });

  if (!errors.isEmpty()) {
    Book.find({}, 'title').exec(function (err, books) {
      if (err) {
        return next(err);
      }

      res.render('bookinstance_form', {
        title: 'Create BookInstance',
        book_list: books,
        selected_book: bookinstance.book_id,
        errors: errors.array(),
        bookinstance: bookinstance,
      });
    });
    return;
  } else {
    bookinstance.save(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect(bookinstance.url);
    });
  }
};

// bookInstance delete on get

exports.bookinstance_delete_get = function (req, res, next) {
  const { id } = req.params;

  async.parallel(
    {
      bookInstance: function (callback) {
        BookInstance.findById(id).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      res.render('bookinstance_delete', {
        title: 'Delete Book Instance',
        bookInstance: results.bookInstance,
      });
    }
  );
};

// bookinstance delete on post

exports.bookinstance_delete_post = function (req, res, next) {
  const { bookinstanceId } = req.body;

  async.parallel(
    {
      bookInstance: function (callback) {
        BookInstance.findById(bookinstanceId).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      BookInstance.findByIdAndRemove(
        bookinstanceId,
        function deleteBookInstance(err) {
          if (err) return next(err);
          res.redirect('/catalog/bookinstances');
        }
      );
    }
  );
};

// bookinstance update on get

exports.bookinstance_update_get = function (req, res, next) {
  const { id } = req.params;

  async.parallel(
    {
      bookInstance: function (callback) {
        BookInstance.findById(id).populate('book').exec(callback);
      },
      books: function (callback) {
        Book.find(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      if (results.bookInstance == null) {
        var err = new Error('Book Instance not found');
        err.status = 404;
        return next(err);
      }

      console.log(results.bookInstance);
      res.render('bookinstance_form', {
        title: 'Update Book Instance',
        bookinstance: results.bookInstance,
        book_list: results.books,
        selected_book: results.bookInstance.book_id,
      });
    }
  );
};

// bookinstance update on post

exports.bookinstance_update_post = (req, res, next) => {
  const errors = validationResult(req);
  const { book, imprint, status, due_back } = req.body;
  const { id } = req.params;
  var bookInstance = new BookInstance({
    book: book,
    imprint: imprint,
    due_back: due_back,
    status: status,
    _id: id,
  });

  if (!errors.isEmpty()) {
    async.parallel(
      {
        bookInstance: function (callback) {
          BookInstance.findById(req.par.id).populate('book').exec(callback);
        },
        book: function (callback) {
          Book.find(callback);
        },
      },
      function (err, results) {
        if (err) return next(errr);
        res.render('bookinstance_form', {
          title: 'Updated Book Instance',
          bookinstance: results.bookInstance,
          book: results.book,
          selected_book: results.bookInstance.book_id,
        });
      }
    );
    return;
  } else {
    BookInstance.findByIdAndUpdate(id, bookInstance, {}, function (
      err,
      thebookinstance
    ) {
      if (err) {
        return next(err);
      }
      res.redirect(thebookinstance.url);
    });
  }
};
