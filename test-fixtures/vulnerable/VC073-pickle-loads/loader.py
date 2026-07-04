# Unpickling untrusted bytes is a well-known RCE: the pickle stream
# can encode __reduce__ callables that execute on load. VC073 must fire.

import pickle
from flask import request


def load_profile():
    raw = request.get_data()
    # Directly unpickling the request body — attacker-controlled.
    profile = pickle.loads(raw)
    return profile
