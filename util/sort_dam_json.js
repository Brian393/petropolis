#!/usr/bin/env node
'use strict';

const fs = require('fs');

const aluminumFile = '../public/geojson/Aluminum.geojson';
const otherDamsFile = '../public/geojson/OtherDams2.geojson';
const bureauFile = '../public/geojson/Bureau2.geojson';
const armyCorpsFile = '../public/geojson/ArmyCorps2.geojson';

const aluminum = JSON.parse( fs.readFileSync(aluminumFile) );
const otherDams = JSON.parse( fs.readFileSync(otherDamsFile) );
const bureau = JSON.parse( fs.readFileSync(bureauFile) );
const armyCorps = JSON.parse( fs.readFileSync(armyCorpsFile) );

let allFeatures = [
	...aluminum.features, 
	...otherDams.features, 
	...bureau.features, 
	...armyCorps.features
]

allFeatures.sort(function (a, b) {
  return parseInt(a.properties.date) - parseInt(b.properties.date);
})

allFeatures.map( (f) => {
	f.properties.id = allFeatures.indexOf(f)
	return f;
});

// fs.writeFile(aluminumFile, JSON.stringify(aluminum, null, 2), (err) => {  
//     if (err) throw err;
//     console.log('wrote:', aluminumFile);
// });
// fs.writeFile(otherDamsFile, JSON.stringify(otherDams, null, 2), (err) => {  
//     if (err) throw err;
//     console.log('wrote:', otherDamsFile);
// });
// fs.writeFile(bureauFile, JSON.stringify(bureau, null, 2), (err) => {  
//     if (err) throw err;
//     console.log('wrote:', bureauFile);
// });
// fs.writeFile(armyCorpsFile, JSON.stringify(armyCorps, null, 2), (err) => {  
//     if (err) throw err;
//     console.log('wrote:', armyCorpsFile);
// });

aluminum.features.map( (f) => {
	f.properties["icon"] = 'icons/aluminum.png';
	return f;
})
otherDams.features.map( (f) => {
	f.properties["icon"] = 'icons/damOther.png';
	return f;
})
bureau.features.map( (f) => {
	f.properties["icon"] = 'icons/damBR.png';
	return f;
})
armyCorps.features.map( (f) => {
	f.properties["icon"] = 'icons/damAC.png';
	return f;
})

let baseGeoJson = {
  "type": "FeatureCollection",
  "name": "watershedDamsTransformation",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  "features": allFeatures
}

fs.writeFile('../public/geojson/watershedDamsTransformation.geojson', JSON.stringify(baseGeoJson, null, 2), (err) => {  
    if (err) throw err;
    console.log('wrote:', '../public/geojson/watershedDamsTransformation.geojson');
});
