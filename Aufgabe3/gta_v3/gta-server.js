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
// TODO: CODE ERGÄNZEN
app.use(express.static(__dirname + '/public'));

/**
 * Konstruktor für GeoTag Objekte.
 * GeoTag Objekte sollen min. alle Felder des 'tag-form' Formulars aufnehmen.
 */
// TODO: CODE ERGÄNZEN
function GeoTagForm(longitude, latitude, name, hashtag){
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
    this.hashtag = hashtag;
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
 /*
var ArrayGeoTags = [];

//GeoTag in Radius suchen
function searchGeoTagInRad(rad,lat, long){
    if(rad==null){ //´default
        rad= 100;
    }
    var ArrayGeoTagsInRad = [];
    for(var i=0;i<ArrayGeoTags.length;i++){
        //distanz ist die QuadratWurzel aus [(x2-x1)^2 + (y2-y1)^2]
        var distance = Math.sqrt(Math.pow(lat-ArrayGeoTags[i].latitude,2) +  Math.pow(long-ArrayGeoTags[i].longitude,2));
        console.log("DISTANCE "+i +" "+distance);
        if(distance<0)
            distance*=-1; //vorzeichen entfernen
        if(distance <=rad){
            ArrayGeoTagsInRad.push(ArrayGeoTags[i]);
        }
    }
    return ArrayGeoTagsInRad;
}


//GeoTag zum Array hinzufügen
function addGeoTag(neuerGeoTag){
    ArrayGeoTags[ArrayGeoTags.length]=neuerGeoTag;
    //console.log("Array erweitert mit :"+ArrayGeoTags[ArrayGeoTags.length].name)
}

//GeoTag von Array entfernen
function deleteGeoTag(name){
    let pos = ArrayGeoTags.indexOf(name);
    ArrayGeoTags.splice(pos, name);
}*/
    
// TODO: CODE ERGÄNZEN

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

/**
 * Route mit Pfad '/tagging' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'tag-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Mit den Formulardaten wird ein neuer Geo Tag erstellt und gespeichert.
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 */
app.post('/tagging', function(req, res){
    let newGeoTag = new GeoTagForm(req.body.longitude,req.body.latitude,req.body.name,req.body.hashtag);
    inMemory.addGeoTag(newGeoTag, inMemory.ArrayGeoTags);
    res.render('gta', {
        taglist: inMemory.searchGeoTagInRad(100,req.body.longitude,req.body.latitude, inMemory.ArrayGeoTags),
        latitude:req.body.latitude,
        longitude: req.body.longitude,
        map: JSON.stringify(inMemory.ArrayGeoTags)
    });
});
// TODO: CODE ERGÄNZEN START

/**
 * Route mit Pfad '/discovery' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'filter-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 * Falls 'term' vorhanden ist, wird nach Suchwort gefiltert.
 */
app.post('/discovery', function(req, res){
    console.log("lat,long,term: " + req.body.current_latitude +" " + req.body.current_longitude +" " +  req.body.search_term);
    console.log("search: " + req.body.search_term);
    res.render('gta',{
        taglist: inMemory.searchGeoTagInRad(100,req.body.current_latitude,req.body.current_longitude, inMemory.searchGeoTagByTag(req.body.search_term, inMemory.ArrayGeoTags)),
        latitude: req.body.current_latitude,
        longitude: req.body.current_longitude,
        map: JSON.stringify(inMemory.searchGeoTagByTag(req.body.search_term, inMemory.ArrayGeoTags))
    });
})
// TODO: CODE ERGÄNZEN

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
