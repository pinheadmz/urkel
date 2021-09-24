/* eslint-env mocha */
/* eslint prefer-arrow-callback: "off" */
/* eslint no-unused-vars: "off" */

'use strict';

const assert = require('bsert');
const crypto = require('crypto');
const {Tree, Proof} = require('../radix');
const {sha1, sha256} = require('./util/util');

function key(bits) {
  return Buffer.from([bits]);
}

function loc() {
  return `/Users/matthewzipkin/Desktop/urkeltests/${Date.now()}`;
}

const FOO1 = key(0b00000000);
const FOO2 = key(0b10000000);
const FOO3 = key(0b11000000);
const FOO4 = key(0b10100000);

const BAR1 = Buffer.from([1]);
const BAR2 = Buffer.from([2]);
const BAR3 = Buffer.from([3]);
const BAR4 = Buffer.from([4]);

describe('Memory Test', function() {
  this.timeout(5000);

  const dir = loc();
  let tree, tree2;
  let txn, txn2;
  let restore;

  it('should init tree', async () => {
    tree = new Tree(sha256, 8, dir);
    await tree.open();
    console.log(tree.root);
    console.log(tree.rootHash());
  });

  it('should get txn', async () => {
    txn = tree.transaction();
    console.log(txn.root);
    console.log(txn.rootHash());
  });

  it('should add one record 1', async () => {
    await txn.insert(FOO1, BAR1);
    console.log(txn.root);
    console.log(txn.rootHash());
    console.log(tree.root);
    console.log(tree.rootHash());
  });

  it('should add one record 2', async () => {
    await txn.insert(FOO2, BAR2);
    console.log(txn.root);
    console.log(txn.rootHash());
    console.log(tree.root);
    console.log(tree.rootHash());
  });

  it('should add one record 3', async () => {
    await txn.insert(FOO3, BAR3);
    console.log(txn.root);
    console.log(txn.rootHash());
    console.log(tree.root);
    console.log(tree.rootHash());
  });

  it('should get one record 1', async () => {
    const data = await txn.get(FOO1);
    console.log(data);
  });

  it('should get one record 2', async () => {
    const data = await txn.get(FOO2);
    console.log(data);
  });

  it('should get one record 3', async () => {
    const data = await txn.get(FOO3);
    console.log(data);
  });

  it('should commit with 3 records', async () => {
    await txn.commit();
    console.log(txn.root);
    console.log(txn.rootHash());
    console.log(tree.root);
    console.log(tree.rootHash());
  });

  it('should get one record after commit 1', async () => {
    const data = await txn.get(FOO1);
    console.log(data);
  });

  it('should get one record after commit 2', async () => {
    const data = await txn.get(FOO2);
    console.log(data);
  });

  it('should get one record after commit 3', async () => {
    const data = await txn.get(FOO3);
    console.log(data);
  });

  it('should add one record after commit 4', async () => {
    await txn.insert(FOO4, BAR4);
    console.log(txn.root);
    console.log(txn.rootHash());
    console.log(tree.root);
    console.log(tree.rootHash());
  });

  it('should get one record after commit 4', async () => {
    const data = await txn.get(FOO4);
    console.log(data);
  });

  it('should commit with 4 records and save root', async () => {
    restore = await txn.commit();
    console.log('restore value:', restore);
    console.log(txn.root);
    console.log(txn.rootHash());
    console.log(tree.root);
    console.log(tree.rootHash());
    await tree.close();
  });

  it('should restore tree', async () => {
    tree2 = new Tree(sha256, 8, dir);
    await tree2.open();
    await tree2.inject(restore);
    txn2 = tree2.transaction();

    console.log(txn2.root);
    console.log(txn2.rootHash());
    console.log(tree2.root);
    console.log(tree2.rootHash());
  });

  it('should get one record after restore 4', async () => {
    const data = await txn2.get(FOO4);
    console.log(data);
  });
});
