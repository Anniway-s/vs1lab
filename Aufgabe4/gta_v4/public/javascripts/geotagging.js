/* Dieses Skript wird ausgeführt, wenn der Browser index.html lädt. */

// Befehle werden sequenziell abgearbeitet ...

/**
 * "console.log" schreibt auf die Konsole des Browsers
 * Das Konsolenfenster muss im Browser explizit geöffnet werden.
 */
console.log("The script is going to start...");

// Es folgen einige Deklarationen, die aber noch nicht ausgeführt werden ...

// Hier wird die verwendete API für Geolocations gewählt
// Die folgende Deklaration ist ein 'Mockup', das immer funktioniert und eine fixe Position liefert.
GEOLOCATIONAPI = {
    getCurrentPosition: function(onsuccess) {
        onsuccess({
            "coords": {
                "latitude": 49.013790,
                "longitude": 8.390071,
                "altitude": null,
                "accuracy": 39,
                "altitudeAccuracy": null,
                "heading": null,
                "speed": null
            },
            "timestamp": 1540282332239
        });
    }
};

// Die echte API ist diese.
// Falls es damit Probleme gibt, kommentieren Sie die Zeile aus.
GEOLOCATIONAPI = navigator.geolocation;

/**
 * GeoTagApp Locator Modul
 */
var gtaLocator = (function GtaLocator(geoLocationApi) {

    // Private Member

    /**
     * Funktion spricht Geolocation API an.
     * Bei Erfolg Callback 'onsuccess' mit Position.
     * Bei Fehler Callback 'onerror' mit Meldung.
     * Callback Funktionen als Parameter übergeben.
     */
    var tryLocate = function(onsuccess, onerror) {
        if (geoLocationApi) {
            geoLocationApi.getCurrentPosition(onsuccess, function(error) {
                var msg;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        msg = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        msg = "An unknown error occurred.";
                        break;
                }
                onerror(msg);
            });
        } else {
            onerror("Geolocation is not supported by this browser.");
        }
    };

    // Auslesen Breitengrad aus der Position
    var getLatitude = function(position) {
        return position.coords.latitude;
    };

    // Auslesen Längengrad aus Position
    var getLongitude = function(position) {
        return position.coords.longitude;
    };

    // Hier Google Maps API Key eintragen
    var apiKey = "PSXFEOKIyn1Ywt0V1l1x1SCOmOGwdoJ1";


    /**
     * Funktion erzeugt eine URL, die auf die Karte verweist.
     * Falls die Karte geladen werden soll, muss oben ein API Key angegeben
     * sein.
     *
     * lat, lon : aktuelle Koordinaten (hier zentriert die Karte)
     * tags : Array mit Geotag Objekten, das auch leer bleiben kann
     * zoom: Zoomfaktor der Karte
     */
    var getLocationMapSrc = function(lat, lon, tags, zoom) {
        zoom = typeof zoom !== 'undefined' ? zoom : 12;

        if (apiKey === "YOUR_API_KEY_HERE") {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        var tagList = "&pois=You," + lat + "," + lon;
        if (tags !== undefined) tags.forEach(function(tag) {
            tagList += "|" + tag.name + "," + tag.latitude + "," + tag.longitude;
        });
        console.log(tagList)
        var urlString = "https://www.mapquestapi.com/staticmap/v4/getmap?key=" +
            apiKey + "&size=600,400&zoom=" + zoom + "&center=" + lat + "," + lon + "&" + tagList;

        console.log("Generated Maps Url: " + urlString);
        return urlString;
	};
	
/*
    var ajax = new XMLHttpRequest();
    var btnTagging = document.getElementById("btnTagging");
    var btnDiscovery = document.getElementById("btnDiscovery");
    btnTagging.addEventListener('click', function(req,res){
        console.log("BtnTag Click");
        let newGeoTag = new geotagging.GeoTagForm(req.body.longitude,req.body.latitude,req.body.name,req.body.hashtag);
        ajax.open("POST","/",true);
        ajax.send(null);
        ajax.onreadystatechange = function() {
            // Zustand von Interesse
            if (ajax.readyState == 4) {
                exports.addGeoTag = function (neuerGeoTag, ArrayGeoTags) {
                    ArrayGeoTags.push(newGeoTag);
                    //console.log("Array erweitert mit :"+ArrayGeoTags[ArrayGeoTags.length].name)
                }
            }
        }; //Ende der Funktion

    });
    btnDiscovery.addEventListener('click', function(){
        console.log("TEST'''####");
    });
*/

	//Variablen für die Buttons erstellt
	var btnTagging = document.getElementById("btnTagging");
	var btnDiscovery = document.getElementById("btnDiscovery");
	
	//Jeweiligen Eventlistener
	btnTagging.addEventListener('click' , geoTag);
	btnDiscovery.addEventListener('click' , arrayTags);

	//Ajax XLMHttpRequest Objekt
	var ajax = new XMLHttpRequest();

	//Zugehörige Funktionen zu den Events
	function geoTag(){
		ajax.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200)
				alert(this.responseText); // Here is the response
		}
		ajax.open('POST', '/tagging', true);
		ajax.send(null);
		
		 
		
	}

	function arrayTags(){
		ajax.open('GET', "url", true);
		ajax.send(null);
	}

    return { // Start öffentlicher Teil des Moduls ...

        // Public Member

        readme: "Dieses Objekt enthält 'öffentliche' Teile des Moduls.",

        updateLocation: function() {
            if(document.getElementById("longitude").value == "" && document.getElementById("latitude").value == ""){
            //Aufgabe 2.2.1
            tryLocate(function(c){
                console.log(c.coords.longitude);
                console.log(c.coords.latitude);
                //Hidden Input in Discovery
                document.getElementById("current_longitude").value = c.coords.longitude;
                document.getElementById("current_latitude").value = c.coords.latitude;
                //Input in Taggig
                document.getElementById("longitude").value = c.coords.longitude;
                document.getElementById("latitude").value = c.coords.latitude;

                //Aufgabe 2.2.2
                var thisTag;
                var thisTagString = document.getElementById("result-img").getAttribute("data-tags");
                if(thisTagString !== ""){
                    thisTag = JSON.parse(thisTagString);
                }
                
                console.log(thisTagString)
                /**Zoom von [0-18] wählbar*/
                //var zoom = 13;
                var URL = getLocationMapSrc(document.getElementById("latitude").value, 
                document.getElementById("longitude").value, 
                thisTag, 
                zoom);

                //Suchen und ersetzen
                var map = document.getElementById("result-img");
                map.setAttribute ("src" , URL)

                },function(error){
                    alert(error);
                });
            }else{
                var zoom;
                var thisTag;
                var thisTagString = document.getElementById("result-img").getAttribute("data-tags");
                if(thisTagString !== ""){
                    thisTag = JSON.parse(thisTagString);
                }
                var URL = getLocationMapSrc(document.getElementById("latitude").value, 
                document.getElementById("longitude").value, 
                thisTag, 
                zoom);

                //Suchen und ersetzen
                var map = document.getElementById("result-img");
                map.setAttribute ("src" , URL)

            }

        }

    }; // ... Ende öffentlicher Teil
})(GEOLOCATIONAPI);

/**
 * $(function(){...}) wartet, bis die Seite komplett geladen wurde. Dann wird die
 * angegebene Funktion aufgerufen. An dieser Stelle beginnt die eigentliche Arbeit
 * des Skripts.
 */
$(function() {
    gtaLocator.updateLocation();
});