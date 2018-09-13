const controller = require('../controllers/error');

function route_request (req,res,next){

	if(req.headers.accept && req.headers.accept.indexOf('html')){

		return controller.error_page(req,res,next);
	}

	controller.ajax_response(req,res,next);
}

module.exports = route_request;