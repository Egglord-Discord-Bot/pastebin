// Dependecies
const chalk = require('chalk'),
	moment = require('moment'),
	onFinished = require('on-finished'),
	opts = {
		logDirectory:'./src/utils/logs',
		fileNamePattern:'roll-<DATE>.log',
		dateFormat:'YYYY.MM.DD',
	};

exports.log = (content, type = 'log') => {
	if (content == 'error') return;
	const timestamp = `[${moment().format('HH:mm:ss')}]:`;
	const log = require('simple-node-logger').createRollingFileLogger(opts);
	switch (type) {
	case 'log': {
		console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
		return log.info(content);
	}
	case 'warn': {
		console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
		return log.warn(content);
	}
	case 'error': {
		console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
		return log.error(content);
	}
	case 'debug': {
		console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
		return log.debug(content);
	}
	case 'cmd': {
		console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
		return log.info(content);
	}
	case 'ready': {
		console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
		return log.info(content);
	}
	default: throw new TypeError('Logger type must be either warn, debug, log, ready, cmd or error.');
	}
};

exports.warn = (...args) => this.log(...args, 'warn');

exports.error = (...args) => this.log(...args, 'error');

exports.debug = (...args) => this.log(...args, 'debug');

exports.cmd = (...args) => this.log(...args, 'cmd');

exports.ready = (...args) => this.log(...args, 'ready');

exports.connection = async (req, res) => {
	req._startTime = new Date().getTime();
	req._endTime = undefined;

	// response data
	res._startTime = new Date().getTime();
	res._endTime = undefined;

	onFinished(req, function() {
		req._endTime = new Date().getTime();
		onFinished(res, function() {
			res._endTime = new Date().getTime();

			// Get additional information
			const	method = req.method,
				url = req.originalUrl || req.url,
				status = res.statusCode,
				color = status >= 500 ? 'bgRed' : status >= 400 ? 'bgMagenta' : status >= 300 ? 'bgCyan' : status >= 200 ? 'bgGreen' : 'dim',
				requester = require('./index').checkIP(req);

			// How long did it take for the page to load
			let response_time;
			if (res._endTime && req._endTime) response_time = (res._endTime + req._endTime) - (res._startTime + req._startTime);

			// log
			if ((url.startsWith('/static') || url.startsWith('/img'))) {
				if (require('../../config').debug) return require('./logger').log(`${requester} ${method} ${url} ${chalk[color](status)} - ${(response_time ?? '?')} ms`, 'debug');
				return;
			}
			require('./logger').log(`${requester} ${method} ${url} ${chalk[color](status)} - ${(response_time ?? '?')} ms`, 'log');
		});
	});
};
