import requests
import json

# ── GET post before deletion (so we can show what was removed) ────────────────

delete_url  = "https://jsonplaceholder.typicode.com/posts/1"
get_all_url = "https://jsonplaceholder.typicode.com/posts"

original_post = None
pre_get_error = None

try:
    pre_response = requests.get(delete_url, timeout=10)
    pre_response.raise_for_status()
    original_post = pre_response.json()
    print(f"✓ GET successful — fetched post ID: {original_post.get('id')}")
except requests.exceptions.ConnectionError:
    pre_get_error = "Could not connect to API."
    print(f"⚠️  Pre-delete GET failed: {pre_get_error}")
except requests.exceptions.Timeout:
    pre_get_error = "Request timed out."
    print(f"⚠️  Pre-delete GET failed: {pre_get_error}")
except requests.exceptions.RequestException as e:
    pre_get_error = str(e)
    print(f"⚠️  Pre-delete GET failed: {pre_get_error}")

# ── DELETE request ─────────────────────────────────────────────────────────────

delete_status  = None
delete_success = False
delete_error   = None

try:
    delete_response = requests.delete(delete_url, timeout=10)
    delete_status   = delete_response.status_code
    # 200 or 204 both indicate successful deletion
    delete_success  = delete_status in (200, 204)
    print(f"{'✓' if delete_success else '⚠️ '} DELETE status: {delete_status} "
          f"({'Success' if delete_success else 'Unexpected status'})")
except requests.exceptions.ConnectionError:
    delete_error = "Could not connect to API."
    print(f"⚠️  DELETE failed: {delete_error}")
except requests.exceptions.Timeout:
    delete_error = "DELETE request timed out."
    print(f"⚠️  DELETE failed: {delete_error}")
except requests.exceptions.RequestException as e:
    delete_error = str(e)
    print(f"⚠️  DELETE failed: {delete_error}")

# ── GET remaining posts (after deletion) ──────────────────────────────────────

remaining_posts = []
post_get_error  = None

try:
    get_response = requests.get(get_all_url, timeout=10)
    get_response.raise_for_status()
    all_posts       = get_response.json()
    remaining_posts = all_posts[:8]   # show first 8 for display
    # Confirm post #1 is no longer in the list
    still_exists = any(p.get("id") == 1 for p in all_posts)
    print(f"✓ GET successful — {len(all_posts)} posts remain")
    print(f"  Post #1 still present: {still_exists} "
          f"({'NOTE: jsonplaceholder does not truly delete' if still_exists else 'Confirmed removed'})")
except requests.exceptions.ConnectionError:
    post_get_error = "Could not connect to API."
    print(f"⚠️  Post-delete GET failed: {post_get_error}")
except requests.exceptions.Timeout:
    post_get_error = "Request timed out."
    print(f"⚠️  Post-delete GET failed: {post_get_error}")
except requests.exceptions.RequestException as e:
    post_get_error = str(e)
    print(f"⚠️  Post-delete GET failed: {post_get_error}")

# ── Serialise for HTML ─────────────────────────────────────────────────────────

original_json  = json.dumps(original_post,  indent=2) if original_post  else "null"
remaining_json = json.dumps(remaining_posts, indent=2) if remaining_posts else "[]"
status_label   = f"{delete_status} {'No Content' if delete_status == 204 else 'OK'}" if delete_status else "—"

