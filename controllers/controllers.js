if (!__CONTROLLERS_JS) {
	const Rfr					= require('rfr');
	/** Pages controllers */
	exports.GUI					= {};
	exports.GUI.client			= Rfr('controllers/views/client.js');
	/** API controllers */
	exports.API					= {};
	exports.API.translate		= Rfr('controllers/api/translate.js');
	/** Upload Controllers */
	__CONTROLLERS_JS			= true;
}
