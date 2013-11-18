/**
 * Module dependencies.
 */
 
var express = require('express');
var pg = require('pg');
 
var app = module.exports = express.createServer();
 
// Configuration
 
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'haml');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
 
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
 
app.configure('production', function(){
  app.use(express.errorHandler()); 
});
 
app.set('view options', {
  layout: false
});
 
// Use hamljs for HAML views
app.register('.haml', require('hamljs'));
 
// Routes
app.get('/', function(req, res){
  res.render('index', {
  });
});
 
app.post('/RetrieveCadastre', function(req, res){
    RetrieveCadastre(req.body, res);
});
 
// RetrieveCadastre
function RetrieveCadastre(bounds, res){
 
    var connString = 'tcp://spatial:spatial@localhost/Spatial';
 
    pg.connect(connString, function(err, client) {
 
        var sql = 'select ST_AsGeoJSON(geog) as shape ';
        sql = sql + 'from spatial.state_1 ';
        sql = sql + 'where geog && ST_GeogFromText(\'SRID=4326;POLYGON((' + bounds._southWest.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._southWest.lat + '))\') ';
        sql = sql + 'and ST_Intersects(geog, ST_GeogFromText(\'SRID=4326;POLYGON((' + bounds._southWest.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._southWest.lat + '))\'));';
 
        client.query(sql, function(err, result) {
 
            var featureCollection = new FeatureCollection();
 
            for (i = 0; i < result.rows.length; i++)
            {
                featureCollection.features[i] = JSON.parse(result.rows[i].shape);
            }
 
            res.send(featureCollection);
        });
    });
}
 
// GeoJSON Feature Collection
function FeatureCollection(){
    this.type = 'FeatureCollection';
    this.features = new Array();
}
 
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
