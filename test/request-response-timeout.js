import test from 'ava';
import LogSuppress from '../lib/log-suppress';
import r from 'randomstring';

const { Requester, Responder } = require('../')();

LogSuppress.init(console);

test.cb(`Use request data for setting requester timeout`, (t) => {
    const key = r.generate();

    const requester = new Requester({ name: `${t.title}: timeout requester`, key });
    const responder = new Responder({ name: `${t.title}: timeout responder`, key });

    responder.on('Be quick or be dead', (req, cb) => {
        setTimeout(() => cb(null, { message: 'You should not see me!' }), 2000);
    });

    requester.send({ type: 'Be quick or be dead', __timeout: 1000 }, (err, res) => {
        t.is(res, undefined);
        t.is(err instanceof Error, true);
        t.is(err.message, 'Request timed out.');
        t.end();
    });
});

test.cb(`Use advertisement for setting requester timeout`, (t) => {
    const key = r.generate();

    const requester = new Requester({ name: `${t.title}: timeout requester`, key, timeout: 1000 });
    const responder = new Responder({ name: `${t.title}: timeout responder`, key });

    responder.on('Be quick or be dead', (req, cb) => {
        setTimeout(() => cb(null, { message: 'You should not see me!' }), 2000);
    });

    requester.send({ type: 'Be quick or be dead' }, (err, res) => {
        t.is(res, undefined);
        t.is(err instanceof Error, true);
        t.is(err.message, 'Request timed out.');
        t.end();
    });
});

test.cb(`Use environment var for setting requester timeout`, (t) => {
    const key = r.generate();

    process.env.COTE_REQUEST_TIMEOUT = 1000;

    const requester = new Requester({ name: `${t.title}: timeout requester`, key });
    const responder = new Responder({ name: `${t.title}: timeout responder`, key });

    responder.on('Be quick or be dead', (req, cb) => {
        setTimeout(() => cb(null, { message: 'You should not see me!' }), 2000);
    });

    requester.send({ type: 'Be quick or be dead' }, (err, res) => {
        t.is(res, undefined);
        t.is(err instanceof Error, true);
        t.is(err.message, 'Request timed out.');
        t.end();
    });
});

test.cb(`Use request data for setting requester timeout (response before timeout)`, (t) => {
    const key = r.generate();

    const requester = new Requester({ name: `${t.title}: timeout requester`, key });
    const responder = new Responder({ name: `${t.title}: timeout responder`, key });

    responder.on('Be quick or be dead', (req, cb) => {
        setTimeout(() => cb(null, { message: 'Faster!' }), 1000);
    });

    requester.send({ type: 'Be quick or be dead', __timeout: 2000 }, (err, res) => {
        t.is(err, null);
        t.is(res.message, 'Faster!');
        t.end();
    });
});

test.cb(`Use advertisement for setting requester timeout (response before timeout)`, (t) => {
    const key = r.generate();

    const requester = new Requester({ name: `${t.title}: timeout requester`, key, timeout: 2000 });
    const responder = new Responder({ name: `${t.title}: timeout responder`, key });

    responder.on('Be quick or be dead', (req, cb) => {
        setTimeout(() => cb(null, { message: 'Faster!' }), 1000);
    });

    requester.send({ type: 'Be quick or be dead' }, (err, res) => {
        t.is(err, null);
        t.is(res.message, 'Faster!');
        t.end();
    });
});

test.cb(`Use environment var for setting requester timeout (response before timeout)`, (t) => {
    const key = r.generate();

    process.env.COTE_REQUEST_TIMEOUT = 2000;

    const requester = new Requester({ name: `${t.title}: timeout requester`, key });
    const responder = new Responder({ name: `${t.title}: timeout responder`, key });

    responder.on('Be quick or be dead', (req, cb) => {
        setTimeout(() => cb(null, { message: 'Faster!' }), 1000);
    });

    requester.send({ type: 'Be quick or be dead' }, (err, res) => {
        t.is(err, null);
        t.is(res.message, 'Faster!');
        t.end();
    });
});
