const { body, validationResult } = require('express-validator');

exports.bookinstance_post_validation = [
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
];

exports.bookinstance_update_validation = [
  body('book', 'Book title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('imprint', 'Imprint must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('due_back', 'Due Back date must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
];
