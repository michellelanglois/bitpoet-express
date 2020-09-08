# BitPoet
BitPoet is a random poetry generator written in Express (Node.js), HTML, and CSS. It is deployed on Heroku: [https://bitpoet.herokuapp.com/].

BitPoet uses [Puppeteer](https://pptr.dev "Puppeteer website") to scrape the text from a user-submitted url. Then, with help from the [RiTa.js](https://rednoise.org/rita "RiTa.js website") and [Compromise.js](https://compromise.cool "Compromise.js website") natural language processing libraries, BitPoet analyses a webpage's text, categorizing words by their part of speech tag and syllable count while also normalizing verbs so the final poems flow more naturally. Finally, using principles of context-free grammar (a set of recursive rules used to generate patterns of strings), BitPoet glues randomly selected words back together into poems that are just about as good as the ones I once scribbled on the back pages of my notebooks in highschool.

You can use BitPoet to make haikus, limericks, and free form poems from all your favourite websites.


## BitPoet Chrome Extension
A less pretty but just as functional version of BitPoet is available as a Chrome extension on the [Chrome web store](https://chrome.google.com/webstore/detail/bitpoet/cejignpcodcddlklhkkpocfnodcicnek?hl=en "BitPoet's extension page").
