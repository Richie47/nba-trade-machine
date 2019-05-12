import pypyodbc #to export to sql database, pip install pypyodbc
from bs4 import BeautifulSoup #pip install beautifulsoup4 ,  dependency: 'pip install html5lib' is used, gathers info
import requests #pip install requests, request the webpage
import re #used for regex
from re import sub #used for regex

'''NOTE: THIS IS ONLY VIABLE FOR HOOPSHYPE AS OF 5/11/19 , AND KENNETH FARIED DOESN'T WORK FOR SOME REASON
AS WELL AS LUC MBAH A MOUTE'''

'''
2ai) we modify the name so that we can get it to be the link we want, then request that url
2aii) Once there we implement the logic we tested earlier, achieving the salary, years, and position.
2aiii) come back to the method that called us above
'''
def info_gatherer(cur_name, primary_key):
    #first create our primary key to match with our database
    primary_key = primary_key.lower()
    if len(primary_key.split()) < 2:
        primary_key = re.sub("[.,\' -]", '', primary_key) 
        primary_key = re.sub("[ê]", 'e', primary_key) 
    else:
        primary_key = re.sub("[ê]", 'e', primary_key)
        primary_key = re.sub("[.,\'-]", '', primary_key.split()[1]) +  re.sub("[.,\'-]", '', primary_key.split()[0]) 

    #use regex to cleanup unwanted characters before processing
    index = re.sub("[.,\']", '', cur_name.lower())
    index = re.sub("[ê]", 'e', index)
    #insert hythens where ever spaces exist to mimic hoopshype's player salary link pages
    index = re.sub("[ ]", "-", index)
    #now request the players page using the modified index
    player_page = requests.get(f"https://hoopshype.com/player/{index}/salary/").content
    bs2 = BeautifulSoup(player_page, "html5lib")
    '''begin gathering data: current salary'''
    salaries = bs2.find_all('td', attrs='table-value')
    #gathering the current salary, also figures out how many teams are currently giving the player salary 
    buffer = 0
    for i in range(len(salaries)):
        if salaries[i].text.strip()[0] == '$':
            break
        else:
            buffer += 1
    #can now get the first instance of the salary, which should always be the current salary
    cur_salary = salaries[buffer].text.strip()
    #use regex to remove currency format of the salary   
    cur_salary =  sub(r'[^\d.]', '', cur_salary)

    '''begin gathering data: contract years remaining'''
    #searching for how many salaries aren't equal to '$0'
    #buffer is used in the event the player has multiple teams giving him salary at the time, we only want the more recent team
    cur_years_left = 0
    for i in range(buffer, len(salaries), buffer): #arg's for range is (start, stop, increment)
            if salaries[i].text.strip() == "$0":
                break
            else:
                cur_years_left += 1
    
    '''begin gathering data: position'''
    cur_position = bs2.find('span', attrs='player-bio-text-line-value') 
    cur_position = cur_position.text.strip()
    '''TODO: here we would continue gathering more stuff in the future if needed'''

    #now with all the information gathered, the next task is to export to the MSSQL Database
    submit_to_sql(primary_key,cur_salary,cur_years_left,cur_position)
'''
new method
here we should take the info as parameters,
1) modify the name to try to make it match the primary key
2) catch nene case and whatever else we find
3) apply and send everything to the sql database
4) find a way to close the connection after, maybe the loop will handle that once everythings done
'''

def submit_to_sql(pk, salary, years_left, position):
    #Connect to MSSQL Database using the ODBC driver.
    connection_string ='Driver={ODBC Driver 13 for SQL Server};Server=LAPTOP47;Database=TutorialDB;trusted_connection=yes;'
    connection = pypyodbc.connect(connection_string)
    cur = connection.cursor()
    #Update request for MSSQL table
    SQLCMD = f"""UPDATE NBA_TEAM SET Salary='{salary}', YearsLeft='{years_left}', Position='{position}'
     WHERE ID='{pk}'"""

    cur.execute(SQLCMD)
    cur.commit()
    print(f"Primary Key {pk} updated.")
    #probably not the best idea to continuously keep closing and reopening the sql base
    cur.close()

'''
First we start the request and gather everyones name once
'''
page = requests.get("https://hoopshype.com/salaries/players/").content
bs = BeautifulSoup(page, "html5lib")

names = bs.find_all('td', attrs='name')

'''
Next we begin a loop of all these players
I think it'd be better to make small functions
1) create two copies of the player's name
2) send to info gatherer
'''

for i in range(1, len(names)):
    cur_name = names[i].text.strip()
    pk = names[i].text.strip()
    info_gatherer(cur_name,pk)

