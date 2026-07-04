from jinja2 import Environment, FileSystemLoader

# autoescape on — output is HTML-escaped. VC192 must NOT fire.
env = Environment(loader=FileSystemLoader("templates"), autoescape=True)
