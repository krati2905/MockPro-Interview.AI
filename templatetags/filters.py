from django import template

register = template.Library()

@register.filter(name='split')
def split(value, key):
    """Splits a string by the given key."""
    if value:
        return value.split(key)
    return []

@register.filter(name='trim')
def trim(value):
    """Removes leading/trailing whitespace."""
    if isinstance(value, str):
        return value.strip()
    return value