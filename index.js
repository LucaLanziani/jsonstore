const fs = require('fs');
const get = require('lodash.get');
const set = require('lodash.set');
const unset = require('lodash.unset');
const update = require('lodash.update');

class NonExistingKeyError extends Error {}

class DB {
    constructor (filepath, defaults) {
        this.filepath = filepath;
        try {
            this.db = require(filepath);
        } catch (e) {
            this.db = defaults || {};
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

    unset (key) {
        return unset(this.db, key);
    }

    update (key, updater) {
        return update(this.db, key, updater);
    }

    save () {
        fs.writeFileSync(this.filepath, JSON.stringify(this.db));
    }
}

module.exports = {
    DB,
    NonExistingKeyError
};
