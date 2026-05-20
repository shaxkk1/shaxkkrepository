import requests
import json

# URL for DELETE request (deleting post with id=1)
delete_url  = 'https://jsonplaceholder.typicode.com/posts/1'

# Making a DELETE request
delete_response = requests.delete(delete_url)

# Check if the post was deleted (response status 200 or 204 means success)
delete_status = delete_response.status_code

# Fetching existing posts with GET request (after deletion)
get_url = 'https://jsonplaceholder.typicode.com/posts'
get_response = requests.get(get_url)

# Storing the existing posts (Limiting to the first few for a clean UI preview)
posts_data = get_response.json()[:3]

# Quick check to see if post ID 1 still exists in the fetched list
# Note: JSONPlaceholder is a mock API, so the remote server won't *actually* # delete it permanently, but this demonstrates the logic!
post_still_exists = any(post['id'] == 1 for post in posts_data)

# HTML content to display the status code and remaining dataset
html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DELETE Request Example & Status</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            background-color: #fafafa;
            color: #333;
        }}
        h2 {{
            color: #2c3e50;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }}
        .status-card {{
            background-color: #fdf2f2;
            border: 1px solid #f8b4b4;
            border-left: 6px solid #e53e3e;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 20px;
        }}
        .status-success {{
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-left: 6px solid #16a34a;
        }}
        .status-code {{
            font-size: 24px;
            font-weight: bold;
        }}
        pre {{
           background-color: #1e293b;
           color: #f8fafc;
           padding: 15px;
           border-radius: 4px;
           overflow-x: auto;
           font-family: 'Courier New', Courier, monospace;
           font-size: 14px;
        }}
        .info-box {{
            background-color: #f0fdfa;
            border: 1px solid #ccfbf1;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }}
    </style>
</head>
<body>

    <h2>DELETE Request Example & Status</h2>
    
    <div class="status-card {"status-success" if delete_status in [200, 202, 204] else ""}">
        <div class="status-code">HTTP Status Code: {delete_status}</div>
        <p>
            <strong>Result:</strong> { "Resource successfully deleted (or queued for deletion)." if delete_status in [200, 202, 204] else "Failed to delete resource." }
        </p>
    </div>

    <div class="info-box">
        <h3>API Behavior Note:</h3>
        <p>
            The <strong>DELETE</strong> method requests that the origin server delete the resource identified by the Request-URI. 
            Because <em>JSONPlaceholder</em> is a fake fake/mock API, the server will fake the success status code, but the resource <code>/posts/1</code> isn't actually removed from their live database system.
        </p>
    </div>

    <div class="remaining-posts">
        <h3>Sample Dataset from Registry Index:</h3>
        <pre>{json.dumps(posts_data, indent=4)}</pre>
    </div>

</body>
</html>
"""

# Save the HTML content to a file
output_file = "delete_status.html"

with open(output_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"✓ HTML file '{output_file}' created. Open it in your browser.")