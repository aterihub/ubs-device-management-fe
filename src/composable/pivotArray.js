
export default function pivotArray(data) {
    const measurements = Object.values(data)
    // Combine measurements into one array
    const combinedData = measurements.reduce((acc, measurement) => {
        return acc.concat(measurement);
    }, []);

    // Create a dictionary to store the pivoted data
    const pivotedData = {};

    // Iterate through the combined data and pivot it
    combinedData.forEach(item => {
        const { _time, _measurement, _value } = item;
        if (!pivotedData[_time]) {
            pivotedData[_time] = {};
        }
        pivotedData[_time][_measurement] = _value;
    });

    // Convert the pivoted data into an array of objects
    const pivotedArray = Object.keys(pivotedData).map(_time => {
        return {
            _time,
            ...pivotedData[_time]
        };
    });

    const changePivot = pivotedArray.map(x => {
        return {
            _time: x._time,
            rpm: x.ch1A,
            runMesin: x.ch1B,
            outputBarang: x.ch2A,
            inputBarang: x.ch3A,
        }
    })
    return changePivot
}

