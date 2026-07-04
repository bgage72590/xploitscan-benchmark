import yaml

def load_config(text):
    # safe_load disables arbitrary object construction. VC073 must NOT fire.
    return yaml.safe_load(text)
