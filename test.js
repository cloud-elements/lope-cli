'use strict';

const test = require('ava');
const {shell} = require('execa');

const cli = './index.js';

test('invalid package should exit 2', async t => {
	try {
		await shell(`${cli} ''`);
		t.fail();
	} catch (err) {
		t.is(err.code, 2);
	}
});

test('invalid script should exit 2', async t => {
	try {
		await shell(`${cli} lope-example ''`);
		t.fail();
	} catch (err) {
		t.is(err.code, 2);
	}
});

test('current package valid run which exits non-0 should exit non-0', async t => {
	try {
		await shell(`${cli} false`);
		t.fail();
	} catch (err) {
		t.not(err.code, 0);
	}
});

test('current package non-optioned valid run which exits 0 should exit 0', async t => {
	t.is((await shell(`${cli} true`)).code, 0);
});

test('current package optioned valid run which exits 0 should exit 0', async t => {
	const ran = await shell(`${cli} equals --input input`);
	t.is(ran.code, 0);
});

test('current package multi-optioned valid run which exits 0 should exit 0', async t => {
	const ran = await shell(`${cli} equalsBoth --input0 input0 --input1 input1`);
	t.is(ran.code, 0);
});

test('local package valid run which exits non-0 should exit non-0', async t => {
	try {
		await shell(`${cli} lope-example false`);
		t.fail();
	} catch (err) {
		t.not(err.code, 0);
	}
});

test('local package non-optioned valid run which exits 0 should exit 0', async t => {
	t.is((await shell(`${cli} lope-example true`)).code, 0);
});

test('local package optioned valid run which exits 0 should exit 0', async t => {
	const ran = await shell(`${cli} lope-example equals --input input`);
	t.is(ran.code, 0);
});

test('local package multi-optioned valid run which exits 0 should exit 0', async t => {
	const ran = await shell(`${cli} lope-example equalsBoth --input0 input0 --input1 input1`);
	t.is(ran.code, 0);
});

test('global package valid run which exits non-0 should exit non-0', async t => {
	try {
		await shell(`${cli} lope-example false --global`);
		t.fail();
	} catch (err) {
		t.not(err.code, 0);
	}
});

test('global package non-optioned valid run which exits 0 should exit 0', async t => {
	t.is((await shell(`${cli} lope-example true --global`)).code, 0);
});

test('global package optioned valid run which exits 0 should exit 0', async t => {
	const ran = await shell(`${cli} lope-example equals --input input --global`);
	t.is(ran.code, 0);
});

test('global package multi-optioned valid run which exits 0 should exit 0', async t => {
	const ran = await shell(`${cli} lope-example equalsBoth --input0 input0 --input1 input1 --global`);
	t.is(ran.code, 0);
});
