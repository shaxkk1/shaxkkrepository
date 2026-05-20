import requests
import json
import dicttoxml # This package converts a Python dictionary to XML format
from xml.dom import minidom # Used to pretty-print the XML output

# URL for Gemini's public ticker API
url = 'https://api.gemini.com/v1/pubticker/btcusd'

# Making a GET request to fetch data (response will be in JSON)
response = requests.get(url)
data = response.json() # Parse the response into a Python dictionary

# 1. Displaying data in JSON format
print("--- JSON Format ---")
json_pretty = json.dumps(data, indent=4)
print(json_pretty)
print("\n" + "="*50 + "\n")

# 2. Converting JSON to XML format
# dicttoxml returns bytes, so we decode it to a string
data_xml_bytes = dicttoxml.dicttoxml(data)
xml_string = data_xml_bytes.decode('utf-8')

# Displaying data in XML format
print("--- XML Format ---")
xml_pretty = minidom.parseString(xml_string).toprettyxml(indent="    ")
print(xml_pretty)
print("\n" + "="*50 + "\n")

# HTML content with embedded JSON and XML data
html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gemini BTC/USD Ticker Data</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f4f6f9;
            color: #333;
        }}
        h1 {{
            color: #0066cc;
        }}
        .container {{
            display: flex;
            gap: 20px;
        }}
        .box {{
            flex: 1;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        pre {{
            background-color: #272822;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: 'Courier New', Courier, monospace;
        }}
    </style>
</head>
<body>

    <h1>Gemini BTC/USD Ticker Market Data</h1>
    <p>Data fetched successfully from the Gemini Public API.</p>

    <div class="container">
        <div class="box">
            <h2>JSON Format</h2>
            <pre><code>{json_pretty}</code></pre>
        </div>
        
        <div class="box">
            <h2>XML Format</h2>
            <pre><code>{html.escape(xml_pretty) if 'html' in locals() else xml_pretty.replace('<', '&lt;').replace('>', '&gt;')}</code></pre>
        </div>
    </div>

</body>
</html>
"""

# Optional: Save the HTML output to a file to view in a browser
with open("ticker_data.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("Formatting complete! 'ticker_data.html' has been generated.")