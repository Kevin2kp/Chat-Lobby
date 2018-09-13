const Deque = require('../modules/Deque');
const globals = require('../globals');


const users = globals.users;


/*----------------------------------------------------------------------------------------------------------------------
LOCALS
----------------------------------------------------------------------------------------------------------------------*/

const 	MAX_MESSAGES = 30;

const 	listeners = {},
		messages = Deque();

let 	timestamp = new Date();


/*----------------------------------------------------------------------------------------------------------------------
HELPER FUNCTIONS
----------------------------------------------------------------------------------------------------------------------*/


function response_message(res, message){

	res.send(JSON.stringify({response_text: message}), {'Content-Type': 'application/json'});
}


/*----------------------------------------------------------------------------------------------------------------------
POLL CHAT STATE
----------------------------------------------------------------------------------------------------------------------*/


function listen_for_new_messages(req,res){

	req.on('data', (data) =>{

		data = JSON.parse(data);

		if(data.timestamp < timestamp){
			return send_new_messages({
				res: res, timestamp: data.timestamp
			});
		}

		let host_id = req.headers['host'] + req.headers['user-agent'];
		listeners[host_id] = {res: res, time: data.time};
	});

}

function update_listeners(){

	let keys = Object.keys(listeners);
	for(let i = 0; i < keys.length; i++){

		send_new_messages(listeners[keys[i]]);
		delete listeners[keys[i]];
	}
}

function send_new_messages(listener){

	let out = JSON.stringify({

		messages: messages.to_array()
	});

	listener.res.status(200);
	listener.res.send(out, {'Content-Type': 'application/json'});
}


/*----------------------------------------------------------------------------------------------------------------------
HANDLE INCOMING MESSAGES
----------------------------------------------------------------------------------------------------------------------*/


function process_new_message(req,res){

	req.on('data', (data) =>{

		data = JSON.parse(data);

		if(!data.message){

			res.status(401);
			return response_message(res, 'Message is empty');
		}

		if(messages.size() >= MAX_MESSAGES){
			messages.pop_front();
		}

		let message_timestamp = new Date(),
			user_id = 'Anonymous', color,
			host_id = req.headers['host'] + req.headers['user-agent'];

		if(users[host_id]){

			user_id = users[host_id].user_id;
			color = users[host_id].color;
		}

		messages.push({

			user_id,
			color,
			message: data.message,
			timestamp: message_timestamp

		});

		timestamp = message_timestamp;
		update_listeners();

		res.status(200);
		response_message(res, 'Success');
	});
}


/*----------------------------------------------------------------------------------------------------------------------
EXPORTS
----------------------------------------------------------------------------------------------------------------------*/


module.exports.state = listen_for_new_messages;
module.exports.send_message = process_new_message;
