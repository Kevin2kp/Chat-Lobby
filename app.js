//Imports

const fs = require('fs');
const http = require('http');
const path = require('path');
const io = require('socket.io');


//Modules

const template_engine = require('pug');
const utilities = require('./modules/utilities');


//Routes

const lobby = require('./routes/lobby');
const index = require('./routes/index');
const error_handler = require('./routes/error');
const chat = require('./routes/chat');


//Server

const 	server = http.createServer(request_handler),
		socket = io(server);


//App Parameters

const 	port = 3000,
		routes = {},
		parameters = set_up_parameters(),
		static_resource_handler = utilities.serve_static_resource(parameters);

set_up_routes();
modify_response_object_prototype();



server.listen(port);

//Exports

const globals = require('./globals');
globals.io = io;

/*----------------------------------------------------------------------------------------------------------------------
 SET UP
 ----------------------------------------------------------------------------------------------------------------------*/


function set_up_parameters(){


	//Environment dependent

	let is_win = process.platform === 'win32',
		line_break = is_win? '\r\n' : '\n',
		slash = is_win? '\\' : '/',
		parameters;

	parameters = {
		public_dir: path.resolve(__dirname, 'public'),
		views_dir: path.resolve(__dirname, 'views'),
		env: {
			line_break: line_break,
		},
		socket: socket
	};

	return parameters;
}

function modify_response_object_prototype(){

	function send (content, headers){

		this.writeHead(this.statusCode, headers);
		this.write(content || '');
		this.end();
	}

	function status(statusCode){
		this.statusCode = statusCode;
	}

	function render (view, content, callback){

		let view_path = path.resolve(parameters.views_dir, view);
		template_engine.renderFile(view_path, content, callback);
	}

	http.ServerResponse.prototype.render = render;
	http.ServerResponse.prototype.send = send;
	http.ServerResponse.prototype.status = status;
}

function set_up_routes() {

	//Add routes

	routes['/'] =  index;
	routes['/index'] = index;
	routes['/home'] = index;
	routes['/lobby/join'] = lobby;
	routes['/lobby/leave'] = lobby;
	routes['/lobby/state'] = lobby;
	routes['/chat/send-message'] = chat;
	routes['/chat/state'] = chat;
}


/*----------------------------------------------------------------------------------------------------------------------
HANDLE INCOMING REQUESTS
----------------------------------------------------------------------------------------------------------------------*/


function request_handler (req,res){

	function handle_request(){

		utilities.parse_url(req);
		utilities.log_request(req,res);

		let route = routes[req.url];
		if(route)
			return route.call(parameters, req,res, handle_error);

		static_resource_handler(req,res, (error, file) =>{

			if(error){

				res.status(404);
				return handle_error();
			}

			send(file);
		});
	}

	function handle_error(error){

		if(error){

			res.on('finish', () => {

				console.log(error);
			});
		}

		error_handler(req,res,error);
	}

	handle_request();
}

/*----------------------------------------------------------------------------------------------------------------------
HANDLE SOCKET REQUESTS
----------------------------------------------------------------------------------------------------------------------*/
