import * as stat from "./stat.js";
const isAnomaly = (present, data, num) => {
  data = data.slice(-num)
  if(stat.Std(data) === 0 && stat.Mean(data) !== present){
    return true
  }
  if(stat.Skew(data) < 0 && stat.Kurt(data) > 0){
    let factor = 1.5
    return present < stat.Mean(data) - factor * stat.Std(data);
  }
  if(stat.Kurt(data) > 0){
    let factor = 2
    return (present > stat.Mean(data) + factor * stat.Std(data)) || (present < stat.Mean(data) - factor * stat.Std(data))
  }
  let factor = 3;
  return present > (stat.Mean(data) + factor * stat.Std(data)) || (present < stat.Mean(data) - factor * stat.Std(data))
}