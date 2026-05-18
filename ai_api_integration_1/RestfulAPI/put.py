import requests
import json

# ── GET the original post (before update) ─────────────────────────────────────

url = "https://jsonplaceholder.typicode.com/posts/1"

original_post = None
get_error = None

try:
    get_response = requests.get(url, timeout=10)
    get_response.raise_for_status()
    original_post = get_response.json()
    print(f"✓ GET successful — fetched original post ID: {original_post.get('id')}")
except requests.exceptions.ConnectionError:
    get_error = "Could not connect to API."
    print(f"⚠️  GET failed: {get_error}")
except requests.exceptions.Timeout:
    get_error = "GET request timed out."
    print(f"⚠️  GET failed: {get_error}")
except requests.exceptions.RequestException as e:
    get_error = str(e)
    print(f"⚠️  GET failed: {get_error}")

# ── PUT request (update the post) ─────────────────────────────────────────────

updated_data = {
    "id": 1,
    "title": "Updated Post Title",
    "body": "This is the updated body of the post.",
    "userId": 1,
}

updated_post = None
put_error = None

try:
    put_response = requests.put(url, json=updated_data, timeout=10)
    put_response.raise_for_status()
    updated_post = put_response.json()
    print(f"✓ PUT successful — updated post ID: {updated_post.get('id')}")
except requests.exceptions.ConnectionError:
    put_error = "Could not connect to API."
    print(f"⚠️  PUT failed: {put_error}")
except requests.exceptions.Timeout:
    put_error = "PUT request timed out."
    print(f"⚠️  PUT failed: {put_error}")
except requests.exceptions.RequestException as e:
    put_error = str(e)
    print(f"⚠️  PUT failed: {put_error}")

# ── Build field-level diff for analysis ───────────────────────────────────────

def build_diff(original, updated):
    """Return a list of {field, before, after, changed} dicts."""
    if not original or not updated:
        return []
    all_keys = sorted(set(list(original.keys()) + list(updated.keys())))
    result = []
    for key in all_keys:
        before = original.get(key, "—")
        after  = updated.get(key, "—")
        result.append({
            "field":   key,
            "before":  before,
            "after":   after,
            "changed": before != after,
        })
    return result

diff = build_diff(original_post, updated_post)
diff_json        = json.dumps(diff, indent=2)
original_json    = json.dumps(original_post, indent=2) if original_post else "null"
updated_json     = json.dumps(updated_post,  indent=2) if updated_post  else "null"

