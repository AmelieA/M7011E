
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res){
	res.sendfile('views/mapbox.html');
};
