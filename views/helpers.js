module.exports = {
    getError(errors, prop) {
        //prop === 'email' || 'password' || 'passwordConfirmation'
        try {
            return errors.mapped()[prop].msg;
            // errors.mapped() === {
            //     email: {
            //     msg:'Invalid email'
            // },
            //     password:{
            //     msg: 'Password too short'
            // },
            //     passwordConfirmation{
            //     msg: 'Password must match'
            // }
            // }
        } catch (err) {
            return '';
        }
    }
}