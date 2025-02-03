// Centralized JavaScript Code

function convertTemperature() {
    // Descriptive variable names
    let temperatureInput = document.getElementById('temperatureInput').value;
    let conversionType = document.getElementById('conversionType').value;
    let convertedTemperature;
    let resultMessage;

    // Convert input to integer
    let temperature = parseFloat(temperatureInput);

    // Decision making with if-else
    if (!isNaN(temperature)) {
        // Logical operator example
        if (conversionType === 'toCelsius') {
            // Mathematical operation (Fahrenheit to Celsius)
            convertedTemperature = (temperature - 32) * (5 / 9);
            resultMessage = `${temperature}°F is ${convertedTemperature.toFixed(2)}°C`;
        } else if (conversionType === 'toFahrenheit') {
            // Mathematical operation (Celsius to Fahrenheit)
            convertedTemperature = (temperature * (9 / 5)) + 32;
            resultMessage = `${temperature}°C is ${convertedTemperature.toFixed(2)}°F`;
        } else {
            resultMessage = "Invalid conversion type selected.";
        }

        // Output to DOM and Console
        document.getElementById('result').textContent = resultMessage;
        console.log(resultMessage);
    } else {
        document.getElementById('result').textContent = "Invalid input. Please enter a number.";
        console.log("Invalid input detected.");
    }
}
