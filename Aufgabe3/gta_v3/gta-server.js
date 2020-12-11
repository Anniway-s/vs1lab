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
var ArrayGeoTags = [];

//GeoTag in Radius suchen
function searchGeoTagInRad(rad,lat, long){
    if(rad==null){ //´default
        rad= 10;
    }
    var ArrayGeoTagsInRad = [];
    for(var i=0;i<ArrayGeoTags.length;i++){
        //distanz ist die QuadratWurzel aus [(x2-x1)^2 + (y2-y1)^2]
        var distance = Math.sqrt(Math.pow(lat-ArrayGeoTags[i].latitude,2) +  Math.pow(long-ArrayGeoTags[i].longitude,2));
        if(distance<0)
            distance*=-1; //vorzeichen entfernen
        if(distance <=rad){
            ArrayGeoTagsInRad.push(ArrayGeoTags[i]);
        }
    }
    return ArrayGeoTagsInRad;
}

//GeoTag nach Hashtag suchen
function searchGeoTagByTag(tag){
    var ArrayWithTags = [];
    for(var i=0;i<ArrayGeoTags.length;i++){
        if(ArrayGeoTags[i].hashtag==tag){
            ArrayWithTags.push(ArrayGeoTags[i]);
        }
    }
    return ArrayWithTags;
}

//GeoTag zum Array hinzufügen
function addGeoTag(neuerGeoTag){
    ArrayGeoTags.push(neuerGeoTag);
}

//GeoTag von Array entfernen
function deleteGeoTag(name){
    let pos = ArrayGeoTags.indexOf(name);
    ArrayGeoTags.splice(pos, name);
}
    
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
        taglist: []
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
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/tagging', function(req, res){

    var newGeoTagName = GeoTagForm(document.getElementById("longitude").value, document.getElementById("latitude").value, document.getElementById("name").value, document.getElementById("hashtag").value);
    addGeoTag(newGeoTagName);

    res.render('gta', {
        taglist: ArrayGeoTags
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
app.post('/discovery', function(rep, res){

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
