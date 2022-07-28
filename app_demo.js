const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');
const users = require('./repositories/users');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['']
}));

// Route handler
app.get('/signup', (req, res) => {
    res.send(`
        <div>
            Your id is: ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="Email" />
                <input name="password" placeholder="Password" />
                <input name="passwordConfirmation" placeholder="Confirm password" />
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

// Middleware
// const bodyParser = (req, res, next) => {
//     if (req.method === 'POST') {
//         req.on('data', (data) => {
//             const parsed = data.toString('utf8').split('&');
//             const formData = {};
//             for (let pair of parsed) {
//                 const [key, value] = pair.split('=');
//                 formData[key] = value;
//             }
//             req.body = formData;
//             next();
//         });
//     } else {
//         next();
//     };
// };

app.post('/', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    // To check if the signing up user is an existing user
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send("Email in use");
    }
    if (password !== passwordConfirmation) {
        return res.send("Password must match");
    }

    // Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });

    // Store the Id of that user inside the users cookie
    req.session.userId = user.id //added by cookie session! 

    res.send('Accound Created!');
});

app.listen(3000, () => {
    console.log("Listening");
});