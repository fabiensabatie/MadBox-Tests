"use strict";
const MadBox				= require('./app.js');
const BodyParser		= require('body-parser');
const JsonParser		= BodyParser.json();
const Rfr				= require('rfr');
const UrlParser			= BodyParser.urlencoded({extended: true});
const Ctrl				= Rfr('controllers/controllers.js');

/*******************************************************************************
*********************************** Main ***************************************
*******************************************************************************/

// App initialisation

MadBox.App.get('/', Ctrl.GUI.client.get_front);
MadBox.App.get('/:level', UrlParser, Ctrl.API.translate.api_get_new_word);

Ctrl.API.translate.get_word_list((err) => { // Fetches the list of words first
	if (err) console.log(err);
	MadBox.Server.listen(8080);
	console.log('Translato is ready at : "http://localhost:8080" 🚀')
});
