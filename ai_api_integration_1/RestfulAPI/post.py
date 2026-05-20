import requests
import json

# url for POST request
url = 'https://jsonplaceholder.typicode.com/posts'

# Data to send in the post request
data = {
    'title': 'my new post',
    'body': 'this is the body of my new post',
    'userId': 1
}

# Making a POST request
response = requests.post(url, json=data)

# Storing the response (newly created post)
new_post = response.json()

# Fetching existing posts with GET request
get_url = 'https://jsonplaceholder.typicode.com/posts'
get_response = requests.get(get_url)

# Storing the existing posts and appending the new post
posts_data = get_response.json()
posts_data.append(new_post)

# HTML content to display the posts, including the newly added post, formatted nicely
html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width-device-width, initial-scale=1.0">
    <title>POST and GET Request Example</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
        }}
        .existing-posts {{
            margin-bottom: 20px;
        }}
        pre {{
           background-color: #f4f4f4
           passing: 10px;
           border: 1px solid #ddd;
        }}
        .new-post {{
            color: green;
            font-weight: bold;
        }}
    </style>
</head>
<body>

    <h2>POST and GET request Example</h2>
    <div class="existing-posts">
        <h3>Existing Posts:</h3>
        <pre>{json.dumps(posts_data[:-1], indent=4)}</pre>
    </div>

    <div class="new-post">
        <h3>Newly Added Post:</h3>
        <pre>{json.dumps(new_post, indent=4)}</pre>
    </div>

</body>
</html>
"""

# ── Save to file ───────────────────────────────────────────────────────────────

output_file = "post_with_get_method.html"

with open(output_file, "w") as file:
    file.write(html_content)

print("HTML file '{output_file}' created successfully. Open it in your browser to view the posts with the new post.")