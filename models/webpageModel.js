var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WebpageSchema = new Schema(
    {
        createdAt: {type: Date, expires: 3600, default: Date.now},
        path: {type: String, required: true},
        dictionary: {type: Object, required: true},
        dictionaryWithSyllables: {type: Object, required: true},
    }
)

module.exports = mongoose.model('Webpage', WebpageSchema);