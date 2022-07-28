const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    // new products entry: title
    requireTitle: check('title')
        .trim()
        .isLength({ min: 5, max: 40 })
        .withMessage('Must be between 5 and 40 characters'),
    // new products entry: price
    requirePrice: check('price')
        .trim()
        .toFloat()
        .isFloat({ min: 1 }) // to make sure the user input is a number
        .withMessage('Must be a number greater than 1'),
    // signup
    requireEmail: check('email')
        // trim(): trim any white spaces
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async (email) => {
            // To check if the signing up user is an existing user
            const existingUser = await usersRepo.getOneBy({ email });
            if (existingUser) {
                throw new Error('Email in use');
            }
        }),
    requirePassword: check('password')
        .trim()// isLength({min, max}): at least min number of letter and max of max number of letter
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 and 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 and 20 characters')
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('Password must match');
            }
            return true;
        }),
    // signin
    requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async (email) => {
        const user = await usersRepo.getOneBy({ email });
        // See if the user email is inside our database
        if (!user) {
            throw new Error('Email not found');
        }
    }),
    requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
        const user = await usersRepo.getOneBy({ email: req.body.email });
        if (!user) {
            throw new Error('Invalid password');
        }
        const validPassword = await usersRepo.comparePasswords(
            user.password,
            password
        );
        // See if the user put the correct password
        if (!validPassword) {
            throw new Error('Invalid password');
        }
    })
};