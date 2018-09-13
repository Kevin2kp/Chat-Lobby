const path =require('path');
const fs = require('fs');


/*----------------------------------------------------------------------------------------------------------------------
RENDER HOMEPAGE
 ----------------------------------------------------------------------------------------------------------------------*/


function render_homepage(req,res,next) {

	res.render('index.pug', {title: 'Useless Chat'}, (error, html) =>{
		if(error)
			return next(error);

		res.status(200);
		res.send(html);
	});
}


//Exports

module.exports.serve_homepage = render_homepage;
