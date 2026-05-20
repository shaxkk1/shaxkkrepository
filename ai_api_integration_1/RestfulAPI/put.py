import requests
import json

# URL for PUT request (updating post with id=1)
url = 'https://jsonplaceholder.typicode.com/posts/1'

# Data to send in the PUT request (updating the post)
data = {
    'id': 1,
    'title': 'Updated Post Title',
    'body': 'This is the updated body of the post',
    'userId': 1
}

# Making a PUT request
response = requests.put(url, json=data)

# Storing the response (updated post)
updated_post = response.json()

# Fetching existing posts with GET request
get_url = 'https://jsonplaceholder.typicode.com/posts/1'
get_response = requests.get(get_url)
original_post = get_response.json()

# Storing the existing posts
posts_data = get_response.json()

# Storing the response (updated post)
updated_post = response.json()

# Finding the original post to compare (assuming it's post with id=1)
original_post = next((post for post in posts_data if post['id'] == 1), None)

# HTML content to display the posts, including the updated post and the quick analysis
html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PUT Request Example with Analysis</title>
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
        pre {{
           background-color: #f4f4f4;
           padding: 15px;
           border: 1px solid #ddd;
           border-radius: 4px;
           overflow-x: auto;
        }}
        .flex-container {{
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }}
        .box {{
            flex: 1;
        }}
        .original-post {{
            color: black;
            font-weight: bold;
        }}

        .updated-post {{
            color: green;
            font-weight: bold;
        }}
        .analysis {{
            color: blue;
            font-weight: bold;
            margin-top: 20px;
        }}
    </style>
</head>
<body>

    <h2>PUT Request Example with Analysis</h2>
    <div class="existing-posts">
        <h3>Original Post (Before Update):</h3>
        <pre>{json.dumps(original_post, indent=4)}</pre>
    </div>

    <div class="updated-post">
        <h3>Updates Post (After PUT Request):</h3>
        <pre>{json.dumps(updated_post, indent=4)}</pre>
    </div>

</body>
</html>
"""
# Save the HTML content to a file
with open("put_with_analysis.html", "w") as file:
    file.write(html_content)

print("HTML file 'put_with_analysis.html' created successfully. Open it in your browser to view the post updates and analysis.")