
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
var location=0;
GeoTagForm=function ( latitude, longitude, name, hashtag, id){
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
	this.hashtag = hashtag;
	if(id === undefined){
		this.location= location;
    	location++;
	}else{
		this.location = location;
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
	let newGeoTag = new GeoTagForm(req.body.lat,req.body.long,req.body.nam,req.body.hash);
	inMemory.addGeoTag(newGeoTag);
	console.log("##new geo tag in POST: "+JSON.stringify(newGeoTag));
	var url = 'http://' + req.get('host') + req.url + '/' + newGeoTag.id;
	res.status(201).location(url).send(inMemory.ArrayGeoTags);
});

app.get('/geotags',function(req,res){

	let search_term = req.query.search_Term;
	let radius = req.query.radius;
	radius = (radius === undefined) ?  0.4 : radius ;
	console.log("GETTING by SearchTerm: "+search_term+" in Rad : "+radius);

	if(search_term === undefined ){
		res.status(200).json(inMemory.allGeoTags()).send();
	} else if(search_term !== undefined ){//by Search Term
		let a = inMemory.searchGeoTagByTag(search_term);
		console.log("gefiltertes Array: " +JSON.stringify(a));
		res.status(200).json(a).send();
	} else {//in Radius
		res.status(200).json(inMemory.searchGeoTagInRad(radius, req.body.latitude, req.body.longitude)).send();
	}


});

app.get('/geotags/:location',function(req,res){
	var location = parseInt(req.params.location);
	var currentTag = inMemory.tagWithID(location);
	console.log("current Tag in Search ist: ##" + currentTag);
	if(currentTag === undefined){
		res.status(404).send();
	}else{
		res.status(200).json(currentTag).send();
	}
});



app.delete('/geotags/:location',function(req,res){
    var location = parseInt(req.query.location);
	var currentTag = inMemory.tagWithID(location);
	if(currentTag !== undefined){
		res.status(404).send(); //##Es geht immer hier rein -> tagWithID stimmt nicht
	}else{
		inMemory.deleteGeoTag(location); //##Ob das hier Stimmt weiß ich nicht
		res.status(200).send("OK");
	}
});

app.put('/geotags/:location',function(req,res){
	var location = (req.query.location); //###Ist "undefinde"
    let newGeoTag = new GeoTagForm(req.body.lat,req.body.long,req.body.nam,req.body.hash, location);
	inMemory.addGeoTagWithLocation(newGeoTag, location);
	//inMemory.ArrayGeoTags[newGeoTag.id]=newGeoTag; //überschreiben
	res.status(200).send(newGeoTag);
	
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
