/*
Functions and variables related to word dictionaries needed to create poems.
 */

var rita = require('rita');
var nlp = require('compromise');

const validPOS = ['cc', 'dt', 'in', 'jj', 'jjr', 'jjs', 'nn', 'nns', 'rb', 'rbr', 'rbs',
                'uh', 'vb', 'vbd', 'vbg', 'vbn', 'vbp', 'vbz', 'wdt'];
const conjugateArgs = { tense: rita.PRESENT_TENSE,
                        number: rita.SINGULAR,
                        person: rita.THIRD_PERSON };

// EFFECTS: creates dictionaries from the website's text
exports.makePOSDictionaries = function(text) {
    let pos;
    let word;
    let syllables;

    let wordDictionary = {
        'det'   : ['the', 'a', 'this', 'that', 'each', 'no', 'one'],
        'pron'  : ['he', 'she', 'it'],
        'noun'  : ['book', 'bee', 'wave', 'peace', 'cloud', 'flurry', 'flower', 'iceberg', 'planet', 'current'],
        'adj'   : ['quiet', 'flowing', 'soft', 'absolute'],
        'adv'   : ['wildly', 'absolutely', 'entirely', 'impulsively', 'blustery', 'happily', 'ardently'],
        'verb'  : ['devours', 'flourishes', 'runs', 'admonishes', 'plunges', 'tells', 'says'],
        'conj'  : ['and', 'but'],
        'prep'  : ['in', 'on', 'into', 'onto', 'within'],
        'uh'    : ['uh', ', like,', '- oh! -'],
    };

    let wordDictionaryWithSyllables = {
        '0-<br>' : ['<br>'],
        '1-det'  : ['the', 'a', 'this', 'that', 'each', 'no', 'one'],
        '1-adj'  : ['cold', 'soft'],
        '1-noun' : ['book', 'bee', 'wave', 'peace', 'cloud'],
        '1-conj' : ['and', 'but'],
        '1-prep' : ['in', 'on'],
        '1-verb' : ['runs', 'eats', 'tells', 'says'],
        '1-adv'  : ['most', 'only', 'so'],
        '2-adj'  : ['quiet', 'flowing'],
        '2-noun' : ['flurry', 'flower', 'iceberg', 'planet', 'current'],
        '2-adv'  : ['wildly', 'crossly'],
        '2-verb' : ['devours', 'plunges', 'entreats'],
        '2-prep' : ['into', 'onto', 'within'],
        '3-noun' : ['daffofil', 'waterfall', 'whirligig'],
        '3-adj'  : ['absolute'],
        '3-verb' : ['admonishes'],
        '3-adv'  : ['blustery', 'happily', 'ardently'],
        '4-noun' : ['humanity', 'constellation'],
        '4-verb' : ['flourishes'],
        '4-adv'  : ['impulsively', 'entirely', 'absolutely'],
    }

    // prepares website text for dictionary
    let website = rita.RiString(text);
    let words = website.words();

    // loop through all words to process
    for (let i = 0; i < words.length; i++) {
        // get initial word and POS from full RiTa set
        word = words[i].toLowerCase();
        pos = rita.getPosTags(word);

        // is the word is not valid for poem purposes, continue to next word
        if (!isValidWord(word, pos)) continue;

        // otherwise conjugate verbs to third person present tense plural and singularize plural nouns
        if (pos[0][0] === 'v' && pos[0] !== "vbz") {
            word = nlp(word).verbs().toInfinitive().all().text();
            word = rita.conjugate(word, conjugateArgs);
        }
        if (pos[0] === 'nns') {
            word = rita.singularize(word);
        }

        // get simplified pos and syllables
        pos = simplifyPOS(rita.getPosTags(word));
        syllables = rita.getSyllables(word).split("/").length;

        // then put words in dictionaries
        if (wordDictionary[pos]) wordDictionary[pos].push(word);
        else wordDictionary[pos] = [word];

        pos = syllables + "-" + pos;

        if (wordDictionaryWithSyllables[pos]) wordDictionaryWithSyllables[pos].push(word);
        else wordDictionaryWithSyllables[pos] = [word];
    }
    return [wordDictionary, wordDictionaryWithSyllables];
}

// EFFECTS: true if word is valid for use in poems
function isValidWord(word, pos) {
    // RiTA could not find POS tag
    if (!pos[0]) return false;
    // POS tag is not in the list of ones we're dealing with
    if (!validPOS.includes(pos[0])) return false;
    // word contains anything but a-z
    if (!/^[a-z]+$/.test(word)) return false;

    return true;
}

// EFFECTS: returns a simplified POS tag
function simplifyPOS(ritaPOS) {
    let fullPOS = ritaPOS[0];
    let pos = "";
    if (fullPOS === "dt" || fullPOS === "wdt") {
        pos = "det";
    } else if (fullPOS[0] === "n") {
        pos = "noun";
    } else if (fullPOS[0] === "j") {
        pos = "adj";
    } else if (fullPOS[0] === "r") {
        pos = "adv";
    } else if (fullPOS[0] === "v") {
        pos = "verb";
    } else if (fullPOS === "cc") {
        pos = "conj";
    } else if (fullPOS === "in") {
        pos = "prep";
    } else if (fullPOS === "uh") {
        pos = "uh"
    }
    return pos;
}