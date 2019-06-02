from bs4 import BeautifulSoup
from string import ascii_lowercase
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
import pypyodbc
import re

from PIL import Image
import urllib.request
import os


'''
TODO: Better organize how I am scraping this data. 
For now I will try to separate the scraping of the data and how I insert the data into my MSSQL Table.
'''
class Scraper:
    def __init__(self):
        index = ascii_lowercase  #from string module get a str of 'a-z'

        '''Open a connection with the MSSQL Table'''
        #export = Export_MSSQL()

        for i in range(len(index)):
        #Use beautifulsoup to parse and webscrape 
            page_index = requests.get(f'http://www.basketball-reference.com/players/{index[i]}').content
       

            self.scrape_player(page_index)
            

        '''Commit and close the connection to the MSSQL Table'''
        #export.close_connection() 
    '''
    Called by _init_() of class Scraper

    @param BeautifulSoup object that contains a page index ranging from 'a-z'

    @method scrape and separate active players,
    then scrape attributes of every individual active player,
    then send the player information to class Export_MSSQL
    '''
    def scrape_player(self, page_index):

        bs = BeautifulSoup(page_index, 'html5lib')
        player_directory = bs.select('strong a')
        active_players = [] #creates a list of active players, also clears the list for every new index
        
        for player in player_directory:
            active_players.append(player['href'])
            
            

        for i in range(len(active_players)):
            '''
            Create a new request and BeautifulSoup object, request every player\]]
            '''
            player_index = requests.get(f'http://www.basketball-reference.com{active_players[i]}').content
            bs2 = BeautifulSoup(player_index, 'html5lib')

                 #horrible hardcode catch because apparently there are two Tony Mitchell's ugh
            if active_players[i] == "/players/m/mitchto02.html":
                continue
        

            
            href_key = active_players[i]
            
            '''gather all attributes, some need certain modifications to be fully scraped (due to parsing limitations on my part)
            I comment on the side of each attribute what index contains the actual information for the current scraped player'''  
            name = bs2.find('h1', attrs={'itemprop': 'name'})
            pic = bs2.find('img', attrs={'itemscope': 'image'})  #pic['src']
            
            ppg = bs2.find('h4', string='PTS').find_next_siblings('p') #[0]
            rpg = bs2.find('h4', string='TRB').find_next_siblings('p') #[0]
            apg = bs2.find('h4', string='AST').find_next_siblings('p') #[0]
            team = bs2.find_all(href=re.compile('team'))  #[1]
            per = bs2.find('h4', string='PER').find_next_siblings('p') #0


            Export_MSSQL.submit_to_sql( href_key, team[1].text.strip(), name.text.strip(),  pic['src'],  ppg[0].text.strip(), rpg[0].text.strip(), apg[0].text.strip(), per[0].text.strip() )
        

            print(f'Player {href_key} inserted!')

            '''send information to class MSSQL, where the players href will be the primary key
            TODO: Think of a better way then just sending 8 parameters to the other method,
            maybe a list of some sort.'''





"""
Send the output from class Scraper to this class, then send the data to the MSSQL Table.
"""
class Export_MSSQL:
    def submit_to_sql(id, team, name, pic, ppg, rpg, apg, per):
        #Connect to MSSQL Database using the ODBC driver.
        connection_string ='Driver={ODBC Driver 13 for SQL Server};Server=LAPTOP47;Database=TutorialDB;trusted_connection=yes;'
        connection = pypyodbc.connect(connection_string)

        #Insert into SQL table, just put the table name and this will find wherever it is in the database selected.
        #Put the ?'s in values to indicate we will be inserting into this table.
        SQL = 'SELECT * FROM NBA_TEAM'
        cur = connection.cursor()
        #Not all the values, I wasn't able to scrape Salary and Years Experience from this scrape method.
        #SQLCMD = ("INSERT INTO NBA_TEAM " "(ID, Team, Name, Picture, PPG, RPG, APG, PER)" "VALUES (?,?,?,?,?,?,?,?)")
       
        #TODO: FIX HOW I DO THIS, MAYBE USE CLASS ATTRIBUTES THIS WAY IS UNACCEPTABLE BUT I JUST WANT IT TO WORK NOW
        
        primary_key = name.lower()
        if len(primary_key.split()) < 2:
           primary_key = re.sub("[.,\' -]", '', primary_key) 
        else:
            primary_key = re.sub("[.,\'-]", '', primary_key.split()[1]) +  re.sub("[.,\'-]", '', primary_key.split()[0]) 

        #now make our new picture name and save it locally
        urllib.request.urlretrieve(pic, f".\\nba-trade-machine\\Frontend\\static\\images\\{primary_key}.jpg")
        #get the path of the new saved file, that's the local image that will be inserted into the database until i figure out cloud or some better solution
        pic = os.path.abspath(f"{primary_key}.jpg")
        SQLCMD = f"""UPDATE NBA_TEAM SET Picture='{pic}' WHERE ID='{primary_key}'"""
        print(f"this is what went in {pic} for user {primary_key}")

        """
        id = [primary_key]
        team = [team]
        name = [name]
        pic = [pic]
        ppg = [ppg]
        rpg = [rpg]
        apg = [apg]
        per = [per]
        values = [id,team,name,pic,ppg,rpg,apg,per]
        """
       

        #for values in zip(id,team,name,pic,ppg,rpg,apg,per):
        #    cur.execute(SQLCMD, values)
        cur.execute(SQLCMD)

        cur.commit()
        cur.close()



#run the program
Scraper()