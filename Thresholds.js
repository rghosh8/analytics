import * as stat from "./stat.js";
const Thresholds = (data, num) => {
  data = data.slice(-num); 
  let factorCI;
  let factorVI;
  let warningToAlarm = 0.9;

  Kurt(data) < 0 ?  factorCI = 3: factorCI = 2;
  let marginCI = {
    lowWarning: stat.Mean(data) - (factorCI * warningToAlarm) * stat.Std(data),
    lowAlarm: stat.Mean(data) - (factorCI) * stat.Std(data),
    highWarning: stat.Mean(data) + (factorCI * warningToAlarm) * stat.Std(data),
    highAlarm: stat.Mean(data) + (factorCI) * stat.Std(data)
  }
  Kurt(data) < 0 ?  factorVI = 1: factorVI = 0.75;
  let marginVI = {
    warning: 0.1 * factorVI,
    alarm: 0.2 * factorVI
  } 
  return [marginCI, marginVI];
}