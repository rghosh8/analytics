import * as stat from "./stat.js";
const isAnomaly = (present, data, num) => {
  data = data.slice(-num)
  if(stat.Std(data) === 0 && stat.Mean(data) !== present){
    return {isAnomaly: true, message: 'Component Error'}
  }
  if(stat.Skew(data) < 0 && stat.Kurt(data) > 0){
    let factor = 1.5;
    let flag = present < stat.Mean(data) - factor * stat.Std(data);
    return {isAnomaly: flag, message: 'Low Temperature Risk'};
  }
  if(stat.Kurt(data) > 0){
    let factor = 2
    let flag = (present > stat.Mean(data) + factor * stat.Std(data)) || (present < stat.Mean(data) - factor * stat.Std(data));
    return {isAnomaly: flag, message: 'Bursty Workload'};
  }
  let factor = 3;
  let flag = present > (stat.Mean(data) + factor * stat.Std(data)) || (present < stat.Mean(data) - factor * stat.Std(data));
  return {isAnomaly: flag, message: 'Abnormal Operational Characteristics'};
}