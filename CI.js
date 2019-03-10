import * as stat from "./stat.js";
const CI = (present, data, num) => {
  data = data.slice(-num);
  let factor = 3;
  let upper = stat.Mean(data) + factor * stat.Std(data);
  let lower = stat.Mean(data) - factor * stat.Std(data);
  return (present - lower)/(upper - lower)
}