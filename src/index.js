// dependecies
const express = require('express'),
	cors = require('cors'),
	app = express(),
	{ port } = require('./config'),
	helmet = require('helmet'),
	bodyParser = require('body-parser'),
	{ logger } = require('./utils'),
	compression = require('compression');

const corsOpt = {
	origin: '*',
	credentials: true,
	methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version'],
	optionsSuccessStatus: 204,
};


app.use(helmet())
	.use(cors(corsOpt))
	.use(compression())
	.engine('html', require('ejs').renderFile)
	.set('view engine', 'ejs')
	.set('views', './src/views')
	.use(function(req, res, next) {
		if (req.originalUrl !== '/favicon.ico') logger.connection(req, res);
		next();
	})
	.use(bodyParser.urlencoded({ extended: true }))
	// Home page
	.get('/favicon.ico', (req, res) => res.sendFile(`${process.cwd()}/src/assets/favicon.ico`))
	.use('/', require('./routes'))
	.listen(port, () => logger.ready(`Started on PORT: ${port}`));
