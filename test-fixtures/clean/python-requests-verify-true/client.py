import requests

def fetch(url):
    # TLS verification on (the default, made explicit). VC191 must NOT fire.
    return requests.get(url, timeout=10, verify=True)
