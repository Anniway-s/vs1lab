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
        console.log("TagList #"+JSON.stringify(tags)+" l:"+tags.length);
        if (tags[0] !== '') for(let i=0; i<tags.length; i++){
            tagList += "|" + tags[i].name + "," + tags[i].latitude + "," + tags[i].longitude;
        };
        console.log(tagList)
        var urlString = "https://www.mapquestapi.com/staticmap/v4/getmap?key=" +
            apiKey + "&size=600,400&zoom=" + zoom + "&center=" + lat + "," + lon + "&" + tagList;

        console.log("Generated Maps Url: " + urlString);
        return urlString;
	};
	

	//Variablen für die Buttons erstellt
	var btnTagging = document.getElementById("btnTagging");
	var btnDiscovery = document.getElementById("btnDiscovery");

	//Jeweiligen Eventlistener
	btnTagging.addEventListener('click' , function(event){

		//Werte aus dem Dokument speichern
		var latitude = document.getElementById("latitude").value;
		var longitude = document.getElementById("longitude").value;
		var name = document.getElementById("name").value;
		var hashtag = document.getElementById("hashtag").value;

		//Die Daten die gesendet werden sollen
		var tag = {lat: latitude, long:longitude, nam: name, hash: hashtag}

		//Ajax Objekt erstellen
		var ajax = new XMLHttpRequest();

		//Den POST aufruf
		if(latitude!=='' && longitude!=='' && name !==''){
			ajax.open('POST', '/geotags', true);
			ajax.setRequestHeader('Content-Type', 'application/json');
			ajax.send(JSON.stringify(tag));
		}else{
			alert("Name, Longitude & Latitude have to be filled out");
		}



		//Auf den Status warten
		ajax.onreadystatechange = function() {

			if(ajax.readyState === 4 && (ajax.status === 201 ||ajax.status === 200)){
				console.log("##resonse nach btn "+ajax.response);
				gtaLocator.updateData(latitude, longitude, JSON.parse(ajax.response));//Ja nein?
			}else if(ajax.readyState === 4){
				console.log("## Status nach readystat 4: "+ajax.statusText);
				alert("Naaaah das sollte so nicht sein")
			}
		};
		event.preventDefault();
	});
	btnDiscovery.addEventListener('click' , function(event){
		event.preventDefault();

		//Werte aus dem Dokument entnehmen
		var searchTerm = document.getElementById("search_term").value;
		var longitude = document.getElementById("current_longitude").value;
		var latitude = document.getElementById("current_latitude").value;

		//Ajax Objekt erstellen
		var ajax = new XMLHttpRequest();

		//Suche mit einem Hashtag für senden vorbereiten
		if(searchTerm[0] === '#'){
			searchTerm = searchTerm.replace("#" , "%23");
			console.log("Suchbegriff ist nun:\t" + searchTerm);
		}else{
			console.log("Kein '#' vorhanden. Suchwort ist:" + searchTerm)
		}

		//GET Request
		ajax.open('GET', "/geotags?search_Term=" + searchTerm);
		ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		ajax.send(null);

		//Auf Status warten
		ajax.onreadystatechange = function() {
			if(ajax.readyState === 4 && ajax.status === 200){
				gtaLocator.updateData(latitude, longitude, JSON.parse(ajax.response));
			}else if(ajax.readyState === 4){
				console.log(ajax.statusText);
				alert("Neeeeh das sollte so nicht sein")
			}
		}
	});

    return { // Start öffentlicher Teil des Moduls ...
        // Public Member
        readme: "Dieses Objekt enthält 'öffentliche' Teile des Moduls.",

        updateLocation: function() {
			//Orte der Werte Zwischenspeichern
			var latitude = document.getElementById("current_latitude").getAttribute("value");
			var longitude = document.getElementById("current_longitude").getAttribute("value");
			var dataTags;
			console.log("data-tag"+document.getElementById("result-img").getAttribute("data-tags")+"|end");
			if(document.getElementById("result-img").getAttribute("data-tags") !== '') {
				dataTags = JSON.parse(document.getElementById("result-img").getAttribute("data-tags"));
			}else {
				dataTags=[''];
			}
			if(document.getElementById("longitude").value == "" && document.getElementById("latitude").value == ""){
				//Bei erstem Aufruf
				tryLocate(function(c){
					//Zwischenspeichern der Inhalte
					let latitude = c.coords.latitude;
					let longitude = c.coords.longitude;

					//Map URL herstellen
					let mapURL = getLocationMapSrc(latitude, longitude, dataTags);
					console.log("MapURL: "+mapURL);
					//Input für die Werte setzten
					document.getElementById("latitude").value = latitude;
					document.getElementById("longitude").value = longitude;
					document.getElementById("current_latitude").value = latitude;
					document.getElementById("current_longitude").value = longitude;
					document.getElementById("result-img").setAttribute("src" , mapURL);
				}, function (error) {
					alert(error)
				});
           }else{
			   //Falls schon etwas eingetragen ist
				let mapURL = getLocationMapSrc(latitude, longitude, dataTags);
				document.getElementById("result-img").setAttribute("src" , mapURL);
			}
			
		},
		updateData: function (latitude, longitude, tagsList) {
			//document.getElementById("results").empty();

			let element = document.getElementById("results")
			$("ul").empty();
			var li = document.createElement("li");

			console.log("###die taglist vor dem resaults :"+JSON.stringify(tagsList)+" L= "+Object.keys(tagsList).length);

			for(let j = 0; j < Object.keys(tagsList).length; j++){
				let li = document.createElement("li");
				let tag = tagsList[j].name + " (" + tagsList[j].latitude + "," + tagsList[j].longitude + ") " + tagsList[j].hashtag;
				li.appendChild((document.createTextNode(tag)));
				element.appendChild(li);
			}
			let mapURL = getLocationMapSrc(latitude, longitude, tagsList);
			document.getElementById("result-img").setAttribute("src" , mapURL);
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