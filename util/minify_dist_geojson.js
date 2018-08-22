#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dir = './dist/geojson/';

fs.readdir(dir, function(err, filez) {
  if (err) throw err;
  filez.forEach(function(f) {
    fs.readFile(path.resolve(dir, f), 'utf-8', function(err, content) {
      if (err) throw err;
      const data = JSON.parse( fs.readFileSync(path.resolve(dir, f)) );
      fs.writeFile(path.resolve(dir, f), JSON.stringify(data), (err) => {  
          if (err) throw err;
          console.info('minified:', f);
      });
    });
  });
});
