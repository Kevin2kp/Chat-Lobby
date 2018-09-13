const 	controller = require('../controllers/lobby.js');

function route_request (req,res,next) {

	function get(){

		switch(req.url){

			default:
				res.status(404);
				next(error);
		}
	}

	function post(){

		switch(req.url){

			case '/lobby/join':
				controller.join_lobby(req,res,next);
				break;

			case '/lobby/leave':
				controller.leave_lobby(req,res,next);
				break;

			case '/lobby/state':
				controller.state(req,res,next);
				break;

			default:
				res.status(404);
				next();
		}
	}

	if(req.method === 'GET'){
		return get();
	}

	if(req.method === 'POST'){
		return post();
	}
}

module.exports = route_request;