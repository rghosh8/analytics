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