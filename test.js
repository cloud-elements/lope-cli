'use strict';

const test = require('ava');
const {shell} = require('execa');

const cli = './index.js';

test.serial('invalid package should exit 2', async t => {
	try {
		await shell(`${cli}`);
		t.fail();
	} catch (err) {
		t.is(err.code, 2);
	}
});

test.serial('invalid script should exit 2', async t => {
	try {
		await shell(`${cli} lope-example`);
		t.fail();
	} catch (err) {
		t.is(err.code, 2);
	}
});

test.serial('valid run which exits non-0 should exit non-0', async t => {
	try {
		await shell(`${cli} lope-example false`);
		t.fail();
	} catch (err) {
		t.not(err.code, 0);
	}
});

test.serial('non-argumented valid run which exits 0 should exit 0', async t => {
	t.is((await shell(`${cli} lope-example true`)).code, 0);
});

test.serial('argumented valid run which exits 0 should exit 0', async t => {
	const ran = await shell(`${cli} lope-example echo --echo hello`);

	t.is(ran.code, 0);
	t.is(ran.stdout, 'hello');
});
