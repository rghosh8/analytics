export const Len = (data) => data.length

export const Sum = (data) => data.reduce((acc, curr) => acc + curr);

export const Mean = (data) => Sum(data)/Len(data)
 
export const SMA = (data, num) => Sum(data.slice(-num))/Len(data.slice(-num))

export const  nStatMoment = (data, n) => data.map(element => Math.pow((element - Mean(data)), n)).reduce((acc, curr) => acc + curr);

export const Variance = (data) => nStatMoment(data, 2)/(Len(data) - 1)

export const Std = (data) => Math.sqrt(Variance(data))

export const Skew = (data) => nStatMoment(data, 3)/Math.pow(Std(inputData), 3)/Len(data)

export const Kurt = (data) => nStatMoment(data, 4)/Math.pow(Std(data), 4)/Len(data) - 3

