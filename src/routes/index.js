const express = require('express'),
	fs = require('fs'),
	{ GenVideoID } = require('../utils'),
	router = express.Router();

// Home page
router.get('/', (req, res) => {
	res.render('index');
});

// Upload new file
router.post('/upload', (req, res) => {
	// Generate ID for file
	const ID = GenVideoID();

	// Create file
	fs.writeFile(`${process.cwd()}/src/files/${ID}.txt`, req.body.name, function(err) {
		if (err) return res.json({ error: err.message ?? err });

		res.redirect(`/view/${ID}`);
	});
});

// View file
router.get('/view/:ID', (req, res) => {
	res.sendFile(`${process.cwd()}/src/files/${req.params.ID}.txt`);
});

module.exports = router;
