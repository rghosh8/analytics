
let inputData = [1, 2, 3, 9, 11, 12, 15, 17, 18, 21, 23, 24, 27];

// This suporting function takes a time series data and find total number of elements 
const Len = (data) => data.length
console.log(Len(inputData))

// This supporting function takes a time series data and find the sum of the elements 
const Sum = (data) => data.reduce((acc, curr) => acc + curr);
console.log(Sum(inputData))

// This supporting function takes a time series data and find the Mean of the elements
const Mean = (data) => Sum(data)/Len(data)
console.log(Mean(inputData))   

// This supporting function takes a time series data and find the simple moving average. num is 
// the number of previous data points used for the moving average computation. 

const SMA = (data, num) => Sum(data.slice(-num))/Len(data.slice(-num))
console.log(SMA(inputData, num=2))

// Statistical moment is an important parameter for understanding the shape of the distribution

const  nStatMoment = (data, n) => data.map(element => Math.pow((element - Mean(data)), n)).reduce((acc, curr) => acc + curr);
console.log(nStatMoment(inputData, 2))
console.log(nStatMoment(inputData, 3))

// Variance (bias corrected)

const Variance = (data) => nStatMoment(data, 2)/(Len(data) - 1)
console.log(Variance(inputData))

const Std = (data) => Math.sqrt(Variance(data))
console.log('standard deviation --- ', Std(inputData))

//Skewness
const Skew = (data) => nStatMoment(data, 3)/Math.pow(Std(inputData), 3)/Len(data)
console.log('skewness --- ', Skew(inputData))

//Excess Kurtosis
const Kurt = (data) => nStatMoment(data, 4)/Math.pow(Std(data), 4)/Len(data) - 3
console.log('Excess Kurtosis ---', Kurt(inputData))

 //Anomaly detection
 // The entire horizon is computed on a rolling basis
const isAnomaly = (present, data, num) => {
  data = data.slice(-num)
  if(Std(data) === 0 && Mean(data) !== present){
    return true
  }
  if(Skew(data) < 0 && Kurt(data) > 0){
    let factor = 1.5
    return present < Mean(data) - factor * Std(data);
  }
  if(Kurt(data) > 0){
    let factor = 2
    return (present > Mean(data) + factor * Std(data)) || (present < Mean(data) - factor * Std(data))
  }
  let factor = 3;
  return present > (Mean(data) + factor * Std(data)) || (present < Mean(data) - factor * Std(data))
}
console.log('isAnomaly ---', isAnomaly(111, inputData, 10))

// Volatility Risk defined as the coefficient varaince
const VI = (data, num) => {
  data = data.slice(-num)
  return Std(data)/Mean(data)
}
console.log('VI---', VI(inputData, 10))

//Compliance Index
const CI = (present, data, num) => {
  data = data.slice(-num);
  let factor = 3;
  let upper = Mean(data) + factor * Std(data);
  let lower = Mean(data) - factor * Std(data);
  return (present - lower)/(upper - lower)
}
console.log('CI ---- ', CI(15, inputData, 10))

// Dynamic thresholds
const Thresholds = (data, num) => {
  data = data.slice(-num); 
  let factorCI;
  let factorVI;
  let warningToAlarm = 0.9;

  Kurt(data) < 0 ?  factorCI = 3: factorCI = 2;
  let marginCI = {
    lowWarning: Mean(data) - (factorCI * warningToAlarm) * Std(data),
    lowAlarm: Mean(data) - (factorCI) * Std(data),
    highWarning: Mean(data) + (factorCI * warningToAlarm) * Std(data),
    highAlarm: Mean(data) + (factorCI) * Std(data)
  }
  Kurt(data) < 0 ?  factorVI = 1: factorVI = 0.75;
  let marginVI = {
    warning: 0.1 * factorVI,
    alarm: 0.2 * factorVI
  } 
  return [marginCI, marginVI];
}

// Finding a real-time health score
//alpha determines relative weight of compliance risk over the volatility risk
const SensorHealthScore = (CI, VI, alpha, data, num) => {
  let [marginCI, marginVI] = Thresholds(data, num);
  if (alpha < 0 || alpha >1) return {score: null, message: 'alpha must be between 0 (inclusive) and 1 (inclusive)'};

  if (CI === undefined && VI === undefined) return {score: null, message: 'undefined'};
  if (VI === undefined) return {score: CI, message: 'volatility risk is not defined'};
  if (CI === undefined) return {score: VI, message: 'compliance risk is not defined'};

  if (CI < marginCI.lowAlarm) return {score: 0, message: 'lower threshold breached'};
  if (CI > marginCI.higAlarm) return {score: 0, message: 'upper threshold breached'};
  if (VI > marginVI.alarm)  return {score: 0, message: 'volatility margin breached'};

  if (CI < marginCI.lowWarning && VI > marginVI.warning)  return {score: 0, message: 'high volatility near lower threshold'}; 
  if (CI > marginCI.highWarning && VI > marginVI.warning) return {score: 0, message: 'high volatility near upper threshold'};
  
  if (CI < marginCI.lowWarning)  return {score: (CI - marginCI.lowAlarm)/(marginCI.lowWarning - marginCI.lowAlarm), message: 'operating near lower threshold'};
  if (CI > marginCI.highWarning) return {score: (marginCI.highAlarm - CI)/(marginCI.highAlarm - marginCI.highWarning), message: 'operating near upper threshold'};
  if (VI > marginVI.warning)  return {score: (marginVI.alarm- VI)/(marginVI.alarm - marginVI.warning), message: 'operating with high volatility'};
  
  let complianceRisk = (CI - marginCI.lowWarning)/(marginCI.highWarning - marginCI.lowWarning);
  let volatilityRisk = (marginVI.alarm - VI)/(marginVI.alarm - marginVI.warning);
  let testScore = alpha * complianceRisk  + (1 - alpha) * complianceRisk;
  return {score: testScore, message: 'healthy sensor' };
}



console.log(SensorHealthScore(0.25, 0.02, 0.5, inputData, 10))

const DeviceHealthScore = (id, num) => {
  // Device-SensorHealthScore[id, num] maps device ids to sensor health scores
   return SMA(Device-SensorHealthScore[id, num], num)
}



