export default {
    averageDensity(array) {
        // Initialize variables to store the sum of values and the count of data points
        let sumRPM = 0
        let sumPowerMesin = 0
        let sumRunMesin = 0
        let sumOutputBarang = 0
        let sumInputBarang = 0
        
        // Iterate through the data array and calculate the sum of values
        array.forEach(item => {
            sumRPM += item.RPM
            sumPowerMesin += item.PowerMesin
            sumRunMesin += item.RunMesin
            sumOutputBarang += item.OutputBarang
            sumInputBarang += item.InputBarang
        })
        // Calculate the average values
        const totalCount = array.length

        const averageData = {
            averageRPM:  (sumRPM / totalCount).toFixed(1),
            averagePowerMesin: (sumPowerMesin / totalCount).toFixed(1),
            averageRunMesin: (sumRunMesin / totalCount).toFixed(1),
            averageOutputBarang: (sumOutputBarang / totalCount).toFixed(1),
            averageInputBarang: (sumInputBarang / totalCount).toFixed(1)
        }
        return averageData
    },
    averageDuplicate(array) {
        // Initialize variables to store the sum of values and the count of data points
        let sumRPM = 0
        let sumPowerMesin = 0
        let sumRunMesin = 0
        let sumOutputBarang = 0
        let sumInputBarang = 0
        
        // Iterate through the data array and calculate the sum of values
        array.forEach(item => {
            sumRPM += item.rpm
            sumPowerMesin += item.powerMesin
            sumRunMesin += item.runMesin
            sumOutputBarang += item.outputBarang
            sumInputBarang += item.inputBarang
        })
        // Calculate the average values
        const totalCount = array.length

        const averageData = {
            averageRPM:  (sumRPM / totalCount).toFixed(1),
            averagePowerMesin: (sumPowerMesin / totalCount).toFixed(1),
            averageRunMesin: (sumRunMesin / totalCount).toFixed(1),
            averageOutputBarang: (sumOutputBarang / totalCount).toFixed(1),
            averageInputBarang: (sumInputBarang / totalCount).toFixed(1)
        }
        return averageData
    },
    averageAirioDensity(array) {
        // Initialize variables to store the sum of values and the count of data points
        let sumRPM = 0
        let sumRunMesin = 0
        let sumOutputBarang = 0
        let sumInputBarang = 0
        
        // Iterate through the data array and calculate the sum of values
        array.forEach(item => {
            sumRPM += item.RPM
            sumRunMesin += item.RunMesin
            sumOutputBarang += item.OutputBarang
            sumInputBarang += item.InputBarang
        })
        // Calculate the average values
        const totalCount = array.length

        const averageData = {
            averageRPM:  (sumRPM / totalCount).toFixed(1),
            averageRunMesin: (sumRunMesin / totalCount).toFixed(1),
            averageOutputBarang: (sumOutputBarang / totalCount).toFixed(1),
            averageInputBarang: (sumInputBarang / totalCount).toFixed(1)
        }
        return averageData
    },
    averageAirioDuplicate(array) {
        // Initialize variables to store the sum of values and the count of data points
        let sumRPM = 0
        let sumRunMesin = 0
        let sumOutputBarang = 0
        let sumInputBarang = 0
        
        // Iterate through the data array and calculate the sum of values
        array.forEach(item => {
            sumRPM += item.rpm
            sumRunMesin += item.runMesin
            sumOutputBarang += item.outputBarang
            sumInputBarang += item.inputBarang
        })
        // Calculate the average values
        const totalCount = array.length

        const averageData = {
            averageRPM:  (sumRPM / totalCount).toFixed(1),
            averageRunMesin: (sumRunMesin / totalCount).toFixed(1),
            averageOutputBarang: (sumOutputBarang / totalCount).toFixed(1),
            averageInputBarang: (sumInputBarang / totalCount).toFixed(1)
        }
        return averageData
    }
}
  
  