const fs = require('fs');
const get = require('lodash.get');
const set = require('lodash.set');

class NonExistingKeyError extends Error {}

class DB {
    constructor (filepath, defaults) {
        this.filepath = filepath;
        try {
            this.db = require(filepath);
        } catch (e) {
            this.db = defaults;
            this.save();
            this.db = require(filepath);
        }
    }

    get (key) {
        return get(this.db, key);
    }

    set (key, value) {
        return set(this.db, key, value);
    }

    save () {
        fs.writeFileSync(this.filepath, JSON.stringify(this.db));
    }
}

module.exports = {
    DB,
    NonExistingKeyError
};
