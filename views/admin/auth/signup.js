const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ errors }) => {
    return layout({
        content: `
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-one-third">
                        <form method="POST">
                        <h1 class="title">Sign Up</h1>
                        <div class="field">
                            <label class="label">Email</label>
                            <input class="input" name="email" placeholder="Email" required />
                            <p class="help is-danger">${getError(errors, 'email')}</p>
                        </div>
                        <div class="field">
                            <label class="label">Password</label>
                            <input class="input" name="password" placeholder="Password" type="password" required />
                            <p class="help is-danger">${getError(errors, 'password')}</p>
                        </div>
                        <div class="field">
                            <label class="label">Password Confirmation</label>
                            <input class="input" name="passwordConfirmation" placeholder="Confirm password" type="password" required />
                            <p class="help is-danger">${getError(errors, 'passwordConfirmation')}</p>
                        </div>
                            <button class="button is-primary">Submit</button>
                        </form>
                        <a href="/signin">Have an account? Sign In</a>
                    </div>
                </div>
            </div>
        `
    });
};