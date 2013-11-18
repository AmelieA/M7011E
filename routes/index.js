
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'VISA' });
};


exports.mapbox = function(req, res){
  res.sendfile('views/mapbox.html');
  res.end();
};
