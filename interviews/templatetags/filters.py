from django import template

register = template.Library()

@register.filter
def split(value, arg):
    """Split a string by a delimiter."""
    return value.split(arg)

@register.filter
def trim(value):
    """Trim whitespace from a string."""
    return value.strip()