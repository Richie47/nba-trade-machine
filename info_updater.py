import requests
from bs4 import BeautifulSoup
import pypyodbc
import re


#Connect to MSSQL Database using the ODBC driver.
connection_string ='Driver={ODBC Driver 13 for SQL Server};Server=LAPTOP47;Database=TutorialDB;trusted_connection=yes;'
connection = pypyodbc.connect(connection_string)
cur = connection.cursor()

teams = ['TOR', 'MIL', 'IND', 'PHI', 'BOS', 'CHO', 'MIA', 'DET', 'BRK', 'ORL', 'WAS', 'ATL', 'CHI', 'NYK', 'CLE',
'DEN', 'GSW', 'OKC', 'HOU', 'POR', 'LAC', 'LAL', 'SAS', 'SAC', 'MEM', 'UTA', 'DAL', 'MIN', 'NOP', 'PHO']

for i in range(len(teams)):

            
    page = requests.get(f'http://www.basketball-reference.com/contracts/{teams[i]}.html').content
    bs = BeautifulSoup(page, 'html5lib')


    print(f'on {i}')
    #to find different attributes
    name_box= bs.find_all('th' , attrs={'class' : 'left ' })
    sal_box = bs.find_all('td', attrs={'data-stat' : 'y1'})
    age_box = bs.find_all('td', attrs={'data-stat' : 'age_today'})

    print(f'Current team: {teams[i]}')
    print(len(name_box))
    print(len(sal_box))
    print(len(age_box))


    #prettify the scraped data so it fits cleanly into the sql table
    for i in range(len(name_box)):
        name_box[i] = name_box[i].text.strip()
        sal_box[i] = sal_box[i].text.strip()[1:]
        age_box[i] = age_box[i].text.strip()
        player = name_box[i]
        print(player)
        
        print(age_box[i])
        sal_box[i] = sal_box[i].replace(',', '')
        

        SQLCMD = f"""UPDATE NBA_TEAM SET Age ={age_box[i]}, Salary ={sal_box[i]} WHERE Name ={player}"""

        if name_box[i] != 'Team Totals':
            cur.execute(SQLCMD)
            cur.commit()


cur.close()

    

    

    
