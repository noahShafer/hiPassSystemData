
const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

let baseDir = __dirname;

let data = {};

// parses csv and returns obect
data.parseCSVFile = function(file, callback) {
  let arrayOfDataSetObjects = [];
  fs.readFile(baseDir+'/'+file, (err, data) => {
    if(err == null) {
      parse(data, (err, dataSets) => {
        // Removes column titles from array
        dataSets.shift();
        // Iterates of sets of data and makes an object out of the data and pushes it on to an arrayOfDataSetObjects

        dataSets.forEach(set => {
          let dataSetAsObject = {};
          dataSetAsObject.dateTime = set[0];
          dataSetAsObject.pumpPressure = parseFloat(set[1]);
          dataSetAsObject.bitStatus = parseFloat(set[2]);
          dataSetAsObject.bitPosition = parseFloat(set[3]);
          dataSetAsObject.blockHeight = parseFloat(set[4]);
          arrayOfDataSetObjects.push(dataSetAsObject);
        });

        callback(false, arrayOfDataSetObjects);
      });
    } else {
      callback(err);
    }
  });
};



module.exports = data;
