# Jinja2 Environment with autoescape=False — every render() is an XSS sink.
# VC192 must fire.
from jinja2 import Environment, FileSystemLoader


# Initialize template engine for the email-rendering subsystem.
env = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=False,
)


def render_welcome(user_name: str) -> str:
    template = env.get_template("welcome.html")
    return template.render(name=user_name)
