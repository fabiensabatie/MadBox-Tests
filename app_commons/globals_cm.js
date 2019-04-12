const Rfr			= require ('rfr');
const Events		= require('events');

/*******************************************************************************
************************** Environment variables *******************************
*******************************************************************************/

global.__BASEDIR			= __dirname;
global.__ROOT_URL			= 'http://localhost:8080';

// Game management environment
global.__WORDLIST_PATH  = ('/Users/fabiensabatie/Projects/MadBox/verbe.txt');
global.__WL = [];
global.__API_KEY = "trnsl.1.1.20190412T003823Z.f986ceeaa9058f8c.3c5a105dc5941daa55c85c7613ce8fa5535449bd";
global.__TRANSLATION_URL = `https://translate.yandex.net/api/v1.5/tr.json/translate?&lang=fr-en&key=${__API_KEY}&text=`;
global.__MAX_LEVEL = 0;
global.__MIN_LEVEL = 0;

// Views
global.__VIEWS_PATH = 'views/';

// Controllers constants (avoiding double inclusion)
global.__CONTROLLERS_JS = false;
