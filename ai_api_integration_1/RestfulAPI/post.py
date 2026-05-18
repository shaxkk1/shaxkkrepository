import requests
import json

# ── POST a new post ────────────────────────────────────────────────────────────

post_url = "https://jsonplaceholder.typicode.com/posts"

new_post_data = {
    "title": "My new post",
    "body": "This is the body of my new post",
    "userId": 1,
}

new_post = None
post_error = None

try:
    post_response = requests.post(post_url, json=new_post_data, timeout=10)
    post_response.raise_for_status()
    new_post = post_response.json()
    print(f"✓ POST successful — new post ID: {new_post.get('id')}")
except requests.exceptions.ConnectionError:
    post_error = "Could not connect to API."
    print(f"⚠️  POST failed: {post_error}")
except requests.exceptions.Timeout:
    post_error = "POST request timed out."
    print(f"⚠️  POST failed: {post_error}")
except requests.exceptions.RequestException as e:
    post_error = str(e)
    print(f"⚠️  POST failed: {post_error}")

# ── GET existing posts ─────────────────────────────────────────────────────────

existing_posts = []
get_error = None

try:
    get_response = requests.get(post_url, timeout=10)
    get_response.raise_for_status()
    existing_posts = get_response.json()[:10]   # keep first 10 for display
    print(f"✓ GET successful — fetched {len(existing_posts)} posts")
except requests.exceptions.ConnectionError:
    get_error = "Could not connect to API."
    print(f"⚠️  GET failed: {get_error}")
except requests.exceptions.Timeout:
    get_error = "GET request timed out."
    print(f"⚠️  GET failed: {get_error}")
except requests.exceptions.RequestException as e:
    get_error = str(e)
    print(f"⚠️  GET failed: {get_error}")

# ── Serialise data for embedding in HTML ──────────────────────────────────────

existing_json = json.dumps(existing_posts, indent=2)
new_post_json = json.dumps(new_post, indent=2) if new_post else "null"

