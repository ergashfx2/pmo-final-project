
from requests import request


currency_rate = request(url='https://cbu.uz/uz/arkhiv-kursov-valyut/json/',method='GET').json()[0]['Rate']