# ── Generate HTML ──────────────────────────────────────────────────────────────

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DELETE Request Example</title>
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
        .badge.danger   {{ background: #fee2e2; color: #dc2626; }}
        .badge.warning  {{ background: #fef9c3; color: #854d0e; }}
        .badge.info     {{ background: #dbeafe; color: #1d4ed8; }}

        /* ── Status banner ── */
        .status-banner {{
            border-radius: 14px;
            padding: 24px 28px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 20px;
            animation: fadeIn 0.3s ease forwards;
        }}
        .status-banner.success {{
            background: #f0fdf4;
            border: 1.5px solid #86efac;
        }}
        .status-banner.failure {{
            background: #fef2f2;
            border: 1.5px solid #fca5a5;
        }}

        .status-icon {{ font-size: 40px; flex-shrink: 0; }}

        .status-title {{
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 4px;
        }}
        .status-banner.success .status-title {{ color: #15803d; }}
        .status-banner.failure .status-title {{ color: #dc2626; }}

        .status-detail {{ font-size: 13px; color: #64748b; }}

        .http-code {{
            margin-left: auto;
            font-size: 36px;
            font-weight: 800;
            flex-shrink: 0;
        }}
        .status-banner.success .http-code {{ color: #16a34a; }}
        .status-banner.failure .http-code {{ color: #dc2626; }}

        /* ── Post cards ── */
        @keyframes fadeIn {{
            from {{ opacity: 0; transform: translateY(6px); }}
            to   {{ opacity: 1; transform: translateY(0); }}
        }}

        .post-card {{
            background: #fff;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            padding: 18px 22px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.05);
            animation: fadeIn 0.25s ease forwards;
            opacity: 0;
        }}

        .post-card.deleted {{
            border-color: #f87171;
            background: #fef2f2;
            position: relative;
            opacity: 1;
        }}

        .strikethrough {{
            text-decoration: line-through;
            color: #94a3b8;
        }}

        .deleted-stamp {{
            position: absolute;
            top: 14px;
            right: 16px;
            background: #dc2626;
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 99px;
            text-transform: uppercase;
            letter-spacing: 0.07em;
        }}

        .post-label {{
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            margin-bottom: 8px;
            color: #64748b;
        }}
        .post-card.deleted .post-label {{ color: #dc2626; }}

        .post-title {{
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 7px;
            text-transform: capitalize;
        }}
        .post-body  {{ font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 10px; }}

        .user-tag {{
            display: inline-block;
            font-size: 11px;
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
            padding: 2px 9px;
            border-radius: 99px;
        }}

        .post-list {{ display: flex; flex-direction: column; gap: 12px; }}

        /* ── Timeline ── */
        .timeline {{ display: flex; flex-direction: column; gap: 0; }}

        .timeline-item {{
            display: flex;
            gap: 16px;
            padding-bottom: 28px;
            position: relative;
        }}

        .timeline-item:not(:last-child)::before {{
            content: "";
            position: absolute;
            left: 19px;
            top: 40px;
            bottom: 0;
            width: 2px;
            background: #e2e8f0;
        }}

        .timeline-dot {{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            border: 2px solid #e2e8f0;
            background: #fff;
        }}
        .timeline-dot.blue   {{ border-color: #3b82f6; background: #eff6ff; }}
        .timeline-dot.red    {{ border-color: #ef4444; background: #fef2f2; }}
        .timeline-dot.green  {{ border-color: #22c55e; background: #f0fdf4; }}

        .timeline-content {{ flex: 1; padding-top: 8px; }}

        .timeline-step {{
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            color: #94a3b8;
            margin-bottom: 4px;
        }}

        .timeline-title {{
            font-size: 15px;
            font-weight: 700;
            color: #1a1a2e;
            margin-bottom: 4px;
        }}

        .timeline-desc {{ font-size: 13px; color: #64748b; line-height: 1.6; }}

        .timeline-code {{
            display: inline-block;
            background: #1e293b;
            color: #e2e8f0;
            font-size: 12px;
            padding: 2px 10px;
            border-radius: 6px;
            margin-top: 6px;
            font-family: monospace;
        }}

        /* ── Note box ── */
        .note-box {{
            background: #fffbeb;
            border: 1.5px solid #fbbf24;
            border-radius: 10px;
            padding: 14px 18px;
            font-size: 13px;
            color: #78350f;
            margin-bottom: 20px;
            line-height: 1.6;
        }}

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
        <h2>DELETE Request Example</h2>
        <p class="subtitle">
            Fetches post #1 via GET, deletes it via DELETE, then verifies
            the deletion with another GET request.
        </p>

        <!-- ── Tabs ── -->
        <div class="tabs">
            <button class="tab-btn active" onclick="showTab('status', this)">
                🗑️ Delete Status
            </button>
            <button class="tab-btn" onclick="showTab('before', this)">
                📄 Before (GET)
            </button>
            <button class="tab-btn" onclick="showTab('after', this)">
                📋 After (GET)
            </button>
            <button class="tab-btn" onclick="showTab('timeline', this)">
                🔄 Timeline
            </button>
        </div>

        <!-- ── Panel: Status ── -->
        <div id="panel-status" class="panel active">
            {"<span class='badge success'>DELETE Successful</span>" if delete_success else
             "<span class='badge danger'>DELETE Failed</span>" if delete_error else
             "<span class='badge warning'>Unexpected Status</span>"}

            {"<p class='error-box'>⚠️ " + str(delete_error) + "</p>" if delete_error else f"""
            <div class='status-banner {"success" if delete_success else "failure"}'>
                <div class='status-icon'>{"🗑️" if delete_success else "⚠️"}</div>
                <div>
                    <div class='status-title'>{"Post #1 Successfully Deleted" if delete_success else "Deletion Unsuccessful"}</div>
                    <div class='status-detail'>
                        HTTP {status_label} &nbsp;·&nbsp;
                        {"A 200 or 204 status confirms the resource was deleted." if delete_success
                         else "Unexpected status code returned."}
                    </div>
                </div>
                <div class='http-code'>{delete_status or "—"}</div>
            </div>

            <div class='note-box'>
                💡 <strong>Note:</strong> jsonplaceholder.typicode.com is a mock API.
                It simulates a successful DELETE response but does not actually remove the record.
                A real API would return 200 or 204 and the post would no longer appear in GET requests.
            </div>
            """}
        </div>

        <!-- ── Panel: Before ── -->
        <div id="panel-before" class="panel">
            {"<span class='badge info'>Post before deletion</span>"}
            {"<p class='error-box'>⚠️ " + str(pre_get_error) + "</p>" if pre_get_error else f"""
            <div class='post-card deleted'>
                <div class='deleted-stamp'>Deleted</div>
                <div class='post-label'>📄 Post #1 — Targeted for DELETE</div>
                <div class='post-title strikethrough'>{original_post.get('title', '—')}</div>
                <div class='post-body strikethrough'>{original_post.get('body', '—')}</div>
                <span class='user-tag'>User #{original_post.get('userId', '—')} · Post #{original_post.get('id', '—')}</span>
            </div>
            <button class='raw-toggle' onclick='toggleRaw("rawBefore", this)'>Show raw JSON</button>
            <pre class='raw' id='rawBefore'>{original_json}</pre>
            """}
        </div>

        <!-- ── Panel: After ── -->
        <div id="panel-after" class="panel">
            <span class="badge info">{len(remaining_posts)} posts shown after deletion</span>
            {"<p class='error-box'>⚠️ " + str(post_get_error) + "</p>" if post_get_error else """
            <div class='post-list' id='remainingList'></div>
            <button class='raw-toggle' onclick='toggleRaw("rawAfter", this)'>Show raw JSON</button>
            <pre class='raw' id='rawAfter'></pre>
            """}
        </div>

        <!-- ── Panel: Timeline ── -->
        <div id="panel-timeline" class="panel">
            <span class="badge info">Request sequence</span>
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-dot blue">📄</div>
                    <div class="timeline-content">
                        <div class="timeline-step">Step 1</div>
                        <div class="timeline-title">GET Post #1</div>
                        <div class="timeline-desc">
                            Fetched the original post before deletion to capture its data.
                        </div>
                        <span class="timeline-code">GET /posts/1 → 200 OK</span>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-dot red">🗑️</div>
                    <div class="timeline-content">
                        <div class="timeline-step">Step 2</div>
                        <div class="timeline-title">DELETE Post #1</div>
                        <div class="timeline-desc">
                            Sent DELETE request to remove post #1 from the server.
                        </div>
                        <span class="timeline-code">DELETE /posts/1 → {delete_status or "—"} {status_label}</span>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-dot green">✓</div>
                    <div class="timeline-content">
                        <div class="timeline-step">Step 3</div>
                        <div class="timeline-title">GET All Posts (verification)</div>
                        <div class="timeline-desc">
                            Fetched all posts after deletion to verify the record was removed.
                            {len(remaining_posts)} posts returned.
                        </div>
                        <span class="timeline-code">GET /posts → 200 OK ({len(remaining_posts)} records)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const remainingPosts = {remaining_json};

        // ── Render remaining posts ────────────────────────────────────────────
        const list    = document.getElementById("remainingList");
        const rawPre  = document.getElementById("rawAfter");

        if (list && remainingPosts.length > 0) {{
            if (rawPre) rawPre.textContent = JSON.stringify(remainingPosts, null, 2);

            remainingPosts.forEach((post, i) => {{
                const card = document.createElement("div");
                card.className = "post-card";
                card.style.animationDelay = `${{i * 40}}ms`;
                card.innerHTML = `
                    <div class="post-label">Post #${{post.id}}</div>
                    <div class="post-title">${{post.title}}</div>
                    <div class="post-body">${{post.body}}</div>
                    <span class="user-tag">User #${{post.userId}}</span>
                `;
                list.appendChild(card);
            }});
        }}

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

output_file = "delete.html"

with open(output_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"✓ HTML file '{output_file}' created. Open it in your browser.")