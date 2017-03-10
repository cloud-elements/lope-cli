'use strict';

const test = require('ava');
const {shell} = require('execa');

const cli = './index.js';

test.serial('invalid lope-package should exit 2', async t => {
	try {
		await shell(`${cli} --lope-package`);
		t.fail();
	} catch (err) {
		t.is(err.code, 2);
	}
});

test.serial('invalid lope-script should exit 2', async t => {
	try {
		await shell(`${cli} lope-example --lope-script`);
		t.fail();
	} catch (err) {
		t.is(err.code, 2);
	}
});

test.serial('valid run which exits non-0 should exit non-0', async t => {
	try {
		await shell(`${cli} lope-example invalid`);
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
	t.true(ran.stdout.indexOf('hello') >= 0);
});

test.serial('explicit lope-path run which exits 0 should exit 0', async t => {
	t.is((await shell(`${cli} lope-example true --lope-path .`)).code, 0);
});
