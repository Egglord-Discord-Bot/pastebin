const express = require('express'),
	fs = require('fs'),
	{ GenPasteID, checkIP } = require('../utils'),
	{	secureUpload, IPWhitelist } = require('../config'),
	router = express.Router();

// Home page
router.get('/', (req, res) => {
	res.render('index');
});

// Upload new file
router.post('/upload', (req, res) => {
	// Check if the /upload endpoint should be secured and if so check IP
	if (secureUpload && !IPWhitelist.includes(checkIP(req))) return res.json({ error: 'IP whitelist enabled' });

	// Generate ID for file
	const ID = GenPasteID();

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
