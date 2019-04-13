"use strict"
const Fs = require('fs');
const Axios = require('axios');

/*******************************************************************************
******************************* Back-end functions *****************************
*******************************************************************************/


/**
 * Fetches the list of words from the __WORDKIST_PATH constant.
 *
 * @param {Function} callback Callback with (err, wordlist)
 * @returns {callback}
 */
function get_word_list(cb) {
	Fs.readFile(__WORDLIST_PATH, (err, data) => {
		if (err) return cb(err);
		let word_list = data.toString('utf8').split('\n')
		.map((w) => (w.replace(/\s/g, ''))).sort((a, b) => (a.length - b.length)) // Sorting for levels
		word_list = [... new Set(word_list)].map((w) => ({word : w})).slice(0, __WORDS_TO_ADD); // Removing doublons and fetching 500 words only
		__MAX_LEVEL = word_list[word_list.length-1].word.length; __MIN_LEVEL = word_list[0].word.length; // Defining levels
		__MONGO_ACTIVE_DBS[__MONGO_DBNAME].addDocuments(__MONGO_WORDS_COLLECTION, word_list, (err) => {
			if (err && err.code != 11000) return (cb(err));
			else if (err && err.code == 11000) console.log('The database already contained words.')
			return cb(null, word_list);
		})
	})
}

/**
 * Translates a word using the yandex API.
 *
 * @param {String} w The word to translate.
 * @param {Function} callback Callback with (err, word)
 * @returns {callback}
 */
function translate_word(w, cb) {
		if (!w) return (cb('Please provide a word.'))
		__MONGO_ACTIVE_DBS[__MONGO_DBNAME].findDocument(__MONGO_WORDS_COLLECTION, {_id: w._id}, (err, foundWord) => {
			if (err) return cb(err);
			if (foundWord.t_word) return cb(null, foundWord.t_word); // The translation alread exists
			let encodedW = encodeURIComponent(w.word);
			Axios.post(`${__TRANSLATION_URL}${encodedW}`)
			.then((response) => {
				if (response.data) {
					__MONGO_ACTIVE_DBS[__MONGO_DBNAME].setDocument(true, __MONGO_WORDS_COLLECTION, {_id: w._id}, // We add the translation
					{t_word: response.data.text[0]}, (err) => {
						if (err) return cb(err);
						return cb(null, response.data.text[0]);
					})
				}
				else return (cb('No result.'))
			})
			.catch((err) => (cb(err)));
		})

}

/**
 * Provides a new word by searching the word list constant.
 *
 * @param {Number} level Level represents the length of the words to pick from.
 * @param {Function} callback Callback with (err, word)
 * @returns {callback}
 */
function get_new_word(level, cb) {
	__MONGO_ACTIVE_DBS[__MONGO_DBNAME].findManyDocuments(__MONGO_WORDS_COLLECTION, {}, (err, word_list) => {
		if (err) return cb(err);
		level = (level < __MIN_LEVEL || level > __MAX_LEVEL) ? __MAX_LEVEL : level;
		let level_words = word_list.filter((w) => { if (w.word.length == level) return (w.word); });
		if (!level_words.length) return (cb(null, word_list[0]));
		return (cb(null, level_words[Math.floor(Math.random() * level_words.length)]));
	})
}

/*******************************************************************************
********************************** API functions *******************************
*******************************************************************************/

/**
 * Provides a new word and its translation.
 */
function api_get_new_word(req, res) {
	if (req.params && req.params.level)
	get_new_word(req.params.level, (err, word) => // Fetching a new word
	{
		if (err) return (res.send(err).status(400));
		translate_word(word, (err, t_word) => { // Translating it.
			if (err) return (res.send(err).status(400));
			else if (word.word == t_word) { // Avoid yandex translation errors by restarting if the word and the translated word are indentical.
				req.params.level++;
				return api_get_new_word(req, res);
			}
			else return (res.send({word: word.word, t_word: t_word}).status(200));
		})
	})
}

/*******************************************************************************
*********************************** Exports ************************************
*******************************************************************************/

exports.get_word_list = get_word_list;
exports.get_new_word = get_new_word;
exports.translate_word = translate_word;
exports.api_get_new_word = api_get_new_word;
