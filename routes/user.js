
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res){
	res.render('login', {
	title: "Authentication Example",
	user: req.session.user ? req.session.user.name : undefined
	});
	res.render('login');
};
