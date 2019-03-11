# Stat Module

#### Few supporting statistical utilities are computed:

* Size of a time series
* Sum of all the elements in the series
* Mean of the series
* Simple moving average
* n-th order moment
* Variance
* Standard Deviation
* Skewness
* Kurtosis

## [function] Anomaly Detection (`isAnomaly(present, data, num)`)

#### Return if the sensor is anomalous
  
  * Parameters
    * present
      * It represents current sensor value
    * data
      * Data represent time series data
    * num
      * num respresnt the time window
  * Return
    * An object
      * true/false: a boolean representing if the sensor is anomalous
      * message which gives the context of the outcome

#### Comment

* Case 1: Standard deviation is zero, but Mean is not equal to the present data
  * A sudden change in the sensor value. 

* Case 2: Skewness < 0 && Kurtosis > 0
  * It means the data has a long left tail, possible liklihood of cybersecurity issues
  * Test
    * present < Mean(data) - factor * Std(data)
        * factor = 1.5
        * We have to be little defensive here
      
* Case 3: Kurtosis > 0
  * It means the data has long tail, increasing liklihood of anomaly
  * Test
    * (present > Mean(data) + factor * Std(data)) || (present < Mean(data) - factor * Std(data))
      * factor = 2

* Default
  * Test
    * present > (Mean(data) + factor * Std(data)) || (present < Mean(data) - factor * Std(data))
      * factor = 3 (three sigma)

  
## [function] Volatility Risk Assessment(`VI(data, num)`) 

#### Return the volatility risk of the sensor

* Parameters
    * data
      * It represents rolling window data
    * num
      * It represents rolling window size
  * Return
    * It represents a measure of volatility for the sensor

#### Comment
* Our volatility measure is coefficient of variance
  * Ratio of standard deviation and mean in rolling window

## [function] Compliance Risk Assessment (`CI(present, upper, lower)`) 

#### Return the compliance risk of the sensor

* Parameters
    * present
      * It represents the current sensor value
    * data
      * It represents rolling window data
    * num
      * It represents rolling window size
  * Return
    * It represents a measure of complaince for the sensor

#### Comment
* Our compliance risk is measured by min-max noramlization
  * CI = (present - lower)/(upper - lower)
    * upper and lower thresholds are not hard coded, rather they are computed on a data-driven rolling window.


## [function] Dynamic Operating Threshold for Sensors (`Thresholds(data, num)`) 

#### Return safety operating margins both for compliance and volatility

* Parameters
    * data
      * It represents rolling window data
    * num
      * It represents rolling window size
  * Return
    * It represents a list of two objects: marginCI and marginVI
      * marginCI represents safety margin for compliance, including:
        * lowWarning: Mean(data) - (factorCI * warningToAlarm) * Std(data)
        * lowAlarm: Mean(data) - (factorCI) * Std(data)
        * highWarning: Mean(data) + (factorCI * warningToAlarm) * Std(data)
        * highAlarm: Mean(data) + (factorCI) * Std(data)
          * factorCI parametrizes the burstiness of the data for compliance risk:
            * Kurt(data) < 0 ?  factorCI = 3: factorCI = 2;

      * marginVI represents safety margin for volatility, including: 
        * warning: 0.1 * factorVI
        * alarm: 0.2 * factorVI
          * factorVI parametrizes the burstiness of the data for volality risk:
            * Kurt(data) < 0 ?  factorVI = 1: factorVI = 0.75



##  [function] Sensor Health Score (`SensorHealthScore(CI, VI, thresholds, alpha)`)

#### Return the score that commbines overall sensor health, including compliance and volatility risks

* Parameters
    * CI
      * It represents the compliance risk
    * VI
      * It represents the volatility risk
  
    * alpha
      * Relative importance of compliance risk over volatility risk
    * data
      * It represents rolling window data
    * num
      * It represents rolling window size

  * Return
    * It represents a health score for the device

#### Comment
* Twelve different scenarios are considered to determine the sensor health score

###### Cases where CI and VI are undefined
  * Case 1: Both CI and VI are UNDEFINED
    * score: null
    * message: alpha must be between 0 (inclusive) and 1 (inclusive)

  * Case 2: Only VI is UNDEFINED
    * score: CI
    * message: volatility risk is not defined
  
  * Case 3: Only CI is UNDEFINED
    * score: VI
    * message: compliance risk is not defined

###### Cases where alarms are breached
  * Case 4: CI < lowAlarm
    * score: 0
    * message: lower threshold breached

  * Case 5: CI > highAlarm
    * score: 0
    * message: upper threshold breached

  * Case 6: VI > alarm
    * score: 0
    * message: volatility margin breached

###### Cases where both warnings are violated
  * Case 7: CI < lowWarning AND VI > warning
    * score: 0 
    * message: high volatility near lower threshold

  * Case 8: CI > highWarning AND VI > warning
    * score: 0 
    * message: high volatility near upper threshold

###### Cases where only one warning is violated

  * Case 9: CI < lowWarning 
    * score: (CI - marginCI.lowAlarm)/(marginCI.lowWarning - marginCI.lowAlarm)
    * message: operating near lower threshold
  
  * Case 10: CI > highWarning
    * score: (marginCI.highAlarm - CI)/(marginCI.highAlarm - marginCI.highWarning)
    * message: operating near upper threshold
  
  * Case 11: VI > warning
    * score: (marginVI.alarm- VI)/(marginVI.alarm - marginVI.warning) 
    * message: operating with high volatility

  * Default:
    * score: alpha * complianceRisk  + (1 - alpha) * complianceRisk
      * complianceRisk = (CI - marginCI.lowWarning)/(marginCI.highWarning - marginCI.lowWarning)
      * volatilityRisk = (marginVI.alarm - VI)/(marginVI.alarm - marginVI.warning)
    * message: healthy sensor
  

##  [function] Device Health Score (`DeviceHealthScore(id, num)`)

#### Return the score that commbines all sensor health, including compliance and volatility risks 

* Parameters
    * id
      * Device Id

    * num
      * It represents rolling window size

  * Return
    * It represents a marco health score for the device

#### Comment
* Device-SensorHealthScore maps maps device ids to sensor health scores
* It returns SMA over the specified rolling window

