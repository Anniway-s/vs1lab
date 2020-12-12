exports.ArrayGeoTags = new Array();

exports.searchGeoTagInRad = function (rad,lat, long, ArrayGeoTags){
    console.log("Kommt an in RadSuche: rad, lat,long: " + rad +" " + lat +" " +  long);
    if(rad==null){ //´default
        rad= 100;
    }
    var ArrayGeoTagsInRad = new Array();
    for(var i=0;i<ArrayGeoTags.length;i++){
        console.log("ausArrayGeoTags   index: " + i +" Arr: "+ArrayGeoTags[i].latitude +" "+ArrayGeoTags[i].longitude);
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


//GeoTag nach Hashtag suchen
exports.searchGeoTagByTag = function (tag, ArrayGeoTags){

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
            console.log("Kommt an in TagSuche: Tag, ausArrayGeoTags : " + tag +" "+ArrayGeoTags[i].hashtag);
            if(ArrayGeoTags[i].hashtag==tag){
                ArrayWithTags.push(ArrayGeoTags[i]);
                console.log("  *Match!")
            }
        }
    //Wenn Tag ein Name ist
    }else{
        //Jedes Objekt von den aktuellen Tags
        console.log(" Landet in Else (Ist kein Hashtag)")
        for(var i=0;i<ArrayGeoTags.length;i++){
            console.log("Kommt an in TagSuche (Name): Tag, ausArrayGeoTags : " + tag +" "+ArrayGeoTags[i].name);
            if(ArrayGeoTags[i].name.length > tag.length){
                console.log("Sind nicht gleich lang!")
                if(ArrayGeoTags[i].name.substring(0, tag.length) ==tag.substring(0, tag.length)){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                }else if(ArrayGeoTags[i].hashtag.substring(1, tag.length+1) ==tag.substring(0, tag.length)){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                }else{
                    console.log("Nichts >.<")
                }
            }else{
                console.log("Sind gleich lang!")
                if(ArrayGeoTags[i].name==tag){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                    console.log("  *Match!")
                }else if(ArrayGeoTags[i].hashtag.substring(1, tag.length+1) ==tag.substring(0, tag.length)){
                    ArrayWithTags.push(ArrayGeoTags[i]);
                }else{
                    console.log("Nichts >.<")
                }
            }
        }
    }
return ArrayWithTags;
}

//GeoTag zum Array hinzufügen
exports.addGeoTag = function (neuerGeoTag, ArrayGeoTags){
    ArrayGeoTags.push(neuerGeoTag);
    //console.log("Array erweitert mit :"+ArrayGeoTags[ArrayGeoTags.length].name)
}

//GeoTag von Array entfernen
exports.deleteGeoTag = function (name, ArrayGeoTags){
    let pos = ArrayGeoTags.indexOf(name);
    ArrayGeoTags.splice(pos, name);
};
