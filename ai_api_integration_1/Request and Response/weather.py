import requests

# API Key from OpenWeatherApp
api_key = "203e9e4bfebf9102b8dc87c90491d13c" # Replace this with your API key
city = "New York" # You can change this into any city

# API endpoint 
url = f"http://api.opeweatherapp.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

# Make a request to the Weather API
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()
    weather_description = data['weather'][0]['description']
    temperature = data['main']['temp']
else:
    print(f"Failed to fetch data: {response.status_code} - {response.text}")
    weather_description = "Error fetching weather data."
    temperature = "N/A"

# Create a basic HTML file to display the weather information
html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-dith, initial-scale=1.0">
    <title>Weather Information</title>
    <style>
        body {{
            font-family: Arial, sans-serif
            margin: 40px;
        }}
        h1 {{
            color: #333;
        }}
        p {{
            font-size: 18px;
        }}
    </style>
</head>
<body>
    <h1>Weather in {city}</h1>
    <p>Weather: {weather_description}</p>
    <p>Temperatuere: {temperature}</p>
</body>
</html>
"""

# Save the HTML content to a file
with open("weather.html", "w") as file:
    file.write(html_content)

print("HTML file 'weather.html' created successfully. Open it in your browser to view the weather information.")