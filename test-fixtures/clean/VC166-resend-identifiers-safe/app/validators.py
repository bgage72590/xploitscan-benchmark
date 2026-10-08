"""Input validation for the signup form. The compiled patterns use an re_
prefix. VC166 must NOT fire.
"""
import re

re_email_address_pattern = re.compile(r"^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$")
re_display_name_allowed = re.compile(r"^[\w .'-]{1,64}$")


def is_valid_email(value: str) -> bool:
    return bool(re_email_address_pattern.match(value.strip()))


def is_valid_display_name(value: str) -> bool:
    return bool(re_display_name_allowed.match(value))
