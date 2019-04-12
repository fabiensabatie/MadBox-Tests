if (!__CONTROLLERS_JS) {
	const Rfr					= require('rfr');
	/** API controllers */
	exports.API					= {};
	exports.API.translate		= Rfr('controllers/api/translate.js');
	/** Upload Controllers */
	__CONTROLLERS_JS			= true;
}
