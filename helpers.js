// Helper functions

let helpers = {};

// TO-DO: rename functions

helpers.getLast5FeetOfDrillingPressure = function(data, startingIndex) {
  let index = startingIndex;
  let depth = data[index].bitPosition;
  let fiveFeetUp = depth-5;

  let startingDepth = 0;
  while(depth > fiveFeetUp) {
    depth = data[index].bitPosition;
    if(depth < fiveFeetUp) {
      startingDepth = index;
    }
    index--;
  }
  return startingDepth;
}

helpers.averagePressure = function(data, startingIndex) {
  let startingDepthIndex = helpers.getLast5FeetOfDrillingPressure(data, startingIndex);
  let endDepthIndex = startingIndex;
  let pressures = [];
  for(let i = startingDepthIndex; i < endDepthIndex; i++) {
    pressures.push(data[i].pumpPressure);
  }
  return pressures.reduce((first, second) => first+second)/pressures.length;
}

helpers.getConnectionCompletedTime = function(data, startingIndex) {
  let index = startingIndex;
  let set = data[index];
  while(set.bitStatus == 0 && index != data.length) {
    set = data[index];
    if(set.bitStatus == 1) {
      connectionCompletedtime = set.dateTime;
    }
    index++;
  };

  return set;
}

helpers.getPressureIncreaseStart = function(data, startingIndex, lastConnectionCompleted) {
  let index = startingIndex;
  let pressure = data[index].pumpPressure;
  let pressureIncreaseStart = {};
  let multiplier = 1;
  let nextConnectionIndex = helpers.getNextConnectionIndex(data, lastConnectionCompleted);
  while(pressure > 50 * multiplier && index != data.length - 1) {
    pressure = data[index].pumpPressure;
    if(pressure < 50 * multiplier) {
      pressureIncreaseStart = data[index]
    } else if(index == nextConnectionIndex) {
      index = startingIndex;
      multiplier = multiplier + 0.05;
    } else {
      index++;
    }
  }
  return pressureIncreaseStart;
}
// Keep decreasing the percentageOfOperatingPressure until the operating pressure is hit
helpers.getPressureReachedOperatingPressure = function(data, avgOperatingPressure, startingIndex, lastConnectionCompleted) {
  //console.log(startingIndex);
  let index = startingIndex;
  let percentage = 0.95;
  if(index != -1) {
    let nextConnectionIndex = helpers.getNextConnectionIndex(data, lastConnectionCompleted);
    let pressureReachedOperatingPressure = {};
    let pressure = data[index].pumpPressure;
    let set = data[index];
    console.log(nextConnectionIndex);
    while(pressure < avgOperatingPressure && index != data.length) {
      set = data[index];
      pressure = set.pumpPressure;
      if(pressure > avgOperatingPressure * percentage) {
        pressureReachedOperatingPressure = set;
        return pressureReachedOperatingPressure;
      } else if(index == nextConnectionIndex) {
        index = startingIndex;
        percentage = percentage - .05;
      } else {
        index++;
      }
    }
    return pressureReachedOperatingPressure;
  }
  return {
    dateTime: null,
    pumpPressure: null,
    bitStatus: null,
    bitPosition: null,
    blockHeight: null
  };
}

helpers.getNextConnectionIndex = function(data, lastConnectionCompleted) {
  let index = data.indexOf(lastConnectionCompleted);
  let set = data[index];
  let nextConnectionIndex = 0;
  for(let i = index; i < data.length; i++) {
    set = data[i];
    if(set.bitStatus == 0 && set.blockHeight < 10) {
      nextConnectionIndex = i;
      break;
    }
  }
  return nextConnectionIndex;
}

module.exports = helpers;
