/*
Functions and variables related to randomly creating poems.
 */

var rita = require('rita');

const freePoemRules =
    {
        's': [['np', 'vp']],
        'np': [['det', 'nbar'], ['nbar'], ['nbar', 'pp'], ['det', 'nbar', 'pp'], ['pron']],
        'np-minus': [['det', 'nbar'], ['nbar'], ['nbar', 'pp'], ['det', 'nbar', 'pp']],
        'nbar': [['noun'], ['noun', 'conj', 'det', 'noun'], ['ap', 'noun']],
        'ap': [['adj'], ['adv', 'adj'], ['adj', 'adj'], ['adj', 'conj', 'adj']],
        'advp': [['adv'], ['adv', 'adv']],
        'pp': [['prep', 'np-minus']],
        'vp': [['verb'], ['verb', 'np-minus'], ['verb', 'np-minus', 'np-minus'], ['verb', 'np-minus', 'ap']],
    }

// credit to Pimpila (https://github.com/Pimpila/wu-haiku) for the structure of these rules
const haikuRules =
    {
        's'    : [['5-pp', '<br>', '7-np', '<br>', '5-vp'], ['5-np', '<br>', '7-vp', '<br>', '5-pp']],
        '5-pp' : [['1-prep', '1-det', '2-adj', '1-noun'], ['1-prep', '1-det', '1-adj', '2-noun'], ['2-prep', '1-det', '2-noun'],
                  ['2-prep', '1-adj', '2-noun'], ['2-prep', '3-noun'], ['1-prep', '2-adj', '2-noun']],
        '5-vp' : [['3-verb', '2-adv'], ['2-verb', '3-adv']],
        '5-np' : [['1-det', '2-adj', '2-noun'], ['1-det', '1-adj', '3-noun'], ['3-adj', '2-noun']],
        '7-np' : [['1-det', '2-adj', '4-noun'], ['2-adj', '1-conj', '2-adj', '2-noun'], ['1-adj', '1-noun', '1-conj', '2-adj', '2-noun'],
                  ['2-adj', '1-conj', '2-adj', '2-noun'], ['1-det', '2-adj', '2-adj', '2-noun'], ['1-det', '1-adj', '1-conj', '1-adj', '3-noun'],
                  ['3-adj', '2-noun', '1-conj', '1-noun']],
        '7-vp' : [['3-verb', '4-adv'], ['4-verb', '3-adv'], ['3-verb', '2-adv', '2-adj'], ['3-verb', '3-adv', '1-adj'],
                  ['4-verb', '2-adv', '1-adj'], ['4-verb', '1-adv', '2-adj'], ['2-verb', '1-det', '2-adj', '2-noun']],
        '<br>': [['0-<br>']],
    }

const limerickRules =
    [
        [["there", "once", "was", "a", "1-adj", "1-adj", '2-noun'],
            ["who", "wanted", "1-det", "2-adj", '2-noun'],
            ["but", "whatever", "it", '2-verb'],
            ["the", "1-adj", "2-noun", '2-verb'],
            ["and", "1-det", "1-adj", "2-adj", "2-noun", '2-verb']],
        [['a', '2-adj', '1-adj', 'lover', 'of', '1-noun'],
            ['saw', '1-det', '2-noun', 'playing', 'on', '1-noun'],
            ['though', 'it', '2-adv', '2-verb'],
            ['one', '2-verb', 'and', '2-noun'],
            ['and', '2-adj', '2-noun', 'are', '1-adv', '1-adj']],
        [['I', 'once', 'knew', '1-det', 'mayor', 'of', '2-noun'],
            ['who', '2-adv', '2-verb', 'with', 'a', '2-noun'],
            ['when', 'she', '3-adv', '1-verb'],
            ['she', '3-adv', '1-verb'],
            ['and', 'made', '2-adj', '1-noun', 'into', '1-noun']]
    ]  

exports.limerickError = "there once was a poet online<br> who wanted to make some cool rhymes<br> but try as they might<br> something wasn't right:<br> another website might be more sublime?";    
exports.haikuError = "some websites make good poems<br>others just don't work<br>purple monkey dishwasher";    
exports.freeError = "I know you wanted a poem<br> sprung fully formed from bits and bytes<br> but<br> that link doesn't exist or<br> — you know how pictures are worth a thousand words?<br> not in this case";    

// EFFECTS: creates a randomly generated free-structure poem of a random number of lines
exports.makeFree = function (dictionary) {
    let poem = "";
    let numberOfSentences = random(2) + 2;

    for (let i = 0; i < numberOfSentences; i++) {
        let expansion = [];
        let poemArray = expand(freePoemRules, dictionary, "s", expansion);
        expansion.push("<br>");

        let lineBreak = random(poemArray.length - 3) + 3;
        poem += poemArray.slice(0, lineBreak).join(" ") + "<br>";
        poem += poemArray.slice(lineBreak).join(" ") + "<br>";
    }
    return poem;
}

