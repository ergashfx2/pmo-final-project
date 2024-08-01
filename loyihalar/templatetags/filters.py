import uuid

from django import template
from datetime import datetime
from django.utils.translation import gettext as _
from datetime import datetime
from loyihalar.views import file_extensions
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
    try:
        float_value = float(value)
        return f"{float_value:,.2f}".replace(",", ",").replace(".00", "")
    except ValueError:
        return value


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
    try:
        val1 = float(a.replace(" ", ""))
        val2 = float(b.replace(" ", ""))
        val3 = val1 - val2
        return f"{val3:,.2f}".replace(",", ",").replace(".00", "")
    except ValueError:
        return "Invalid Input"


@register.filter
def uzbek_format(value):
    if isinstance(value, datetime):
        day = value.strftime("%d")
        month = uzbek_month_names.get(value.month, "")
        year = value.strftime("%Y")
        time = value.strftime("%H:%M")
        return f"{day} - {month}, {year}, {time}"
    return value


@register.filter
def get_extension(value):
    return file_extensions[str(value).split('.')[-1]]


@register.filter
def format_date_and_time_difference(date_string):
    input_date = datetime.strptime(str(date_string), "%Y-%m-%d %H:%M:%S.%f")
    now = datetime.now()

    year = input_date.year
    month = str(input_date.month).zfill(2)
    day = str(input_date.day).zfill(2)

    diff = now - input_date
    diff_seconds = int(diff.total_seconds())
    diff_minutes = diff_seconds // 60
    diff_hours = diff_minutes // 60
    diff_days = diff_hours // 24
    diff_weeks = diff_days // 7
    diff_months = diff_days // 30
    diff_years = diff_days // 365

    if diff_years > 0:
        time_ago = f"{diff_years} yil{'' if diff_years == 1 else ''} oldin"
    elif diff_months > 0:
        time_ago = f"{diff_months} oy{'' if diff_months == 1 else ''} oldin"
    elif diff_weeks > 0:
        time_ago = f"{diff_weeks} hafta{'' if diff_weeks == 1 else ''} oldin"
    elif diff_days > 0:
        time_ago = f"{diff_days} kun{'' if diff_days == 1 else ''} oldin"
    elif diff_hours > 0:
        time_ago = f"{diff_hours} soat{'' if diff_hours == 1 else ''} oldin"
    else:
        time_ago = f"{diff_minutes} daqiqa{'' if diff_minutes == 1 else ''} oldin"

    formatted_date = f"{year}-{month}-{day}T{input_date.strftime('%H:%M:%S')}"
    return time_ago