# ── Generate HTML ──────────────────────────────────────────────────────────────

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PUT Request Example with Analysis</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f4f6fb;
            color: #1a1a2e;
            padding: 40px 20px;
        }}

        .container {{ max-width: 860px; margin: 0 auto; }}

        h2 {{ font-size: 24px; font-weight: 700; margin-bottom: 6px; }}

        .subtitle {{
            font-size: 14px;
            color: #64748b;
            margin-bottom: 32px;
        }}

        /* ── Tabs ── */
        .tabs {{ display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }}

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
        .tab-btn.active {{
            background: #1d4ed8;
            color: #fff;
            border-color: #1d4ed8;
            box-shadow: 0 3px 10px rgba(29,78,216,0.28);
        }}

        /* ── Panels ── */
        .panel {{ display: none; }}
        .panel.active {{ display: block; }}

        /* ── Badge ── */
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
        .badge.warning  {{ background: #fef9c3; color: #854d0e; }}
        .badge.error    {{ background: #fee2e2; color: #dc2626; }}
        .badge.info     {{ background: #dbeafe; color: #1d4ed8; }}

        /* ── Post card ── */
        .post-card {{
            background: #fff;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px 24px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.05);
            animation: fadeIn 0.25s ease forwards;
            opacity: 0;
        }}

        .post-card.original {{ border-color: #fbbf24; background: #fffbeb; }}
        .post-card.updated  {{ border-color: #22c55e; background: #f0fdf4; }}

        @keyframes fadeIn {{
            from {{ opacity: 0; transform: translateY(6px); }}
            to   {{ opacity: 1; transform: translateY(0); }}
        }}

        .post-label {{
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            margin-bottom: 10px;
        }}
        .post-card.original .post-label {{ color: #b45309; }}
        .post-card.updated  .post-label {{ color: #15803d; }}

        .post-title {{
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 8px;
        }}

        .post-body  {{ font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 10px; }}

        .user-tag {{
            display: inline-block;
            font-size: 11px;
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
            padding: 2px 9px;
            border-radius: 99px;
        }}

        /* ── Side-by-side layout ── */
        .side-by-side {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }}

        @media (max-width: 600px) {{ .side-by-side {{ grid-template-columns: 1fr; }} }}

        /* ── Analysis / diff table ── */
        .diff-table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }}

        .diff-table th {{
            background: #1d4ed8;
            color: #fff;
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
        }}

        .diff-table td {{
            padding: 11px 16px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
            vertical-align: top;
        }}

        .diff-table tr:last-child td {{ border-bottom: none; }}

        .field-name {{ font-weight: 700; color: #1a1a2e; }}
        .changed-row td {{ background: #fefce8; }}

        .value-before {{ color: #b45309; }}
        .value-after  {{ color: #15803d; font-weight: 600; }}
        .value-same   {{ color: #64748b; }}

        .changed-pill {{
            display: inline-block;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 99px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }}
        .changed-pill.yes {{ background: #fef9c3; color: #854d0e; }}
        .changed-pill.no  {{ background: #f1f5f9; color: #64748b; }}

        /* ── Summary cards ── */
        .summary-strip {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 24px;
        }}

        .summary-card {{
            background: #fff;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }}

        .summary-number {{ font-size: 28px; font-weight: 800; }}
        .summary-label  {{ font-size: 12px; color: #64748b; margin-top: 4px; }}
        .summary-card.changed .summary-number {{ color: #b45309; }}
        .summary-card.total   .summary-number {{ color: #1d4ed8; }}
        .summary-card.same    .summary-number {{ color: #15803d; }}

        /* ── Raw JSON ── */
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

        /* ── Error box ── */
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
        <h2>PUT Request Example with Analysis</h2>
        <p class="subtitle">
            Fetches post #1 via GET, updates it via PUT, then shows
            a field-by-field diff of what changed.
        </p>

        <!-- ── Tabs ── -->
        <div class="tabs">
            <button class="tab-btn active" onclick="showTab('original', this)">
                📄 Original Post (GET)
            </button>
            <button class="tab-btn" onclick="showTab('updated', this)">
                ✏️ Updated Post (PUT)
            </button>
            <button class="tab-btn" onclick="showTab('compare', this)">
                🔄 Side-by-Side
            </button>
            <button class="tab-btn" onclick="showTab('analysis', this)">
                🔍 Analysis
            </button>
        </div>

        <!-- ── Panel: Original ── -->
        <div id="panel-original" class="panel active">
            {"<span class='badge success'>GET 200 OK</span>" if original_post else f"<span class='badge error'>GET Failed</span>"}
            {"<p class='error-box'>⚠️ " + str(get_error) + "</p>" if get_error else f"""
            <div class='post-card original'>
                <div class='post-label'>📄 Original — Before PUT</div>
                <div class='post-title'>{original_post.get('title', '—')}</div>
                <div class='post-body'>{original_post.get('body', '—')}</div>
                <span class='user-tag'>User #{original_post.get('userId', '—')} · Post #{original_post.get('id', '—')}</span>
            </div>
            <button class='raw-toggle' onclick='toggleRaw("rawOriginal", this)'>Show raw JSON</button>
            <pre class='raw' id='rawOriginal'>{original_json}</pre>
            """}
        </div>

        <!-- ── Panel: Updated ── -->
        <div id="panel-updated" class="panel">
            {"<span class='badge success'>PUT 200 OK</span>" if updated_post else f"<span class='badge error'>PUT Failed</span>"}
            {"<p class='error-box'>⚠️ " + str(put_error) + "</p>" if put_error else f"""
            <div class='post-card updated'>
                <div class='post-label'>✏️ Updated — After PUT</div>
                <div class='post-title'>{updated_post.get('title', '—')}</div>
                <div class='post-body'>{updated_post.get('body', '—')}</div>
                <span class='user-tag'>User #{updated_post.get('userId', '—')} · Post #{updated_post.get('id', '—')}</span>
            </div>
            <button class='raw-toggle' onclick='toggleRaw("rawUpdated", this)'>Show raw JSON</button>
            <pre class='raw' id='rawUpdated'>{updated_json}</pre>
            """}
        </div>

        <!-- ── Panel: Side-by-side ── -->
        <div id="panel-compare" class="panel">
            <span class="badge info">Before vs After</span>
            <div class="side-by-side">
                {"<p class='error-box'>⚠️ " + str(get_error) + "</p>" if get_error else f"""
                <div class='post-card original' style='animation-delay:0ms'>
                    <div class='post-label'>📄 Before (GET)</div>
                    <div class='post-title'>{original_post.get('title', '—')}</div>
                    <div class='post-body'>{original_post.get('body', '—')}</div>
                    <span class='user-tag'>Post #{original_post.get('id', '—')}</span>
                </div>
                """}
                {"<p class='error-box'>⚠️ " + str(put_error) + "</p>" if put_error else f"""
                <div class='post-card updated' style='animation-delay:80ms'>
                    <div class='post-label'>✏️ After (PUT)</div>
                    <div class='post-title'>{updated_post.get('title', '—')}</div>
                    <div class='post-body'>{updated_post.get('body', '—')}</div>
                    <span class='user-tag'>Post #{updated_post.get('id', '—')}</span>
                </div>
                """}
            </div>
        </div>

        <!-- ── Panel: Analysis ── -->
        <div id="panel-analysis" class="panel">
            <span class="badge info">Field-level diff</span>
            <div class="summary-strip" id="summaryStrip"></div>
            <table class="diff-table">
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Before (GET)</th>
                        <th>After (PUT)</th>
                        <th>Changed?</th>
                    </tr>
                </thead>
                <tbody id="diffBody"></tbody>
            </table>
            <button class="raw-toggle" onclick="toggleRaw('rawDiff', this)">Show raw diff JSON</button>
            <pre class="raw" id="rawDiff">{diff_json}</pre>
        </div>
    </div>

    <script>
        const diffData = {diff_json};

        // ── Build analysis table ──────────────────────────────────────────────
        const tbody = document.getElementById("diffBody");
        let changedCount = 0;

        diffData.forEach(row => {{
            if (row.changed) changedCount++;
            const tr = document.createElement("tr");
            if (row.changed) tr.className = "changed-row";
            tr.innerHTML = `
                <td class="field-name">${{row.field}}</td>
                <td class="${{row.changed ? 'value-before' : 'value-same'}}">${{row.before}}</td>
                <td class="${{row.changed ? 'value-after'  : 'value-same'}}">${{row.after}}</td>
                <td>
                    <span class="changed-pill ${{row.changed ? 'yes' : 'no'}}">
                        ${{row.changed ? '✓ Yes' : '— No'}}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        }});

        // ── Summary strip ─────────────────────────────────────────────────────
        const strip = document.getElementById("summaryStrip");
        const total = diffData.length;
        const same  = total - changedCount;

        [
            {{ label: "Total Fields",    value: total,        cls: "total"   }},
            {{ label: "Fields Changed",  value: changedCount, cls: "changed" }},
            {{ label: "Unchanged",       value: same,         cls: "same"    }},
        ].forEach(s => {{
            const card = document.createElement("div");
            card.className = `summary-card ${{s.cls}}`;
            card.innerHTML = `
                <div class="summary-number">${{s.value}}</div>
                <div class="summary-label">${{s.label}}</div>
            `;
            strip.appendChild(card);
        }});

        // ── Tab switching ─────────────────────────────────────────────────────
        function showTab(name, btn) {{
            document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.getElementById("panel-" + name).classList.add("active");
            btn.classList.add("active");
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

output_file = "put_with_analysis.html"

with open(output_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"✓ HTML file '{output_file}' created. Open it in your browser.")