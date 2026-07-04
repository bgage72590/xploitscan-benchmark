from flask import request, render_template_string

def greet():
    name = request.args.get("name")
    # User input rendered as a template string (VC082 — SSTI).
    return render_template_string(f"<h1>Hello {name}</h1>")
