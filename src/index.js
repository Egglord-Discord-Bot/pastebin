// dependecies
const express = require('express'),
	cors = require('cors'),
	app = express(),
	{ port } = require('./config'),
	helmet = require('helmet'),
	bodyParser = require('body-parser'),
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
	.use(bodyParser.urlencoded({ extended: true }))
	// Home page
	.use('/', require('./routes'))
	.listen(port, () => console.log(`Started on PORT: ${port}`));
