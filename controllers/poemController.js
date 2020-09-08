var Poem = require('../helpers/poem');
var Webpage = require('../models/webpageModel');

// Create and display poem
exports.make_poem = function(req, res) {
    let type = req.params.type;
    Webpage.findById(req.params.id)
        .exec( function (err, found_webpage) {
            if (err || !found_webpage) { res.redirect('/poem/' + type + '/error'); return; }
            let poem;
            switch (type) {
                case 'haiku':    poem = Poem.makeHaiku(found_webpage.dictionaryWithSyllables); break;
                case 'limerick': poem = Poem.makeLimerick(found_webpage.dictionaryWithSyllables); break;
                case 'free':     poem = Poem.makeFree(found_webpage.dictionary); break;
            }
            res.render('poem', { poem : poem, type : type });
        });
};

// Get type from page and make a new poem of that type
exports.make_poem_again = function(req, res) {
    let type = req.body.type;
    let id = req.params.id;
    res.redirect('/poem/' + type + '/' + id);
};

// Display generic error page
exports.poem_error = function(req, res) {
    let type = req.params.type;
    switch (type) {
        case 'haiku': res.render('poem', {poem : Poem.haikuError}); break;
        case 'limerick': res.render('poem', {poem : Poem.limerickError}); break;
        default: res.render('poem', {poem : Poem.freeError});
    }
};

