const { validationResult } = require('express-validator');

module.exports = {
    handleErrors(tempFunc, dataCallback) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                let data = {};
                if (dataCallback) {
                    data = await dataCallback(req);
                }
                return res.send(tempFunc({ errors, ...data }));
            }
            next();
            //next(): everything went well, sl call the next middleware or invoke our actual route handler
        };
    },
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect('/signin');
        }
        next();
    }
};