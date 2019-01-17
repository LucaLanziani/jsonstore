import test from 'ava';
import path from 'path';
import { readFileSync, unlinkSync, existsSync } from 'fs';
import { randomBytes } from 'crypto';
import assign from 'lodash.assign';
import { DB, NonExistingKeyError } from '.'

const datastoreContent = {a:1, b: [1, 2], c: {a: 1, b: 2}};

test.beforeEach(t => {
    let name = randomBytes(4).readUInt32LE(0);
    t.context = {
        datastore: new DB(path.join(__dirname, `./test_artifacts/datastore_${name}.json`), datastoreContent)
    }
});

test('datastore is present', t => {
    let datastore = require(t.context.datastore.filepath);
    existsSync(t.context.datastore.filepath);
    t.pass()
});

test('datastore contains defaults', t => {
    let datastore = require(t.context.datastore.filepath);
    t.deepEqual(datastore, datastoreContent);
});

test('datastore get', t => {
    t.deepEqual(t.context.datastore.get('c'), {a: 1, b: 2});
});

test('datastore deep get', t => {
    t.is(t.context.datastore.get('c.a'), 1);
});

test('datastore put existing key', t => {
    t.context.datastore.set('a', 2);
    t.is(t.context.datastore.db.a, 2);
});

test('datastore put new key', t => {
    t.context.datastore.set('k', 32);
    t.is(t.context.datastore.db.k, 32);
});

test('datastore put deep existing key', t => {
    t.context.datastore.set('c.a', 102);
    t.is(t.context.datastore.db.c.a, 102);
});

test('datastore put deep new key', t => {
    t.context.datastore.set('j.a', 102)
    t.is(t.context.datastore.db.j.a, 102);
});

test('datastore unset', t => {
    t.context.datastore.unset('b');
    t.is(t.context.datastore.db.b, undefined);
});

test('datastore deep unset', t => {
    t.context.datastore.unset('c.a');
    t.is(t.context.datastore.db.c.a, undefined);
});

test('datastore update', t => {
    t.context.datastore.update('c.a', x => x*2);
    t.is(t.context.datastore.db.c.a, 2);
});

test('datastore gets saved properly', t => {
    t.context.datastore.set('a', 2);
    t.context.datastore.set('j.a', 102)
    t.context.datastore.save();
    let datastore = JSON.parse(readFileSync(t.context.datastore.filepath, "utf-8"));
    t.deepEqual(datastore, assign({}, datastoreContent, {a: 2}, {j: {a: 102}}));
});

test('datastore is a singleton', t => {
    t.context.datastore.set('a', 2);
    let datastore = new DB(t.context.datastore.filepath);
    t.deepEqual(datastore.db, t.context.datastore.db);
});

test.afterEach(t => {
    unlinkSync(t.context.datastore.filepath);
});