
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
var idVar=0;
GeoTagForm=function (longitude, latitude, name, hashtag){
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
    this.hashtag = hashtag;
    this.id= idVar;
    idVar++;
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
	/*
    while(ArrayGeoTags[idVar].Location=='/'+idVar &&ArrayGeoTags[idVar].Location){ //FEHLER BEI 1. aufruf weil UNDEFINED
        ++idVar;
    }; //ist die id durch zb einen PUT schon im voraus vergeben? wir wollen ja hier nicht ersetzen
	*/
	console.log(req.body);
	let newGeoTag = new GeoTagForm(req.body.longitude,req.body.latitude,req.body.name,req.body.hashtag);
	console.log(newGeoTag);
    let newJson ={
        msg: 'success, created',
        obj: newGeoTag,
        Location: '/' +newGeoTag.id,
    };
    res.status(201).json({
        msg: 'success, created',
        obj: newGeoTag,
        Location: '/' +newGeoTag.id,
    });
    //if(newJson.Location!=='/0'){
        ArrayGeoTags.push(newGeoTag);//Wieso newJson und nicht newGeoTag???
    //}
});

app.get('/geotags',function(req,res){
    console.log("ArrayGet: "+JSON.stringify(ArrayGeoTags));
    res.status(200).json(
        ArrayGeoTags
    );
    res.end();
});

app.get('/geotags/:Location',function(req,res){
    res.status(200).json(
        ArrayGeoTags[req.params.Location]
    );
    res.end();
});

app.put('/geotags/:Location',function(req,res){
    let newGeoTag = new GeoTagForm(req.body.longitude,req.body.latitude,req.body.name,req.body.hashtag);
    let newJson ={
        msg: 'success, created',
        obj: newGeoTag,
        Location: '/' +newGeoTag.id,
    };
    res.status(201).json(newJson);

    ArrayGeoTags[newGeoTag.id]=newGeoTag; //überschreiben

});

app.delete('/geotags/:Location',function(req,res){
    ArrayGeoTags.splice(req.params.obj.id);
    idVar--; //Arrayindex anpassen um keine Lücke zu haben
    res.status(205).json(null);

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