// EFFECTS: creates a randomly generated haiku
exports.makeHaiku = function (dictionary) {
    let poem = "";
    let expansion = [];
    let poemArray = expand(haikuRules, dictionary, "s", expansion);
    poem += poemArray.join(" ");
    return poem;
}

// EFFECTS: creates a randomly generated limerick
exports.makeLimerick = function(dictionary) {
    let poem = "";
    let structure = rita.randomItem(limerickRules);

    // loops attempting to get appropriate line endings for all five lines
    // lines 1 & 3 chosen at random from dictionary; lines 2, 4, and 5 chosen from rhyming options provided by RiTa
    let lineEnds = ['', '', '', '', ''];
    let tries = 10;

    while (lineEnds.includes('') && tries > 0) {
        lineEnds = ['', '', '', '', ''];
        lineEnds[0] = rita.randomItem(dictionary[structure[0][structure[0].length - 1]]);

        let possibleLine2Ends = rita.rhymes(lineEnds[0]);
        for (let i = 0; i < possibleLine2Ends.length; i++) {
            if (endingMatches(possibleLine2Ends[i], structure[1][structure[1].length - 1])) {
                lineEnds[1] = possibleLine2Ends[i];
                break;
            }
        }

        lineEnds[2] = rita.randomItem(dictionary[structure[2][structure[2].length - 1]]);

        let possibleLine4Ends = rita.rhymes(lineEnds[2]);
        for (let i = 0; i < possibleLine4Ends.length; i++) {
            if (endingMatches(possibleLine4Ends[i], structure[3][structure[3].length - 1])) {
                lineEnds[3] = possibleLine4Ends[i];
                break;
            }
        }

        for (let i = 0; i < possibleLine2Ends.length; i++) {
            if (possibleLine2Ends[i] !== lineEnds[1] &&
                endingMatches(possibleLine2Ends[i], structure[4][structure[4].length - 1])) {
                lineEnds[4] = possibleLine2Ends[i];
                break;
            }
        }
        tries--;
    }

    // if we couldn't find appropriate line endings after 10 tries, display error message
    if (lineEnds.includes('')) {
        poem = "there once was a poet online<br> who wanted to make some cool rhymes<br> but try as they might<br> something wasn't right:<br> another website might be more sublime?";
        return poem;
    }

    // initialize final poem array, since we can't change the words in the actual structure
    let poemArray = [];

    // for each line, fill in the rest of the poem
    for (let i = 0; i < 5; i++) {
        poemArray.push([]);
        for (let j = 0; j < structure[i].length - 1; j++) {
            if (dictionary[structure[i][j]]) {
                poemArray[i].push(rita.randomItem(dictionary[structure[i][j]]));
            } else {
                poemArray[i].push(structure[i][j]);
            }
        }
        poemArray[i].push(lineEnds[i]);
        poem += poemArray[i].join(" ");
        poem += "<br>";
    }
    return poem;
}

// EFFECTS: returns true if word matches pos and syllables for endingType
function endingMatches(word, endingType) {
    let endingPos = endingType.substring(2);
    let endingSyllables = parseInt(endingType.substring(0,1), 10);

    let matchesPos = false;
    let matchesSyllables;

    switch (endingPos) {
        case 'verb': matchesPos = rita.isVerb(word); break;
        case 'adj' : matchesPos = rita.isAdjective(word); break;
        case 'noun': matchesPos = rita.isNoun(word); break;
        case 'adv' : matchesPos = rita.isAdverb(word); break;
    }

    matchesSyllables = rita.getSyllables(word).split("/").length === endingSyllables;

    return matchesPos && matchesSyllables;
}

// EFFECTS: recursively expands the rule set, building an array of words by choosing random rule sets
//          credit to Daniel Schiffman's Context Free Grammar videos for the structure of this function
//          https://www.youtube.com/watch?v=8Z9FRiW2Jlc
function expand(rules, dictionary, start, expansion) {
    if (rules[start]) {
        let possibleRuleSet = rules[start];
        let pickedRuleSet = rita.randomItem(possibleRuleSet);
        for (let i = 0; i < pickedRuleSet.length; i++) {
            expand(rules, dictionary, pickedRuleSet[i], expansion);
        }
    } else {
        let possibleWords = dictionary[start];
        let pickedWord = rita.randomItem(possibleWords);
        expansion.push(pickedWord);
    }
    return expansion;
}

// EFFECTS: generates a random number between 0 and max
function random(max) {
    let i = Math.floor(Math.random() * max);
    return i;
}