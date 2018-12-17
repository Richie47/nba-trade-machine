from bs4 import BeautifulSoup
import requests
from player_storage import Playerbase


page = requests.get('https://www.basketball-reference.com/contracts/PHO.html').content

bs = BeautifulSoup(page, 'html5lib')

name_box= bs.find_all('th' , attrs={'class' : 'left ' })
sal_box = bs.find_all('td', attrs={'data-stat' : 'y1'})
age_box = bs.find_all('td', attrs={'data-stat' : 'age_today'})

pb = Playerbase()

for i in range(len(age_box)):
    pb.insert(name_box[i].text.strip(), sal_box[i].text.strip()[1:], age_box[i].text.strip())

pb.test_print()

