import requests  #Request the page required, dependancy needed for BeautifulSoup
from bs4 import BeautifulSoup  #Used to do webscraping
import pypyodbc  #py -m pip install pypyodbc , used to put the scraped python code into mssql.
import re  #Some attributes require regex to be scraped.


'''
A much less request heavy way to update player information, currently only supports
finding the Name, Age, and Salary.

TODO: Find more attributes to scrape using this method.
'''

#Connect to MSSQL Database using the ODBC driver.
connection_string ='Driver={ODBC Driver 13 for SQL Server};Server=LAPTOP47;Database=TutorialDB;trusted_connection=yes;'
connection = pypyodbc.connect(connection_string)
cur = connection.cursor()

#create a list of teams webpages to iterate through
teams = ['TOR', 'MIL', 'IND', 'PHI', 'BOS', 'CHO', 'MIA', 'DET', 'BRK', 'ORL', 'WAS', 'ATL', 'CHI', 'NYK', 'CLE',
'DEN', 'GSW', 'OKC', 'HOU', 'POR', 'LAC', 'LAL', 'SAS', 'SAC', 'MEM', 'UTA', 'DAL', 'MIN', 'NOP', 'PHO']

for i in range(len(teams)):
    page = requests.get(f'http://www.basketball-reference.com/contracts/{teams[i]}.html').content
    bs = BeautifulSoup(page, 'html5lib')

    #to find different attributes
    name_box= bs.find_all('th' , attrs={'class' : 'left ' })
    sal_box = bs.find_all('td', attrs={'data-stat' : 'y1'})
    age_box = bs.find_all('td', attrs={'data-stat' : 'age_today'})


    #prettify the scraped data so it fits cleanly into the sql table
    for i in range(len(name_box)):
        name_box[i] = name_box[i].text.strip()
        sal_box[i] = sal_box[i].text.strip()[1:]
        age_box[i] = age_box[i].text.strip()
        sal_box[i] = sal_box[i].replace(',', '')  #remove commas as SQL will only accept straight numbers for an INT
        
        #Update request for MSSQL table
        SQLCMD = f"""UPDATE NBA_TEAM SET Age ='{age_box[i]}', Salary ='{sal_box[i]}' WHERE Name='{name_box[i]}'"""

        #NOTE: Temporary fix to prevent players with ' in their name from breaking the request
        #TODO: Figure out why this happens, otherwise I do need to exempt team totals.
        if name_box[i] != 'Team Totals':
            if "'" not in name_box[i]:
                #executes and commits to the MSSQL table
                cur.execute(SQLCMD)
                cur.commit()

#close the connection
cur.close()

    

    

    
