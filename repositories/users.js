const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    // compare passwords
    async comparePasswords(saved, supplied) {
        // saved -> password saved in our database 'hashed.salt'
        // supplied -> password given to us by a user trying to sign in
        const [hashed, salt] = saved.split('.');
        const hashedSupplied = await scrypt(supplied, salt, 64);
        return hashed === hashedSupplied.toString('hex');
    };

    // create method
    async create(attrs) {
        // attrs === { email: 'test@email.com', password: 'test1234' }
        attrs.id = this.randomId();
        const salt = crypto.randomBytes(8).toString('hex');
        const hashed = await scrypt(attrs.password, salt, 64);
        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${hashed.toString('hex')}.${salt}`
        };
        records.push(record);
        await this.writeAll(records);
        return record;
    };
};

module.exports = new UsersRepository('users.json');
