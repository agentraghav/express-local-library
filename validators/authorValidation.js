const { body } = require('express-validator');

exports.author_post_validation = [
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First Name must be specified')
    .isAlphanumeric()
    .withMessage('First Name should not contain Alphanumeric Character'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family Name must be specified')
    .isAlphanumeric()
    .withMessage('Family Name should not contain Alphanumeric Character'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
];

exports.author_update_validation = [
  body('first_name', 'First Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('family_name', 'Family Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('date_of_birth', 'Date of Birth must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
];
