
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

//Array für die Tags
ArrayGeoTags = new Array();

/**
 * Konfiguriere den Pfad für statische Dateien.
 * Teste das Ergebnis im Browser unter 'http://localhost:3000/'.
 */

app.use(express.static(__dirname + '/public'));

/**
 * Konstruktor für GeoTag Objekte.
 * GeoTag Objekte sollen min. alle Felder des 'tag-form' Formulars aufnehmen.
 */
var id=0;
GeoTagForm=function (longitude, latitude, name, hashtag){
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
    this.hashtag = hashtag;
    this.id= id;
    id++;
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
    let newGeoTag = new GeoTagForm(req.body.longitude,req.body.latitude,req.body.name,req.body.hashtag);
    ArrayGeoTags.push(newGeoTag);
    res.status(201).json({
        msg: 'success, created',
        obj: newGeoTag,
        URI: './'+newGeoTag.id,
    });
});

app.get('/geotags',function(req,res){
    let newGeoTag = new GeoTagForm(req.body.longitude,req.body.latitude,req.body.name,req.body.hashtag);
    ArrayGeoTags.push(newGeoTag);
    res.status(201).json({
        msg: 'success, created',
        obj: newGeoTag,
        URI: './'+newGeoTag.id,
    });
});

app.put('/geotags',function(req,res){
    let newGeoTag = new GeoTagForm(req.body.longitude,req.body.latitude,req.body.name,req.body.hashtag);
    ArrayGeoTags.push(newGeoTag);
    res.status(201).json({
        msg: 'success, created',
        obj: newGeoTag,
        URI: './'+newGeoTag.id,
    });
});

app.delete('/geotags',function(req,res){
    let newGeoTag = new GeoTagForm(req.body.longitude,req.body.latitude,req.body.name,req.body.hashtag);
    ArrayGeoTags.push(newGeoTag);
    res.status(201).json({
        msg: 'success, created',
        obj: newGeoTag,
        URI: './'+newGeoTag.id,
    });
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
