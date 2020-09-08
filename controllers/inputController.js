var Webpage = require('../models/webpageModel');
var Dictionary = require('../helpers/dictionary');
var Scraper = require('../helpers/scraper');

var normalizeUrl = require('normalize-url');

var { body, validationResult } = require('express-validator');



// Display input form on GET.
exports.user_input_get = function(req, res, next) {
    res.render('index');
};

// Display input form on POST.
exports.user_input_post = [

    // Validate fields.
    body('path').isURL().withMessage('Please enter a valid URL'),

    // Process request after validation
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('index', { oldPath: req.body.path, errors: errors.array()} );
            return;
        }

        else {

            // append http:// protocol to input path so that puppeteer will work
            let path = normalizeUrl(req.body.path, {stripWWW: false});

            // go get text, then make and save dictionaries if result exists and has > 10 words
            Scraper.scrape(path, function (err, result) {
                if (err) { return next(err); }
                if (result && result.split(' ').length > 10) {
                    const dictionaries = Dictionary.makePOSDictionaries(result);
                    // Create a Webpage object (used so subsequent poems don't require going back to page to re-scrape text)
                    let webpage = new Webpage(
                        {   path: path,
                            dictionary: dictionaries[0],
                            dictionaryWithSyllables: dictionaries[1],
                        }
                    );
                    webpage.save(function (err) {
                        if (err) { return next(err); }
                        // Successful - redirect to poem page.
                        res.redirect('/poem/' + req.body.type + '/' + webpage._id);
                    })
                } else {
                    res.redirect('/poem/' + req.body.type + '/error');
                }
            });
        }
    }
];