var express = require('express');
var format = require('util').format;
var fs = require('fs');
var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";

var app = module.exports = express();
app.use(express.bodyParser());

app.get('/', function(req, res){
	res.send('<form method="post" enctype="multipart/form-data">'
		+ '<p>Location: <input type="text" name="location" /></p>'
		+ '<p><input type="file" name="image" /></p>'
		+ '<p><input type="submit" value="Upload" /></p>'
		+ '</form>');
});



app.post('/', 	function(req, res){

					/* 
					 * uploaded file : 'req.files.image'
					 * location : 'req.body.location'
					 */

					//	console.log(req.files.image.path);
					//	console.log(req.files.image.name);
					//	console.log(__dirname + "/images/" + req.files.image.name);
					//	console.log("Location = " + req.body.location);

				pg.connect(dbURL,         function(err, client){      
					client.query("SELECT Locations.location AS location, Images.img_name AS img_name FROM Locations LEFT JOIN Images ON Locations.location=Images.location", function(err, result) {
						for (var i = 0; i < result.rows.length; i++) {
							var row = result.rows[i];
							
							var location_exists=0;
							var imgname_taken=0;
							
							if (row.location==req.body.location) 
							{
								location_exists=1;
							}
							if (row.img_name==req.files.image.name)
							{
								imgname_taken=1;
							}
				//			console.log("row.location = " + row.location);
				//			console.log("row.img_name = " + row.img_name);
				//			console.log("req.files.image.name = " + req.files.image.name);
							
						}
						
						if ( (location_exists==1) && (imgname_taken==0) )
						{
							console.log("Location " + req.body.location + " exists."); 
							res.send(format('<p><strong>Picture uploaded : </strong> %s </p>' + '<p><strong>Size : </strong> %d Kb </p>' + '<p><strong>File location : </strong> %s </p>'
								, req.files.image.name
								, req.files.image.size / 1024 | 0 
								, __dirname + "/images/" + req.files.image.name
								));

						fs.rename(req.files.image.path, __dirname + "/images/" + req.files.image.name, function(){});
						client.query("INSERT INTO Images(location, img_name, login) VALUES($1, $2, $3)",[req.body.location, req.files.image.name, "default_user"]);

						}
						
						else if (location_exists==0)
						{
							console.log("Location " + req.body.location + " doesn't exist. The picture has not been uploaded."); 
							fs.unlink(req.files.image.path, function(){});
							res.send('<p>The location doesn\'t exist. The picture has not been uploaded.</p>');
						}
						
						else
						{
							console.log("The file name" + req.files.image.name + " is already used, please choose another file name."); 
							fs.unlink(req.files.image.path, function(){});
							res.send('<p>This file name is already used. The picture has not been uploaded. Please choose another file name.</p>');
						}
						
						
						

					})
			});






});

if (!module.parent) {
  app.listen(8000);
  console.log('Upload server listening on 8000.');
}
