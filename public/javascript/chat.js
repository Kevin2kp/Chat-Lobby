$(function () {

/*----------------------------------------------------------------------------------------------------------------------
LOCALS
----------------------------------------------------------------------------------------------------------------------*/


	//Buttons

	const btn_send_message = $('#btn_send_message');

	//Inputs

	const input_chat = $('#input_chat');

	//Chat Panel

	const panel_chat = $('#log');

	let timestamp = 0;


/*----------------------------------------------------------------------------------------------------------------------
AJAX REQUESTS
----------------------------------------------------------------------------------------------------------------------*/


	function send_message(){

		let message = input_chat.val();
		input_chat.val('');

		if(!message)
			return;

		let data = JSON.stringify({message: message});

		$.ajax({

			url: '/chat/send-message',
			method: 'POST',
			data: data,
			accepts: 'text'

		}).fail((response)=>{

			console.log(response.response_text);
		});
	}

	function chat_state (){

		let data = JSON.stringify({

			timestamp: timestamp
		});

		$.ajax({

			url: '/chat/state',
			method: 'POST',
			data: data,
			accepts: 'text',
			timeout: 1000*60*5

		}).done((response) =>{

			update_chat(response);
			chat_state();

		}).fail((response, status, msg)=>{

			if(status === 'timeout')
				console.log(`Status: ${status}. Message: ${msg}`);

			chat_state();
		});
	}

/*----------------------------------------------------------------------------------------------------------------------
UPDATE UI
----------------------------------------------------------------------------------------------------------------------*/


	function update_chat(chat_state){

		timestamp = chat_state.timestamp;

		let chat_inner = [],
			messages = chat_state.messages;

		for(let i = 0; i < messages.length; i++){

			let color = '';

			if(messages[i].color)
				color = `class="color_${messages[i].color}"`;

			chat_inner.push(`<p ${color}>${messages[i].user_id}: ${messages[i].message}<p/>`);
		}

		panel_chat.html(chat_inner.join('\n'));
		panel_chat.scroll(panel_chat.scrollHeight);

		panel_chat.animate({
			scrollTop: panel_chat[0].scrollHeight - panel_chat[0].clientHeight
		}, 250);
	}


/*----------------------------------------------------------------------------------------------------------------------
SET UP EVENT HANDLERS
----------------------------------------------------------------------------------------------------------------------*/

	chat_state();

	btn_send_message.click(send_message);
	input_chat.on('keydown', function (e) {


		if (e.keyCode === 13){

			e.preventDefault();
			send_message();
		}
	});


});