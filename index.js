const fs = require('fs');
const path = require('path');
const get = require('lodash.get');
const set = require('lodash.set');
const unset = require('lodash.unset');
const update = require('lodash.update');

class NonExistingKeyError extends Error {}
class RelativePathError extends Error {}

class DB {
    constructor (absoluteFilepath, defaults) {
        if (! path.isAbsolute(absoluteFilepath)) {
            throw new RelativePathError('You cannot pass relative path')
        };

        this.filepath = absoluteFilepath;

        try {
            this.db = require(this.filepath);
        } catch (e) {
            this.db = defaults || {};
            this.save();
            this.db = require(this.filepath);
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
