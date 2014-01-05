var express = require('express');
var format = require('util').format;
var fs = require('fs');
var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var app = module.exports = express();
app.use(express.bodyParser());

app.get('/*', function(req, res){
	res.send('<body background="http://s9.postimg.org/50uq3fae7/visa_back.png">'
		+ '<p>Please choose a picture to add for : ' + querystring.parse(url.parse(req.url).query)['site'] + '.</p>'
		+ '<form method="post" enctype="multipart/form-data">'
//		+ '<p>Location: <input type="text" name="location" /></p>'
		+ '<p><input type="file" name="image" /></p>'
		+ '<p><input type="submit" value="Upload" /></p>'
		+ '</form>')
		+'</body>';
});



app.post('/*', function(req, res){

					/* 
					 * uploaded file : 'req.files.image'
					 * location : 'req.body.location'
					 */

					//	console.log(req.files.image.path);
					//	console.log(req.files.image.name);
					//	console.log(__dirname + "public/images/" + req.files.image.name);
					//	console.log("Location = " + req.body.location);
	
	if (querystring.parse(url.parse(req.url).query)['name']!="null") {
		
		pg.connect(dbURL, function(err, client, done){      
			client.query("SELECT Locations.location AS location, Images.img_name AS img_name FROM Locations LEFT JOIN Images ON Locations.location=Images.location", function(err, result) {
				var location_exists=0;
				var imgname_taken=0;
				var index_dot=0;
				
				console.log("File to upload : " + req.files.image.name);
				console.log(req.files.image.name.charAt(0));
				console.log(req.files.image.name.length);
				
				while ( (index_dot!=req.files.image.name.length-1) &&  (req.files.image.name.charAt(index_dot)!=".") ) {
					console.log(index_dot +"..."+ req.files.image.name.charAt(index_dot));
					index_dot++;
				}	
				
				//Determining the file extension
				console.log("Dot is at index = " + index_dot);	
				var img_format = req.files.image.name.substring(index_dot+1,req.files.image.name.length);
				console.log("File extension : " + img_format);
				
				//Getting the name of the user
				console.log("NAAAAAAAAAAAAAAAAME : " + querystring.parse(url.parse(req.url).query)['name']);
				
				
				if ( (img_format=="jpg") || (img_format=="png") || (img_format=="gif") || (img_format=="bmp") || (img_format=="tif") || (img_format=="JPG") || (img_format=="PNG") || (img_format=="GIF") || (img_format=="BMP") || (img_format=="TIF")) {
				//the file to upload must be a standard picture
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows[i];						
						if (row.location==req.body.location) {
							location_exists=1;
						}
						if (row.img_name==req.files.image.name) {
							imgname_taken=1;
						}
		/*				console.log("row.location = " + row.location);
						console.log("row.img_name = " + row.img_name);
						console.log("req.files.image.name = " + req.files.image.name);	*/
					}
								
					if (imgname_taken==0) {
						console.log("Location " + req.body.location + " exists."); 
					/*	res.send(format('<p><strong>Picture uploaded : </strong> %s </p>' + '<p><strong>Size : </strong> %d Kb </p>' + '<p><strong>File location : </strong> %s </p>'
							, req.files.image.name
							, req.files.image.size / 1024 | 0 
							, __dirname + "/public/images/" + req.files.image.name
						));	*/

						res.send(format('<body background="http://s9.postimg.org/50uq3fae7/visa_back.png">' + '<p><strong>Picture uploaded : </strong> %s </p>' + '<p><strong>Size : </strong> %d Kb </p>' + '</body>'
							, req.files.image.name
							, req.files.image.size / 1024 | 0 
						));

						fs.rename(req.files.image.path, __dirname + "/public/images/" + req.files.image.name, function(){});
						var d=new Date();
						client.query("INSERT INTO Images(location, img_name, login, date) VALUES($1, $2, $3, $4)",[querystring.parse(url.parse(req.url).query)['site'], req.files.image.name, querystring.parse(url.parse(req.url).query)['name'], d.toString()]);
					}
								
	/*				else if (location_exists==0) {
						console.log("Location " + req.body.location + " doesn't exist. The picture has not been uploaded."); 
						fs.unlink(req.files.image.path, function(){});
						res.send('<p>The location doesn\'t exist. The picture has not been uploaded.</p>');
					}*/
					else {
						console.log("The file name" + req.files.image.name + " is already used, please choose another file name."); 
						fs.unlink(req.files.image.path, function(){});
						res.send('<p>This file name is already used. The picture has not been uploaded. Please choose another file name.</p>');
					}
				}
				else {
					fs.unlink(req.files.image.path, function(){});
					res.send('<p>Error : only png, jpg, bmp, gif or tif files are supported.</p>');
				}
				done();
				if(err) {return console.error(err);}			
			});
		});
	}
	else {
		res.send('<p>Please login before uploading a picture.</p>');
	}
});


  app.listen(8000);
  console.log('Upload server listening on 8000.');
