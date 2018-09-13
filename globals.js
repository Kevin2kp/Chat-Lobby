const 	MAX_PLAYERS = 4;
let 	player_count = 0;

const 	users = {},
		colors = new Array(MAX_PLAYERS);

let 	io;

module.exports = {

	users,
	player_count,
	colors,
	MAX_PLAYERS,
	io
};
