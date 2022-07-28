const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
    // constructor function
    constructor(filename) {
        if (!filename) {
            throw new Error("Creating a repository requires a filename");
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    };

    async create(attrs) {
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);
        return attrs;
    };

    // getAll method
    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
    };

    // writeAll method
    async writeAll(records) {
        //From create method
        //write the updated 'records' array back to this.filename
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 4));
    };

    // randomId method
    randomId() {
        return crypto.randomBytes(4).toString('hex');
    };

    // getOne method
    async getOne(id) {
        const records = await this.getAll();
        // record => record.id === id: go through every records and for each record's id, see if the passing id is matches with it
        return records.find(record => record.id === id);
    };

    // delete method
    async delete(id) {
        const records = await this.getAll();
        // we want to return true if the id is not the same
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    };

    // update method
    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);
        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        // This is going to take all the different properties and key value pairs inside that attrs object and copy them one by one onto the record object
        Object.assign(record, attrs);
        await this.writeAll(records);
    };

    // getOneBy method
    async getOneBy(filters) {
        const records = await this.getAll();
        // we are using for of loop because we are iterating on an array
        for (let record of records) {
            let found = true;
            // we are using for in here because we are iterating through an object
            // we are going to get the key inside of that object
            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            };
            if (found) {
                return record;
            }
        };
    };
};