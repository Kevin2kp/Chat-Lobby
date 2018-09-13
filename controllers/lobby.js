const globals = require('../globals');
const MAX_USERS = globals.MAX_PLAYERS;

const 	users = globals.users,
		colors = globals.colors;

let player_count = globals.player_count;

/*----------------------------------------------------------------------------------------------------------------------
LOCALS
 ----------------------------------------------------------------------------------------------------------------------*/


const 	listeners = {};
let		timestamp = new Date();



/*----------------------------------------------------------------------------------------------------------------------
HELPER FUNCTIONS
 ----------------------------------------------------------------------------------------------------------------------*/


function response_message(res, message){

	res.send(JSON.stringify({response_text: message}), {'Content-Type': 'application/json'});
}

function get_host_id(req){

	return req.headers['host'] + req.headers['user-agent'];
}








/*----------------------------------------------------------------------------------------------------------------------
JOIN LOBBY
 ----------------------------------------------------------------------------------------------------------------------*/


function join(req,res){

	req.on('data', (data) =>{

		data = JSON.parse(data);


		//Attempt to join

		let user_id = data.user_id,
			color = Number.parseInt(data.color);

		if(player_count === MAX_USERS){

			res.status(401);
			return response_message(res,'Lobby is full');
		}

		if(Number.isNaN(color)){

			res.status(400);
			return response_message(res,'Bad request');
		}

		if(users[user_id]){

			res.status(401);
			return response_message(res,'Player id is already taken');
		}

		if(colors[color]){

			res.status(401);
			return response_message(res,'Color is already taken');
		}


		let host_id = get_host_id(req);

		if(users[host_id]){

			res.status(401);
			return response_message(res,'Can only join lobby once');
		}


		//Register host

		users[host_id] = {

			user_id,
			color,
			ready: false
		};

		//Update lobby

		colors[color] = true;
		globals.player_count++;

		res.status(200);
		response_message(res,'Success');
		update_listeners();
	});
}

/*----------------------------------------------------------------------------------------------------------------------
LEAVE LOBBY
----------------------------------------------------------------------------------------------------------------------*/


function leave(req,res){

	let host_id = get_host_id(req);

	let player = users[host_id];

	if(!player){

		res.status(401);
		return response_message(res,'You are not in the lobby');
	}

	colors[player.color] = false;
	globals.player_count--;
	delete users[host_id];

	res.status(200);
	response_message(res, 'Success');

	update_listeners();
}


/*----------------------------------------------------------------------------------------------------------------------
LOBBY POLLING
 ----------------------------------------------------------------------------------------------------------------------*/


function listen(req,res){

	req.on('data', (data) =>{

		let host = {
			id :  get_host_id(req),
			res
		};

		data = JSON.parse(data);

		if(data.timestamp < timestamp)
			return send_lobby_state(host);

		listeners[host.id] = host;
	});

}

function update_listeners(){

	timestamp = new Date();

	let keys = Object.keys(listeners);
	for(let i = 0; i < keys.length; i++){

		send_lobby_state(listeners[keys[i]]);
		delete listeners[keys[i]];
	}
}

function send_lobby_state (host){

	let player_arr = [],
		keys = Object.keys(users);

	for(let i = 0; i < MAX_USERS; i++){

		player_arr.push(users[keys[i]] || {player_id: 'Empty'});
	}

	let host_joined = Boolean(users[host.id]);

	let state = JSON.stringify({
		timestamp: timestamp,
		colors: colors,
		users: player_arr,
		host_joined
	});

	host.res.status(200);
	host.res.send(state, {'Content-Type': 'application/json; charset=utf-8'});
}


/*----------------------------------------------------------------------------------------------------------------------
EXPORTS
 ----------------------------------------------------------------------------------------------------------------------*/


module.exports.join_lobby = join;
module.exports.leave_lobby = leave;
module.exports.state = listen;