# ── Generate HTML ──────────────────────────────────────────────────────────────

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>POST & GET Request Example</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f4f6fb;
            color: #1a1a2e;
            padding: 40px 20px;
        }}

        .container {{
            max-width: 820px;
            margin: 0 auto;
        }}

        h2 {{
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 6px;
        }}

        .subtitle {{
            font-size: 14px;
            color: #64748b;
            margin-bottom: 32px;
        }}

        /* ── Tabs ── */
        .tabs {{
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
        }}

        .tab-btn {{
            padding: 9px 20px;
            border-radius: 8px;
            border: 1.5px solid #e2e8f0;
            background: #fff;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            color: #64748b;
            transition: all 0.18s;
        }}

        .tab-btn:hover  {{ border-color: #93c5fd; color: #1d4ed8; }}
        .tab-btn.active {{ background: #1d4ed8; color: #fff; border-color: #1d4ed8;
                          box-shadow: 0 3px 10px rgba(29,78,216,0.28); }}

        /* ── Panels ── */
        .panel {{ display: none; }}
        .panel.active {{ display: block; }}

        /* ── Status badge ── */
        .badge {{
            display: inline-block;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 99px;
            margin-bottom: 16px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }}

        .badge.success {{ background: #dcfce7; color: #15803d; }}
        .badge.error   {{ background: #fee2e2; color: #dc2626; }}
        .badge.info    {{ background: #dbeafe; color: #1d4ed8; }}

        /* ── Post cards ── */
        .post-list {{
            display: flex;
            flex-direction: column;
            gap: 12px;
        }}

        .post-card {{
            background: #fff;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px 20px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.05);
            animation: fadeIn 0.25s ease forwards;
            opacity: 0;
        }}

        .post-card.new-post-card {{
            border-color: #22c55e;
            background: #f0fdf4;
            box-shadow: 0 2px 12px rgba(34,197,94,0.12);
        }}

        @keyframes fadeIn {{
            from {{ opacity: 0; transform: translateY(6px); }}
            to   {{ opacity: 1; transform: translateY(0); }}
        }}

        .post-id {{
            font-size: 11px;
            font-weight: 700;
            color: #3b82f6;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 5px;
        }}

        .post-card.new-post-card .post-id {{ color: #16a34a; }}

        .post-title {{
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 7px;
            text-transform: capitalize;
        }}

        .post-body {{
            font-size: 13px;
            color: #64748b;
            line-height: 1.6;
        }}

        .user-tag {{
            display: inline-block;
            font-size: 11px;
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
            padding: 2px 8px;
            border-radius: 99px;
            margin-top: 8px;
        }}

        /* ── Raw JSON block ── */
        .raw-toggle {{
            background: none;
            border: none;
            padding: 0;
            box-shadow: none;
            font-size: 13px;
            font-weight: 600;
            color: #3b82f6;
            cursor: pointer;
            text-decoration: underline;
            margin-top: 20px;
            display: block;
        }}

        .raw-toggle:hover {{ color: #1d4ed8; }}

        pre.raw {{
            display: none;
            margin-top: 12px;
            background: #1e293b;
            color: #e2e8f0;
            border-radius: 10px;
            padding: 20px;
            font-size: 13px;
            line-height: 1.6;
            overflow-x: auto;
            white-space: pre;
        }}

        /* ── Comparison table ── */
        .compare-table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }}

        .compare-table th {{
            background: #1d4ed8;
            color: #fff;
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
        }}

        .compare-table td {{
            padding: 11px 16px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
        }}

        .compare-table tr:last-child td {{ border-bottom: none; }}
        .compare-table tr:nth-child(even) td {{ background: #f8fafc; }}

        .compare-table .label {{ font-weight: 600; color: #1a1a2e; width: 140px; }}

        /* ── Error state ── */
        .error-box {{
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 10px;
            padding: 16px 20px;
            font-size: 14px;
            color: #dc2626;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h2>POST &amp; GET Request Example</h2>
        <p class="subtitle">
            Creates a new post via POST, fetches existing posts via GET,
            then displays and compares them side by side.
        </p>

        <!-- ── Tabs ── -->
        <div class="tabs">
            <button class="tab-btn active" onclick="showTab('new-post')">
                ✨ New Post (POST)
            </button>
            <button class="tab-btn" onclick="showTab('existing')">
                📋 Existing Posts (GET)
            </button>
            <button class="tab-btn" onclick="showTab('compare')">
                🔍 Compare
            </button>
        </div>

        <!-- ── Panel: New Post ── -->
        <div id="panel-new-post" class="panel active">
            {"<span class='badge success'>POST 201 Created</span>" if new_post else f"<span class='badge error'>POST Failed</span>"}
            {"<p class='error-box'>⚠️ " + post_error + "</p>" if post_error else f"""
            <div class='post-list'>
                <div class='post-card new-post-card' style='animation-delay:0ms'>
                    <div class='post-id'>Post #{new_post.get('id', '—')} · Just created</div>
                    <div class='post-title'>{new_post.get('title', '')}</div>
                    <div class='post-body'>{new_post.get('body', '')}</div>
                    <span class='user-tag'>User #{new_post.get('userId', '—')}</span>
                </div>
            </div>
            <button class='raw-toggle' onclick='toggleRaw("rawNew", this)'>Show raw JSON</button>
            <pre class='raw' id='rawNew'>{new_post_json}</pre>
            """}
        </div>

        <!-- ── Panel: Existing Posts ── -->
        <div id="panel-existing" class="panel">
            {"<span class='badge info'>" + str(len(existing_posts)) + " posts fetched</span>" if existing_posts else "<span class='badge error'>GET Failed</span>"}
            {"<p class='error-box'>⚠️ " + get_error + "</p>" if get_error else f"""
            <div class='post-list' id='existingList'></div>
            <button class='raw-toggle' onclick='toggleRaw("rawExisting", this)'>Show raw JSON</button>
            <pre class='raw' id='rawExisting'>{existing_json}</pre>
            """}
        </div>

        <!-- ── Panel: Compare ── -->
        <div id="panel-compare" class="panel">
            <span class="badge info">Side-by-side comparison</span>
            <table class="compare-table">
                <thead>
                    <tr>
                        <th class="label">Field</th>
                        <th>Existing Post (first)</th>
                        <th>New Post (POST)</th>
                    </tr>
                </thead>
                <tbody id="compareBody"></tbody>
            </table>
        </div>
    </div>

    <script>
        // ── Data from Python ──────────────────────────────────────────────────
        const existingPosts = {existing_json};
        const newPost       = {new_post_json};

        // ── Render existing post cards ────────────────────────────────────────
        const list = document.getElementById("existingList");
        if (list && existingPosts.length > 0) {{
            existingPosts.forEach((post, i) => {{
                const card = document.createElement("div");
                card.className = "post-card";
                card.style.animationDelay = `${{i * 40}}ms`;
                card.innerHTML = `
                    <div class="post-id">Post #${{post.id}}</div>
                    <div class="post-title">${{post.title}}</div>
                    <div class="post-body">${{post.body}}</div>
                    <span class="user-tag">User #${{post.userId}}</span>
                `;
                list.appendChild(card);
            }});
        }}

        // ── Build comparison table ────────────────────────────────────────────
        const tbody = document.getElementById("compareBody");
        if (tbody && existingPosts.length > 0 && newPost) {{
            const first = existingPosts[0];
            const fields = ["id", "title", "body", "userId"];
            fields.forEach(field => {{
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="label">${{field}}</td>
                    <td>${{first[field] ?? "—"}}</td>
                    <td style="color:#15803d;font-weight:600">${{newPost[field] ?? "—"}}</td>
                `;
                tbody.appendChild(row);
            }});
        }}

        // ── Tab switching ─────────────────────────────────────────────────────
        function showTab(name) {{
            document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.getElementById("panel-" + name).classList.add("active");
            event.target.classList.add("active");
        }}

        // ── Raw JSON toggle ───────────────────────────────────────────────────
        function toggleRaw(id, btn) {{
            const el = document.getElementById(id);
            const visible = el.style.display === "block";
            el.style.display = visible ? "none" : "block";
            btn.textContent  = visible ? "Show raw JSON" : "Hide raw JSON";
        }}
    </script>
</body>
</html>
"""

# ── Save to file ───────────────────────────────────────────────────────────────

output_file = "post_method.html"

with open(output_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"✓ HTML file '{output_file}' created. Open it in your browser.")