// Takes CSV file when called in console, if the CSV file is compatible, then continue.
// If not return 'incompatible csv file'

// Set each column of the csv file to an array
const fs = require('fs');
const parse = require('csv-parse');
const data = require('./data.js');
const helpers = require('./helpers.js');

let connections = [];
let numberOfConnections = 0;

data.parseCSVFile('inputData.csv', (err, parsedData) => {
  if(!err && parsedData) {
    // Iterate over each set and determine if there is a connection
    for(let i = 0; i < parsedData.length; i++) {
      let set = parsedData[i];
      if(set.blockHeight < 10 && set.bitStatus == 0) {
        numberOfConnections++;
        let connectionDepth = set.bitPosition;
        let startConnectionTime = set.dateTime;
        let endConnectionTime = helpers.getConnectionCompletedTime(parsedData, i);
        let averagePressure = helpers.averagePressure(parsedData, i);
        let pressureIncreaseStart = helpers.getPressureIncreaseStart(parsedData, i, endConnectionTime);
        let pressureIncreasingIndex = parsedData.indexOf(pressureIncreaseStart);
        let pressureReachedOperatingPressure = helpers.getPressureReachedOperatingPressure(parsedData, averagePressure, pressureIncreasingIndex, endConnectionTime);


        let connectionObject = {};
        connectionObject.connection = numberOfConnections;
        connectionObject.connectionDepth = connectionDepth;
        connectionObject.offBottomTimeB1 = startConnectionTime;
        connectionObject.onBottomTimeB2 = endConnectionTime.dateTime;
        connectionObject.averagePressure = averagePressure;
        connectionObject.p1 = pressureIncreaseStart.dateTime;
        connectionObject.p2 = pressureReachedOperatingPressure.dateTime;
        connectionObject.connectionIndex = i;
        connections.push(connectionObject);
        let startingSetForNextLoop = parsedData.indexOf(endConnectionTime);
        i = startingSetForNextLoop;
      } else if(set.bitStatus == 0) {
        //console.log("bit is off bottom...");
      } else {
        //console.log("drilling...");
      }
    }
    console.log(connections);
  } else {
    console.log("Error parsing csv: "+err);
  }
});
