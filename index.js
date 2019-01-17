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
        set(this.db, key, value);
        return this;
    }

    unset (key) {
        unset(this.db, key);
        return this;
    }

    update (key, updater) {
        update(this.db, key, updater);
        return this;
    }

    save () {
        fs.writeFileSync(this.filepath, JSON.stringify(this.db));
        return this;
    }
}

module.exports = {
    DB,
    NonExistingKeyError
};
