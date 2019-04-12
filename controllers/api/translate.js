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
		__WL = data.toString('utf8').split('\n')
		.map((w) => (w.replace(/\s/g, '')))
		.sort((a, b) => (a.length - b.length));
		__MAX_LEVEL = __WL[__WL.length-1].length;
		__MIN_LEVEL = __WL[0].length;
		cb(null, __WL);
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
		else w = encodeURIComponent(w);
		Axios.post(`${__TRANSLATION_URL}${w}`)
		.then((response) => {
			if (response.data) return cb(null, response.data.text);
			return (cb('No result.'))
		})
		.catch((err) => (cb(err)));
}

/**
 * Provides a new word by searching the word list constant.
 *
 * @param {Number} level Level represents the length of the words to pick from.
 * @param {Function} callback Callback with (err, word)
 * @returns {callback}
 */
function get_new_word(level, cb) {
	level = (level < __MIN_LEVEL || level > __MAX_LEVEL) ? __MIN_LEVEL : level;
	let level_words = __WL.filter((word) => (word.length == level));
	if (!level_words.length) return (cb(null, __WL[0]));
	return (cb(null, level_words[Math.floor(Math.random() * level_words.length)]));
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
			else if (word == t_word) { // Avoid yandex translation errors.
				console.log(word, 'and', t_word, 'are the same.');
				return api_get_new_word(req, res);
			}
			else return (res.send({word: word, t_word: t_word[0]}).status(200));
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
