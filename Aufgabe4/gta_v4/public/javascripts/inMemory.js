var ArrayGeoTags = [];
exports.ArrayGeoTags = ArrayGeoTags;

//GeoTag in das Array hiunzufügen
exports.addGeoTag = function (neuerGeoTag){
    ArrayGeoTags.push(neuerGeoTag);
    //console.log("Array erweitert mit :"+ArrayGeoTags[ArrayGeoTags.length].name)
}

exports.addGeoTagWithLocation = function (neuerGeoTag, location){
	ArrayGeoTags.splice(location, 1, neuerGeoTag);
}

//Funktion zum Löschen
 exports.deleteGeoTag = function(location){//Überarbeiten
	let b;
	for(let i = 0; i < ArrayGeoTags.length; i++){
		if(ArrayGeoTags[i].location === parseInt(location)){
			ArrayGeoTags.splice(b, 1);
		}
	}
    
};
//Suche nach einem Tag mit vorhandener ID
exports.tagWithID = function(location){//Überarbeiten
	console.log(location);
	for(var i = 0; i < ArrayGeoTags.length; i++){
		if(ArrayGeoTags[i].location === parseInt(location)){
			return ArrayGeoTags[i];
		}
	}
	return undefined;
}	


//Eine Liste Aller Teile
exports.allGeoTags = function(){
	return ArrayGeoTags;
}



//Alle Tags mit passendem Namen
exports.searchGeoTagByTag = function (tag){

    console.log("Kommt an in TagSuche: Tag, : " + tag);
    var ArrayWithTags = new Array();
    //Wenn Tag leer ist
    if(tag == null){
        for ( var p = 0; p < ArrayGeoTags.length; p++){
            ArrayWithTags[p] = ArrayGeoTags[p];
        }
    //Wenn Tag ein # ist
    }else if(tag.charAt(0) == "#"){
        for(var i=0;i<ArrayGeoTags.length;i++){
            //Unterschiedlich langes Suchwort
            if(ArrayGeoTags[i].hashtag.length > tag.length){
                console.log(ArrayGeoTags[i].hashtag.substring(0, (tag.lenght-1)) + " safe das gleiche")
                if(ArrayGeoTags[i].hashtag.substring(0, tag.length) ==tag.substring(0, tag.length)){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                    console.log("  *Match!")
                }
            //Gleich langes Suchwort
            }else if(ArrayGeoTags[i].hashtag==tag){
                ArrayWithTags.push(ArrayGeoTags[i]);
                console.log("  *Match!")
            } 
            
        }
    //Wenn Tag ein Name ist oder der Hashtag ohne # gesucht wurde
    }else{
        console.log(" Landet in Else (Ist kein Hashtag enthalten)")
        //Jedes Objekt von den aktuellen Tags
        for(var i=0;i<ArrayGeoTags.length;i++){
            console.log("Kommt an in TagSuche (Name): Tag, ausArrayGeoTags : " + tag +" "+ArrayGeoTags[i].name);
            //Haben unterschiedliche länge
            if(ArrayGeoTags[i].name.length > tag.length){
                console.log("Sind nicht gleich lang!")
                //Ist der Tag der Anfang eines Namens?
                if(ArrayGeoTags[i].name.substring(0, tag.length) ==tag.substring(0, tag.length)){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                //Anfang eines Hashtags?
                }else if(ArrayGeoTags[i].hashtag.substring(1, tag.length+1) == tag.substring(0, tag.length)){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                //Ist keins von beidem
                }else{
                    console.log("Nichts >.<")
                }
            //Haben gleiche länge
            }else{
                console.log("Sind gleich lang!")
                //Sind Namen und Tag gleich?
                if(ArrayGeoTags[i].name==tag){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                    console.log("  *Match!")
                //Passt es dann mit dem Hashtag?
                }else if(ArrayGeoTags[i].hashtag.substring(1, tag.length+1) == tag.substring(0, tag.length)){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                //Keins von beidem
                }else{
                    console.log("Nichts >.<")
                }
            }
        }
    }
return ArrayWithTags;
}

