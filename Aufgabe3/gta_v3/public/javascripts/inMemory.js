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
    for(var i=0;i<ArrayGeoTags.length;i++){
        console.log("Kommt an in TagSuche: Tag, ausArrayGeoTags : " + tag +" "+ArrayGeoTags[i].hashtag);
        if(ArrayGeoTags[i].hashtag==tag){
            ArrayWithTags.push(ArrayGeoTags[i]);
            console.log("  *Match!")
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
}