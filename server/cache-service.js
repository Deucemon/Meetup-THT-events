'use strict';

const fs = require('fs')
const path = require('path')

//https://stackabuse.com/reading-and-writing-json-files-with-node-js/
const currentDir = path.resolve(process.cwd(), '');

const getCache = (name) => {
  let filePath = currentDir + '/cache/'+name+'.json';
  if (fs.existsSync(filePath)) {
    let rawdata = fs.readFileSync(filePath);  
    return JSON.parse(rawdata);
  } else {
    return false;
  }
}

// writeCache :: String name, JSON json => void
const writeCache = (name, json) => {
  let data = JSON.stringify(json);
  fs.writeFileSync(currentDir + '/cache/'+name+'.json', data, (err) => {
    if (err) throw err;
    console.log('The cache has been updated');
  });
}

module.exports = { getCache, writeCache };
