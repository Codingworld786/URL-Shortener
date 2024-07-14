const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const shortner = require("./shortner"); // Ensure this module is correctly implemented
const port = 4100;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

// Endpoint to expand shortened URL
app.get('/:shortcode', (req, res) => {
    shortner.expand(req.params.shortcode)
        .then((url) => {
            if (url) {
                res.redirect(url);
            } else {
                res.status(404).send('URL not found');
            }
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

// Endpoint to shorten a URL
app.post('/api/v1/shorten', (req, res) => {
    let url = req.body.url;
    shortner.shorten(url)
        .then((shortcode) => {
            res.send(shortcode);
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

// Endpoint to expand shortened URL via API
app.get('/api/v1/expand/:shortcode', (req, res) => {
    let shortcode = req.params.shortcode;
    shortner.expand(shortcode)
        .then((url) => {
            if (url) {
                res.send(url);
            } else {
                res.status(404).send('URL not found');
            }
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});
