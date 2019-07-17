from bs4 import BeautifulSoup;
import requests;
import json;
from collections import defaultdict #used to have a "list of dictonaries" so I can associate multiple values to one key pair.

#Just a really quick and dirty way to grab the salary cap data for the NBA teams.
#Totally not maintainable, and will hate myself for not doing this right in the first place someday.

def scrape_salary(bs):
	salaries = bs.select(".center")
	salaries_start_index = 8
	team_start_index = 6
	team_salaries = []
	teams = []
	salary_caps = []
	cap_spaces = []

	team_name = bs.select(".xs-hide")
	for i in range(team_start_index, len(team_name), 5):
		teams.append(team_name[i].text.strip())

	for i in range(len(salaries)):
		if '$' in salaries[i].text.strip() or '-' in salaries[i].text.strip():
			team_salaries.append(salaries[i].text.strip())

	for j in range(salaries_start_index, len(team_salaries), 5):
		cap_spaces.append(team_salaries[j])
		salary_caps.append(team_salaries[j-1])

	print(len(cap_spaces))
	print(len(salary_caps))
	print(len(teams))

	json_maker(teams, cap_spaces, salary_caps)

def json_maker(teams, cap_spaces, salary_caps):
	nba_salary_dict =  {}
	nba_salary_dict['teamSalaries'] = []
	for line in range(len(cap_spaces)):
		nba_salary_dict['teamSalaries'].append({
			'Team' : teams[line],
			'Cap Space' : cap_spaces[line],
			'Salary_Cap' : salary_caps[line]
		})

	print(json.dumps(nba_salary_dict))
	with open('salary_cap.json', 'w') as outfile:
		json.dump(nba_salary_dict, outfile)

page = requests.get("https://www.spotrac.com/nba/cap/").content;
bs = BeautifulSoup(page, 'html5lib')
scrape_salary(bs)
