from bs4 import BeautifulSoup
import requests
import pypyodbc
import re

'''
TODO: Better organize how I am scraping this data. 
For now I will try to separate the scraping of the data and how I insert the data into my MSSQL Table.
'''
class Scraper:
    def __init__():
        #Use beautifulsoup to parse and webscrape 
        page = requests.get('https://www.basketball-reference.com/contracts/PHO.html').content
        page1 = requests.get('https://www.basketball-reference.com/players/a').content
        bs = BeautifulSoup(page, 'html5lib')
        bs1 = BeautifulSoup(page1, 'html5lib')
        index = 

    '''Maybe put the scraper here?
    I need to be able to say I want you to start at a, go for the length of filtered <strong> tags, we send that page
    to a new method and a new request. That method should go and parse everything we need within the player's page.
    TODO: Do I want to send that players info right away to sql, or do i want to gather by every letter, then send
    or do i want to send after getting a massive amount of information?
    '''
    def scrape(bs):

test_box = bs1.find_all('strong', href = re.compile("players"))
test_box = bs1.find_all('strong')
print(test_box)

#to find different attributes
name_box= bs.find_all('th' , attrs={'class' : 'left ' })
sal_box = bs.find_all('td', attrs={'data-stat' : 'y1'})
age_box = bs.find_all('td', attrs={'data-stat' : 'age_today'})

pic_box = bs.find_all(href=re.compile("players"))


test_box = bs1.find_all('strong')
l = []
for result in test_box:
    l.append(result.a['href'])

print(l)
href_list = []
for result in pic_box:
    href_list.append(result['href'])

print(href_list[3])

#prettify the scraped data so it fits cleanly into the sql table
for i in range(len(age_box)):
    name_box[i] = name_box[i].text.strip()
    sal_box[i] = sal_box[i].text.strip()[1:]
    age_box[i] = age_box[i].text.strip()
  
#create a list of all the attributes
values = [name_box, age_box, sal_box]
#NOTE: we should figure out how to send this to export mssql method
'''
Send the output from class Scraper to this class, then send the data to the MSSQL Table.
'''
class Export_MSSQL:
    def __init__():
        #Connect to MSSQL Database using the ODBC driver.
        connection_string ='Driver={ODBC Driver 13 for SQL Server};Server=LAPTOP47;Database=TutorialDB;trusted_connection=yes;'
        connection = pypyodbc.connect(connection_string)

        #Insert into SQL table, just put the table name and this will find wherever it is in the database selected.
        #Put the ?'s in values to indicate we will be inserting into this table.
        SQL = 'SELECT * FROM NBA_TEAM'
        cur = connection.cursor()
        SQLCMD = ("INSERT INTO NBA_TEAM " "(Name, Age, Salary)" "VALUES (?,?,?)")

    def submit_to_sql(values):
    #Use zip to fit everything into values and send to the SQL table
        for values in zip(name_box, age_box, sal_box):
            cur.execute(SQLCMD, values)

    
    def close_connection():
        #Commit the inserts and close the connection
        connection.commit()
        connection.close()
