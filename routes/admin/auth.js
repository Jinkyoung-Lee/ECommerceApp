const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');

// Template importing
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    requireEmailExists,
    requireValidPasswordForUser
} = require('./validators');

// sub-router
const router = express.Router();

// Route handler
// signup route - GET request
router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});
// signup route - POST request
router.post(
    '/signup',
    [requireEmail, requirePassword, requirePasswordConfirmation],
    handleErrors(signupTemplate),
    async (req, res) => {
        const { email, password } = req.body;
        // Create a user in our user repo to represent this person
        const user = await usersRepo.create({ email, password });

        // Store the Id of that user inside the users cookie
        req.session.userId = user.id //added by cookie session! 

        res.redirect('/admin/products');
    });

// signout route
router.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/admin/products');
});

// signin route - GET request
router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});
// signin route - POST request
router.post(
    '/signin',
    [requireEmailExists, requireValidPasswordForUser],
    handleErrors(signinTemplate),
    async (req, res) => {
        const { email } = req.body;

        const user = await usersRepo.getOneBy({ email });

        // what makes our user be considered to be authenticated with out app
        req.session.userId = user.id;
        res.redirect('/admin/products');
    });

module.exports = router;