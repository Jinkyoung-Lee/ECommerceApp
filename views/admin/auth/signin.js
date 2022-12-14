const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ errors }) => {
    return layout({
        content: `
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-one-third">
                        <form method="POST">
                            <h1 class="title">Sign in</h1>
                            <div class="field">
                                <input class="input" name="email" placeholder="Email" required />
                                <p class="help is-danger">${getError(errors, 'email')}</p>
                            </div>
                            <div class="field">
                                <input class="input" name="password" placeholder="Password" type="password" required />
                                <p class="help is-danger">${getError(errors, 'password')}</p>
                            </div>
                            <button class="button is-primary">Sign In</button>
                        </form>
                        <a href="/signup">Need an account? Sign Up</a>
                    </div>
                </div>
            </div>
        `
    });
};