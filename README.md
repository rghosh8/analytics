# stat

#### This document aims to explain basicParameters.js, which includes basic statistical utilities

#### First few basic statistical parameters are computed:

* Size of a time series
* Sum of all the elements in the series
* Mean of the series
* Simple moving average
* n-th order moment
* Variance
* Standard Deviation
* Skewness
* Kurtosis

## Anomaly Detection (**isAnomaly(present, data, num)**)

#### Return if the sensor is anomalous
  
  * Parameters
    * present
      * It represents current sensor value
    * data
      * Data represent time series data
    * num
      * num respresnt the time window
  * Return
    * true/false: a boolean representing if the sensor is anomalous

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

  
## Volatility Risk (**VI(data, num)**) Assessment

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

## Compliance Risk (**VI(present, upper, lower)**) Assessment

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

## Overall Sensor Health (**SensorHealthScore(CI, VI, thresholds, alpha)**) Assessment

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
  * Case 1: Both CI and VI are defined
    * Score: null
    



 

