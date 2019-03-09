
let inputData = [1, 2, 3, 9, 11, 12, 15, 17, 18, 21, 23, 24, 27];

//
const Len = (data) => data.length
console.log(Len(inputData))

// sum
const Sum = (data) => data.reduce((acc, curr) => acc + curr);
console.log(Sum(inputData))

// mean
const Mean = (data) => Sum(data)/Len(data)
console.log(Mean(inputData))   

// Moving Average (choosing )

const MovingAverage = (data, num) => Sum(data.slice(-num))/Len(data.slice(-num))
console.log(MovingAverage(inputData, num=2))

//mean substraction Nth order

const  MeanSubN = (data, n) => data.map(element => Math.pow((element - Mean(data)), n))
console.log(MeanSubN(inputData, 2))
console.log(MeanSubN(inputData, 3))



// sum of mean substraction square list

const MeanSubSqSum = (data) => MeanSubN(data, 2).reduce((acc, curr) => acc + curr)
console.log(MeanSubSqSum(inputData))


//variance (bias corrected)

const Variance = (data) => MeanSubSqSum(data)/(Len(data) - 1)
console.log(Variance(inputData))

//standard deviation

const Std = (data) => Math.sqrt(Variance(data))
console.log(Std(inputData))

// sum of mean substraction cube list

const MeanSubCubeSum = (data) => MeanSubN(data, 3).reduce((acc, curr) => acc + curr)
console.log(MeanSubCubeSum(inputData))

//Skewness
const Skew = (data) => MeanSubCubeSum(data)/Math.pow(Variance(inputData), 1.5)/Len(data)
console.log(Skew(inputData))

// sum of mean substraction 4th order list
const MeanSub4Sum = (data) => MeanSubN(data, 4).reduce((acc, curr) => acc + curr)
console.log(MeanSub4Sum(inputData))

//Excess Kurtosis
const Kurt = (data) => (MeanSub4Sum(data)/Math.pow(Variance(data), 2)/Len(data)) - 3
console.log('Excess Kurtosis ---', Kurt(inputData))

//Anomaly detection

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

console.log('isAnomaly ---', isAnomaly(111, inputData, 2))

// Volatility Index

const VI = (data, num) => {
  data = data.slice(-num)
  return Std(data)/Mean(data)
}
console.log('VI---', VI(inputData, 2))

// Compliance Index

const CI = (present, upper, lower) => (present - lower)/(upper - lower)
console.log('CI ---- ', CI)


//Very basic forecasting
const PointForecast = (data, num) => MovingAverage(data, num)
console.log('PointForecast ------', PointForecast(inputData, 3));

let result = []
const HorizonForecast = (data, num, horizon, factor) => {
  if (horizon > factor*num){
    console.log('Critical Horizon ---', factor*num)
    return -1
  }
  if (horizon < 1) {
    return -1
  }
  if (horizon === 1){
     result.push(PointForecast(data, num))
    
  } else {
    result.push(HorizonForecast(data, num, horizon - 1, factor));
  }
  return result
}
/// fix the recursion problem
console.log('HorizonForecast ------', HorizonForecast(inputData, 10, 3, 0.5));

// Finding a real-time health score
//alpha determines relative weight of compliance risk over the volatility risk
const SensorHealthScore = (CI, VI, thresholds, alpha) => {
  if (alpha < 0 || alpha >1) return {score: -1, message: 'alpha must be between 0 (inclusive) and 1 (inclusive'};
  if (CI === undefined && VI === undefined) return {score: -1, message: 'undefined'};
  if (VI === undefined) return {score: CI, message: 'volatility risk is not defined'};
  if (CI === undefined) return {score: VI, message: 'compliance risk is not defined'};
  if (CI < thresholds.lowCI) return {score: 0, message: 'lower threshold breached'};
  if (CI > thresholds.highCI) return {score: 0, message: 'upper threshold breached'};
  if (VI > thresholds.highVI)  return {score: 0, message: 'volatility margin breached'};
  if (CI < thresholds.lowMidCI && VI > thresholds.highMidVI)  return {score: 0, message: 'high volatility near lower threshold'}; 
  if (CI > thresholds.highMidCI && VI > thresholds.highMidVI) return {score: 0, message: 'high volatility near upper threshold'};
  if (CI < thresholds.lowMidCI)  return {score: (CI - thresholds.lowMidCI)/(thresholds.lowCI - thresholds.lowMidCI), message: 'operating near lower threshold'};
  if (CI > thresholds.highMidCI) return {score: (thresholds.highCI - CI)/(thresholds.highCI - thresholds.highMidCI), message: 'operating near upper threshold'};
  if (VI > thresholds.highMidVI)  return {score: (thresholds.highVI- VI)/(thresholds.highVI - thresholds.highMidVI), message: 'operating with high volatility'};
  let complianceRisk = (CI - thresholds.lowMidCI)/(thresholds.highMidCI - thresholds.lowMidCI);
  let volatilityRisk = (thresholds.highVI - VI)/(thresholds.highVI - thresholds.highMidVI)
  let testScore = alpha * complianceRisk  + (1 - alpha) * complianceRisk;
  return {score: testScore, message: 'healthy sensor' };
}
console.log(HealthScore(0.25, 0.02, sampleThresholds, 0.5))
let sampleThresholds= {
   lowCI: 0.01,
   lowMidCI: 0.1,
   highMidCI: 0.9,
   highCI: 0.99,
   highVI: 0.2,
   highMidVI: 0.1
}


const DeviceHealthScore = (CollectionSensorHealthScore, num) => MovingAverage(CollectionSensorHealthScore,num)