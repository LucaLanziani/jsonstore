const fs = require('fs');
const path = require('path');
const get = require('lodash.get');
const set = require('lodash.set');
const unset = require('lodash.unset');
const update = require('lodash.update');

class NonExistingKeyError extends Error {}
class RelativePathError extends Error {}

class InMemoryDB {

    constructor (defaults) {
        this.db = defaults || {};
    }

    get (key, defaultValue) {
        return get(this.db, key, defaultValue);
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
        return this;
    }    
}

class DB extends InMemoryDB {
    constructor (absoluteFilepath, defaults) {
        if (! path.isAbsolute(absoluteFilepath)) {
            throw new RelativePathError('You cannot pass relative path')
        };

        super(defaults);
        this.filepath = absoluteFilepath;

        try {
            this.db = require(this.filepath);
        } catch (e) {
            this.save();
            this.db = require(this.filepath);
        }

    }

    save () {
        fs.writeFileSync(this.filepath, JSON.stringify(this.db));
        return this;
    }
}

module.exports = {
    DB,
    InMemoryDB,
    NonExistingKeyError
};
