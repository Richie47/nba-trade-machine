from player_storage import Playerbase
from bs4 import BeautifulSoup
import re
import requests

#In the future I'll need to figure out how to call a download of the html page then perform the actions vs
#saving locally! (Imagine having to update manually for all 30 teams ew.)
page = r"C:\Users\Richie\Documents\VSC_Files\suns_dump.html" #put r in front to make a 'raw str' to read path
soup = BeautifulSoup(open(page).read(),'html.parser')

#Simple way to extract names and salaries from the html file
name_box= soup.find_all('th' , attrs={'class' : 'left ' })
sal_box = soup.find_all('td', attrs={'data-stat' : 'y1'})

my_player_base = Playerbase()  #an instance of my 'LinkedList' interpretation

#send all found attributes to create a 'Player' Node then add it to the LinkedList. May have to change this when we have more attributes.
for _ in range(len(sal_box)):
    my_player_base.insert(name_box[_].text.strip(), sal_box[_].text.strip())

my_player_base.test_print() #Just see if this is working properly (Seems like it is)
