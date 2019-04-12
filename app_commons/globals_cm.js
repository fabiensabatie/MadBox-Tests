const Rfr			= require ('rfr');
const Events		= require('events');
const Mongo			= Rfr('app_commons/mongo_cm.js').Mongo;

/*******************************************************************************
************************** Environment variables *******************************
*******************************************************************************/

global.__BASEDIR			= __dirname;
global.__ROOT_URL			= 'http://localhost:8080';
global.__INPROD				= false;
global.__DEBUG				= true;
global.__PORT				= 8080;

(__INPROD) ? Rfr('app_commons/prod_credentials_cm.js') : Rfr('app_commons/dev_credentials_cm.js');

// MongoDB info globals
global.__MONGO_URL_OPTIONS			= ''; // Use the 'admin' database as authentication source
global.__MONGO_DBNAME				= 'madbox'; // Database name
global.__MONGO_URL_CONNECT			= `mongodb://${__MONGO_USER}:${__MONGO_PWD}@${__MONGO_URL}:${__MONGO_PORT}/${__MONGO_DBNAME}${__MONGO_URL_OPTIONS}`;
global.__MONGO_ACTIVE_DBS			= {};

// Mongo collections
global.__MONGO_WORDS_COLLECTION		= 'words';

// Game management environment
global.__WORDLIST_PATH  = ('/Users/fabiensabatie/Projects/MadBox/verbe.txt');
global.__WL = [];
global.__API_KEY = "trnsl.1.1.20190412T003823Z.f986ceeaa9058f8c.3c5a105dc5941daa55c85c7613ce8fa5535449bd";
global.__TRANSLATION_URL = `https://translate.yandex.net/api/v1.5/tr.json/translate?&lang=fr-en&key=${__API_KEY}&text=`;
global.__MAX_LEVEL = 0;
global.__MIN_LEVEL = 0;
global.__WORDS_TO_ADD = 500;

// Views
global.__VIEWS_PATH = 'views/';

// Controllers constants (avoiding double inclusion)
global.__CONTROLLERS_JS = false;

// Events magnagement
global.__READY_APP				 	= 'appReady';
global.__EVENT_EMITTER				= new Events.EventEmitter();

/*******************************************************************************
************************** Environment functions *******************************
*******************************************************************************/

// Initialise the app (calls for mongodb client and makes them glablly accessible)
global.__INIT_APP = function() {
	new Mongo(__MONGO_URL_CONNECT, (err, client) => {
		if (err) return console.log(err);
		__MONGO_ACTIVE_DBS[__MONGO_DBNAME] = client;
		client.mdb.createIndex(__MONGO_WORDS_COLLECTION, "word",
			{unique: true, partialFilterExpression: { word: { $exists: true } }},
		(err) => {
			if (err) return console.log(err);
			if (process.argv[2] == "renew") {
				console.log('Renewing the database.');
				client.mdb.collection(__MONGO_WORDS_COLLECTION).deleteMany({}, (err) => {
					if (err) return (console.log(err));
					__EVENT_EMITTER.emit(__READY_APP);
				})
			}
			else __EVENT_EMITTER.emit(__READY_APP);
		});
	});
}

// Error function
global.__CONSOLE_DEBUG = function(arguments) { if (__DEBUG) console.log(arguments); }
