from bs4 import BeautifulSoup
import requests
from player_storage import Playerbase
import pypyodbc


#Connect to MSSQL Database using the ODBC driver.
connection_string ='Driver={ODBC Driver 13 for SQL Server};Server=LAPTOP47;Database=TutorialDB;trusted_connection=yes;'
connection = pypyodbc.connect(connection_string)

#Insert into SQL table, just put the table name and this will find wherever it is in the database selected.
#Put the ?'s in values to indicate we will be inserting into this table.
SQL = 'SELECT * FROM NBA_TEAM'
cur = connection.cursor()
SQLCMD = ("INSERT INTO NBA_TEAM " "(Name, Age, Salary)" "VALUES (?,?,?)")


#Use beautifulsoup to parse and webscrape 
page = requests.get('https://www.basketball-reference.com/contracts/PHO.html').content
bs = BeautifulSoup(page, 'html5lib')


#to find different attributes
name_box= bs.find_all('th' , attrs={'class' : 'left ' })
sal_box = bs.find_all('td', attrs={'data-stat' : 'y1'})
age_box = bs.find_all('td', attrs={'data-stat' : 'age_today'})


#prettify the scraped data so it fits cleanly into the sql table
for i in range(len(age_box)):
    name_box[i] = name_box[i].text.strip()
    sal_box[i] = sal_box[i].text.strip()[1:]
    age_box[i] = age_box[i].text.strip()


#create a list of all the attributes
values = [name_box, age_box, sal_box]

#Use zip to fit everything into values and send to the SQL table
for values in zip(name_box, age_box, sal_box):
    cur.execute(SQLCMD, values)

#Commit the inserts and close the connection
connection.commit()
connection.close()

