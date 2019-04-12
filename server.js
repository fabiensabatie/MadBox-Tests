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
__INIT_APP();

MadBox.App.get('/', (req, res) => {res.render('translate')});
MadBox.App.get('/:level', UrlParser, Ctrl.API.translate.api_get_new_word);

__EVENT_EMITTER.on(__READY_APP,() => {
	Ctrl.API.translate.get_word_list((err) => {
		if (err) return (console.log(err));
		MadBox.Server.listen(8080);
		console.log('Translato is ready at : "http://localhost:8080" 🚀');
	})
});