//Alle Tags mit passendem Namen in einem vorhandener Liste
exports.searchGeoTagByTag2 = function (tag, ArrayGeoTags){

    console.log("Kommt an in TagSuche: Tag, : " + tag);
    var ArrayWithTags = new Array();
    //Wenn Tag leer ist
    if(tag == null){
        for ( var p = 0; p < ArrayGeoTags.length; p++){
            ArrayWithTags[p] = ArrayGeoTags[p];
        }
    //Wenn Tag ein # ist
    }else if(tag.charAt(0) == "#"){
        for(var i=0;i<ArrayGeoTags.length;i++){
            //Unterschiedlich langes Suchwort
            if(ArrayGeoTags[i].hashtag.length > tag.length){
                console.log(ArrayGeoTags[i].hashtag.substring(0, (tag.lenght-1)) + " safe das gleiche")
                if(ArrayGeoTags[i].hashtag.substring(0, tag.length) ==tag.substring(0, tag.length)){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                    console.log("  *Match!")
                }
            //Gleich langes Suchwort
            }else if(ArrayGeoTags[i].hashtag==tag){
                ArrayWithTags.push(ArrayGeoTags[i]);
                console.log("  *Match!")
            } 
            
        }
    //Wenn Tag ein Name ist oder der Hashtag ohne # gesucht wurde
    }else{
        console.log(" Landet in Else (Ist kein Hashtag enthalten)")
        //Jedes Objekt von den aktuellen Tags
        for(var i=0;i<ArrayGeoTags.length;i++){
            console.log("Kommt an in TagSuche (Name): Tag, ausArrayGeoTags : " + tag +" "+ArrayGeoTags[i].name);
            //Haben unterschiedliche länge
            if(ArrayGeoTags[i].name.length > tag.length){
                console.log("Sind nicht gleich lang!")
                //Ist der Tag der Anfang eines Namens?
                if(ArrayGeoTags[i].name.substring(0, tag.length) ==tag.substring(0, tag.length)){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                //Anfang eines Hashtags?
                }else if(ArrayGeoTags[i].hashtag.substring(1, tag.length+1) == tag.substring(0, tag.length)){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                //Ist keins von beidem
                }else{
                    console.log("Nichts >.<")
                }
            //Haben gleiche länge
            }else{
                console.log("Sind gleich lang!")
                //Sind Namen und Tag gleich?
                if(ArrayGeoTags[i].name==tag){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                    console.log("  *Match!")
                //Passt es dann mit dem Hashtag?
                }else if(ArrayGeoTags[i].hashtag.substring(1, tag.length+1) == tag.substring(0, tag.length)){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                //Keins von beidem
                }else{
                    console.log("Nichts >.<")
                }
            }
        }
    }
return ArrayWithTags;
}


//Suche um den letzten Punkt mit Radius
exports.searchGeoTagInRad = function (rad,lat, long){
    console.log("Kommt an in RadSuche: rad, lat,long: " + rad +" " + lat +" " +  long);
    if(rad==null){ //default
        rad= 100;
    }
    var ArrayGeoTagsInRad = new Array();
    for(var i=0;i<ArrayGeoTags.length;i++){
        console.log("ausArrayGeoTags   index: " + i +" Arr: "+ArrayGeoTags[i].latitude +" "+ArrayGeoTags[i].longitude);
        //distanz ist die QuadratWurzel aus [(x2-x1)^2 + (y2-y1)^2]
        var distance = Math.sqrt(Math.pow(lat-ArrayGeoTags[i].latitude,2) +  Math.pow(long-ArrayGeoTags[i].longitude,2));
        console.log("DISTANCE "+i +" "+distance);

        if(distance <=rad){
            ArrayGeoTagsInRad.push(ArrayGeoTags[i]);
        }
    }
    return ArrayGeoTagsInRad;
}
