# nba-trade-machine
A program that will allow users to conduct hypothetical trades between teams in the NBA.

Currently working on a raw demo, no distinct timeline yet this is just a fun side project.

Backend goals:

Scrape general information on players [DONE]

Export information to SQL [DONE]

Clean up data and either send the database or a .json file of the data

Find a more reliable scraping method

Sync updating scraper to database

Frontend goals:

Create a functioning home page for the user to select teams for trades [DONE]

Create a working server to connect multiple pages together [DONE]

A generic algorithm that be able to parse through the SQL database or a .json file and create a team roster automatically [WIP]

Implement trade logic

Be able to speak with the backend/database to update automatically when rosters change
