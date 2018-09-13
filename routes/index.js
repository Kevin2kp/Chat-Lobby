const controller = require('../controllers/index.js');

function route_request (req,res,next){

	if(req.method !== 'GET'){

		res.status(404);
		next(error);
	}

	controller.serve_homepage(req,res,next);

}

module.exports = route_request;