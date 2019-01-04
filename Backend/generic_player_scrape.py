from bs4 import BeautifulSoup
import requests
import re
from string import ascii_lowercase
'''Let's grab everything we can about Steph Curry!
all i could get was
name, pic, PER, ppg, rpg, apg (Decided to not put too much data at once so only per season), and team name...

Salary needs to be found else where or relooked later, via salary page.
Might be able to find some way to get contract years under salary page too.

Only real missing issue is the lack of years experience...'''
class Steph:

    def scrape(self):
        page = requests.get('https://www.basketball-reference.com/players/c/curryst01.html').content
        bs = BeautifulSoup(page, 'html5lib')

        pic = bs.find('img', attrs={'itemscope': 'image'})
        print(pic['src'])
        name = bs.find('h1', attrs={'itemprop': 'name'})
        print(name.text.strip())
        
        PER = bs.find('h4', string='PER').find_next_siblings('p')
        ppg = bs.find('h4', string='PTS').find_next_siblings('p')
        rpg = bs.find('h4', string='TRB').find_next_siblings('p')
        apg = bs.find('h4', string='AST').find_next_siblings('p')
        team = bs.find_all(href=re.compile('team'))
        sal = bs.find_all('span', 'class')
        exp = bs.find_all()
        
        print(team[1].text.strip())
        print(PER[0].text.strip())
        print(ppg[0].text.strip())
        print(rpg[0].text.strip())
        print(apg[0].text.strip())



x = Steph()
x.scrape()
