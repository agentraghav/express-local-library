const { body, validationResult } = require('express-validator');

exports.genre_post_validation = [
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
];

exports.genre_update_validation = [
  body('name', 'Genre must not be empty.').trim().isLength({ min: 1 }).escape(),
];
