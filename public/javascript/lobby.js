$(function () {

/*----------------------------------------------------------------------------------------------------------------------
LOCALS
----------------------------------------------------------------------------------------------------------------------*/


//PanelS

	const 	panel_lobby = $('#panel_lobby');

//Buttons

	const 	btn_join = $('#btn_join'),
			btn_ready = $('#btn_ready'),
			btn_leave = $('#btn_leave'),
			btn_start = $('#btn_start_game');

//Inputs

	const 	input_color = $('#input_color'),
			input_name = $('#input_name');

//Other

	let 	timestamp = 0,
			ready = false;

/*----------------------------------------------------------------------------------------------------------------------
AJAX REQUESTS
----------------------------------------------------------------------------------------------------------------------*/


	function join() {

		let player_id =  input_name.val(),
			radio_btn = input_color.children('input[name="color"]:checked'),
			color = radio_btn.val();

		if(!player_id || !color)
			return;

		let player_data = JSON.stringify({

			user_id: player_id,
			color: color
		});

		input_name.val('');
		radio_btn.prop('checked', false);

		$.ajax({

			url: '/lobby/join',
			method: 'POST',
			data: player_data,
			accepts: 'text'

		}).done(() =>{

			console.log('You have joined the lobby!');
			disable(btn_join);
			enable(btn_ready);
			enable(btn_leave);

		}).fail((response)=>{

			console.log(response.response_text);
		});
	}

	function leave(){

		$.ajax({

			url: '/lobby/leave',
			method: 'POST',
			accepts: 'text'

		}).done(() =>{

			console.log('You have left the lobby!');
			enable(btn_join);
			disable(btn_ready);
			disable(btn_start);

		}).fail((response)=>{

			console.log(response.response_text);
		});
	}

	function toggle_ready(){

		$.ajax({

			url: '/lobby/toggle-ready',
			method: 'POST',
			accepts: 'text'

		}).done((response) =>{

			ready = response.ready;

			if(ready){

				disable(btn_join);
				disable(btn_leave);
				enable(btn_start);
			}

			else {

				enable(btn_join);
				enable(btn_leave);
				disable(btn_start);
			}

		}).fail((response)=>{

			console.log(response.response_text);
		});
	}

	function lobby_state(){

		let data = JSON.stringify({

			timestamp: timestamp
		});

		$.ajax({

			url: '/lobby/state',
			method: 'POST',
			data: data,
			accepts: 'text',
			timeout: 1000*60*5

		}).done((response) =>{

			update_lobby(response);
			lobby_state();

		}).fail((response, status)=>{

			console.log(response.response_text);
			lobby_state();
		});
	}

/*----------------------------------------------------------------------------------------------------------------------
UPDATE UI
----------------------------------------------------------------------------------------------------------------------*/


	function disable(element){

		element.addClass('disabled');
		element.prop('disabled', true);
	}

	function enable(element){


		element.removeClass('disabled');
		element.prop('disabled', false);
	}

	function hide_lobby(){

		$('#lobby').fadeOut();
	}

	function disable_join_inputs(){

		btn_join.addClass('disabled');
		btn_join.prop('disabled', true);

		btn_ready.removeClass('disabled');
		btn_ready.prop('disabled', false);

		btn_leave.removeClass('disabled');
		btn_leave.prop('disabled', false);

		input_name.addClass('disabled');
		input_name.prop('disabled', true);

		input_color.addClass('disabled');
		input_color.prop('disabled', true);

	}

	function enable_join_inputs(){

		btn_join.removeClass('disabled');
		btn_join.prop('disabled', false);

		btn_ready.addClass('disabled');
		btn_ready.prop('disabled', true);

		btn_leave.addClass('disabled');
		btn_leave.prop('disabled', true);

		input_name.removeClass('disabled');
		input_name.prop('disabled', false);

		input_color.removeClass('disabled');
		input_color.prop('disabled', false);
	}

	function update_lobby(lobby_state){

		timestamp = lobby_state.timestamp;

		let lobby_inner = [],
			players = lobby_state.users,
			keys = Object.keys(players);

		for(let i = 0; i < 4; i++){

			let player = lobby_state.users[keys[i]].user_id || 'Empty',
				color_class = lobby_state.users[keys[i]].color || '',
				ready = lobby_state.users[keys[i]].ready? ' - Ready' : '';

			if(color_class)
				color_class = `color_${color_class}`;

			lobby_inner.push(`<li class="list-group-item ${color_class}">${player}${ready}</li>`);
		}

		if(lobby_state.host_joined){

			enable(btn_leave);
			disable(btn_join);
		}

		panel_lobby.html(lobby_inner.join('\n'));
	}


/*----------------------------------------------------------------------------------------------------------------------
SET UP EVENT HANDLERS
----------------------------------------------------------------------------------------------------------------------*/


	btn_join.click(join);
	btn_leave.click(leave);
	btn_ready.click(toggle_ready);
	btn_start.click(hide_lobby);
	$(document).ready(lobby_state);

});