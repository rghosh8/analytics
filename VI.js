import * as stat from "./stat.js";
const VI = (data, num) => {
  data = data.slice(-num)
  return stat.Std(data)/stat.Mean(data)
}