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
	console.log(f.properties.date)
	f.properties.id = allFeatures.indexOf(f)
	return f;
});

// console.log('aluminum:', JSON.stringify(aluminum))

fs.writeFile(aluminumFile, JSON.stringify(aluminum, null, 2), (err) => {  
    if (err) throw err;
    console.log('wrote:', aluminumFile);
});
fs.writeFile(otherDamsFile, JSON.stringify(otherDams, null, 2), (err) => {  
    if (err) throw err;
    console.log('wrote:', otherDamsFile);
});
fs.writeFile(bureauFile, JSON.stringify(bureau, null, 2), (err) => {  
    if (err) throw err;
    console.log('wrote:', bureauFile);
});
fs.writeFile(armyCorpsFile, JSON.stringify(armyCorps, null, 2), (err) => {  
    if (err) throw err;
    console.log('wrote:', armyCorpsFile);
});
