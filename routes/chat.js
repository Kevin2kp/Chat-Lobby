const 	controller = require('../controllers/chat.js');

function route_request (req,res,next) {

	function get(){

		switch(req.url){

			default:
				res.status(404);
				next();
		}
	}

	function post(){

		switch(req.url){

			case '/chat/send-message':
				controller.send_message(req,res,next);
				break;

			case '/chat/state':
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