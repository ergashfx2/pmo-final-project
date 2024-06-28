import uuid

from django import template
from datetime import datetime
from django.utils.translation import gettext as _

register = template.Library()

uzbek_month = {
    1: 'Yanvar',
    2: 'Fevral',
    3: 'Mart',
    4: 'Aprel',
    5: 'May',
    6: 'Iyun',
    7: 'Iyul',
    8: 'Avgust',
    9: 'Sentyabr',
    10: 'Oktyabr',
    11: 'Noyabr',
    12: 'Dekabr',
}

uzbek_month_names = {
    1: _("yanvar"),
    2: _("fevral"),
    3: _("mart"),
    4: _("aprel"),
    5: _("may"),
    6: _("iyun"),
    7: _("iyul"),
    8: _("avgust"),
    9: _("sentabr"),
    10: _("oktabr"),
    11: _("noyabr"),
    12: _("dekabr"),
}

@register.filter
def format_date(value):
    month = uzbek_month[value.month]
    return f"{value.day}-{month} {value.year} yil"

@register.filter
def format_number(value):
    value = str(value)
    val = value.replace(" ","")
    return f"{int(val):,}".replace(",", " ")

@register.filter
def to_int(value):
    return int(value)


@register.filter
def to_str(value):
    print(value)
    return str(value)


@register.simple_tag
def generate_random(value):
    return f"{value}{uuid.uuid4()}"


@register.filter
def generate_random(value):
    return f"{value}{uuid.uuid4()}"


@register.simple_tag
def multiple_args_tag(a, b):
    val1 = int(a.replace(" ",""))
    val2 = int(b.replace(" ",""))
    val3 = val1 - val2
    return f"{int(val3):,}".replace(",", " ")

@register.filter
def uzbek_format(value):
    if isinstance(value, datetime):
        day = value.strftime("%d")
        month = uzbek_month_names.get(value.month, "")
        year = value.strftime("%Y")
        time = value.strftime("%H:%M")
        return f"{day} - {month}, {year}, {time}"
    return value
