
/**
 * Template für Übungsaufgabe VS1lab/Aufgabe3
 * Das Skript soll die Serverseite der gegebenen Client Komponenten im
 * Verzeichnisbaum implementieren. Dazu müssen die TODOs erledigt werden.
 */

/**
 * Definiere Modul Abhängigkeiten und erzeuge Express app.
 */

var http = require('http');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');

var app;
app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Setze ejs als View Engine
app.set('view engine', 'ejs');



/**
 * Konfiguriere den Pfad für statische Dateien.
 * Teste das Ergebnis im Browser unter 'http://localhost:3000/'.
 */

app.use(express.static(__dirname + '/public'));

/**
 * Konstruktor für GeoTag Objekte.
 * GeoTag Objekte sollen min. alle Felder des 'tag-form' Formulars aufnehmen.
 */
var idVar=0;
GeoTagForm=function (longitude, latitude, name, hashtag, id){
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
	this.hashtag = hashtag;
	if(id === undefined){
		this.id= idVar;
    	idVar++;
	}else{
		this.id = id;
	}
    
    return this;
}

/**
 * Modul für 'In-Memory'-Speicherung von GeoTags mit folgenden Komponenten:
 * - Array als Speicher für Geo Tags.
 * - Funktion zur Suche von Geo Tags in einem Radius um eine Koordinate.
 * - Funktion zur Suche von Geo Tags nach Suchbegriff.
 * - Funktion zum hinzufügen eines Geo Tags.
 * - Funktion zum Löschen eines Geo Tags.
 */

var inMemory = require("./public/javascripts/inMemory.js");
const { json } = require('body-parser');



/**
 * Route mit Pfad '/' für HTTP 'GET' Requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests enthalten keine Parameter
 *
 * Als Response wird das ejs-Template ohne Geo Tag Objekte gerendert.
 */

app.get('/', function(req, res) {
    res.render('gta', {
        taglist: [],
        latitude: "",
        longitude: "",
        map: ""
    });
});



app.post('/geotags',function(req,res){
	console.log("reqest BODY: "+JSON.stringify(req.body));
	let newGeoTag = new GeoTagForm(req.body.long,req.body.lat,req.body.nam,req.body.hash);
	inMemory.addGeoTag(newGeoTag);
	console.log("##new geo tag in POST: "+JSON.stringify(newGeoTag));
	var url = 'http://' + req.get('host') + req.url + '/' + newGeoTag.id;
	res.status(201).location(url).send(inMemory.ArrayGeoTags);
});

app.get('/geotags',function(req,res){

	var search_term = req.query.search_term;
	var radius = req.query.radius;


	radius === undefined ? radius = 1 : radius ;


	if(search_term === undefined ){
		res.status(200).json(inMemory.allGeoTags()).send();
	} else if(search_term !== undefined ){
		res.status(200).json(inMemory.searchGeoTagByTag(search_term)).send();
	} else {
		res.status(200).json(inMemory.searchGeoTagInRad(radius, req.body.latitude, req.body.longitude)).send();
	}


});

app.get('/geotags/:Location',function(req,res){
	var location = parseInt(req.params.location);
	var currentTag = inMemory.tagWithID(location);
	if(currentTag === undefined){
		res.status(404).send();
	}else{
		res.status(200).json(currentTag).send();
	}
});

app.delete('/geotags/:Location',function(req,res){
    var location = parseInt(req.params.location);
	var currentTag = inMemory.tagWithID(location);
	if(currentTag === undefined){
		res.status(404).send();
	}else{
		inMemory.deleteGeoTag(location);
		res.status(200).send();
	}
});

app.put('/geotags/:Location',function(req,res){
	var location = parseInt(req.params.location);
    let newGeoTag = new GeoTagForm(req.body.longitude,req.body.latitude,req.body.name,req.body.hashtag, location);
    inMemory.addGeoTag(newGeoTag);
    res.status(200).send(newGeoTag);

    ArrayGeoTags[newGeoTag.id]=newGeoTag; //überschreiben

});

/**
 * Setze Port und speichere in Express.
 */

var port = 3000;
app.set('port', port);

/**
 * Erstelle HTTP Server
 */

var server = http.createServer(app);

/**
 * Horche auf dem Port an allen Netzwerk-Interfaces
 */

server.listen(port);
