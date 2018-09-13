/*----------------------------------------------------------------------------------------------------------------------
HANDLE REQUEST/RESPONSE ERRORS
 ----------------------------------------------------------------------------------------------------------------------*/


function empty_response(req,res){

	res.send();
}

function render_error_page(req,res){

	function get_template_data(){

		function create_return_link (){

			let out = '';

			if(req.headers.referer){
				out += 'Click <a href=\"' + req.headers.referer + '\">here</a> to go back.'
			}

			return out;
		}

		return data = {
			url: req.url,
			referer_link: create_return_link(),
			error_code: res.statusCode,
			error_description: ''
		};
	}

	res.render('error.pug', get_template_data(), (error, html) =>{

		if(error){
			res.status(500);
			return res.send();
		}

		res.send(html, {'Content-Type': 'text/html'});
	});

}


/*----------------------------------------------------------------------------------------------------------------------
EXPORTS
 ----------------------------------------------------------------------------------------------------------------------*/


module.exports.error_page = render_error_page;
module.exports.ajax_response = empty_response;