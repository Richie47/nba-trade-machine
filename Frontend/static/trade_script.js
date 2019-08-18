/**
 *GLOBAL VARIABLES BELOW
 */
 //gets the selected teams from the index.html page.
const teamDatabase = JSON.parse(localStorage.getItem('selectedTeams'));
const teamsToCreate = teamDatabase.length ; //account for 0 index, integer of how many teams were selected from index.html

 //set the tables that may get used(depending on # of teams selected), these are what the "roster sheets" are made of
//some of these variables may not be used
const firstTeam = document.querySelector('.playerTable1');
const secondTeam = document.querySelector('.playerTable2');
const thirdTeam = document.querySelector('.playerTable3');
const forthTeam = document.querySelector('.playerTable4');
//keep array, will match the index of the length of team rosters we need to make.
const teamTables = [firstTeam, secondTeam, thirdTeam, forthTeam];
let playerSelected = document.querySelectorAll("[class^='playerTable']");
let tradeBlock = [];

//GLOBAL MAP (KEY = ROSTER TABLE) -> (VALUE = TEAM NAME)
let rosterTeamMap = mapTeamRosterPair(teamDatabase,teamsToCreate,teamTables);

const modal = document.querySelector(".trade-modal");
const closeButton = document.querySelector(".close-button");
try {
closeButton.addEventListener("click", toggleModal);
}
catch(error){
    console.error(error)
}
/*  END OF GLOBAL VARIABLES */

/* GLOBAL PROCESSES BELOW */

//create a key-value pairing of roster tables and team assigned
//@param the array of selected teams from index.html, the length of the selected teams array
//@method we assign each key to be one of the roster table names, and associate the value with the team name it's currently hosting
//@return the map containing a roster-team key-value pair for global use
function mapTeamRosterPair(teamDatabase, teamsToCreate) {
    let rosterTeamMap = new Map();

    for(let i = 0; i < teamsToCreate; i++){
        rosterTeamMap.set(`playerTable${i+1}`, {teamName:teamDatabase[i], tradeBlock:[]});
    }

    return rosterTeamMap;
}

/**
 * @param currentTeam - String of the roster table the trade target came from
 * @method - iterate through the map rosterTeamMap and add all non matching team name value pairs to an array
 * @return Array a string array that contains all the possible teams the target can be traded too.
 */
function findAvailableTeams(currentTeam){
    let availableTeams = [];
    //for every key value pair in the rosterTeamMap
    for(const [key,value] of rosterTeamMap){
       if(key == currentTeam){/**continue to next key if any remain. Not trading the player to the same team.*/}
       //otherwise we add the key's value->teamName into the array
       else{
          availableTeams.push(value.teamName);
       }
    }
    return availableTeams;
}


function addToTradeBlock(team, player,playerSelector){
  for(const [key,value] of rosterTeamMap){
      console.log(value.tradeBlock)
      if(value.teamName == team){
          let tradeBlockSelector = key.substring(key.length-1,key.length);
          value.tradeBlock.push(player);
          document.querySelectorAll(".confirm-trade")[tradeBlockSelector-1].innerHTML =  value.tradeBlock.join("");
          playerSelector.classList.add("tradeSelected");
          toggleModal()
        }
      }
  }

  function removeFromTradeBlock(team, player, playerSelector){
    for(const [key,value] of rosterTeamMap){

            let tradeBlockSelector = key.substring(key.length-1, key.length);

            value.tradeBlock = value.tradeBlock.filter((currentPlayer) => currentPlayer != player);
            document.querySelectorAll(".confirm-trade")[tradeBlockSelector-1].innerHTML = value.tradeBlock.join("");
            playerSelector.classList.remove('tradeSelected');
        }
    }

/**
 * @param availableTeams - string array containing all potential teams a target can be traded too
 * @method - iterate through availableTeams and grab each team's corresponding logo from logos.json
 * Then we will append the logo onto the trade-modal screen to give users a selection of where to put the traded player.
 */
function showAvailableTeams(availableTeams, player, playerSelector) {
    let tradeModalContent = document.querySelector(".target-teams");
    tradeModalContent.innerHTML = "";

    $.getJSON("./logos.json", teams => {
        for (const newTeam in availableTeams) {
            const teamRoster = teams.filter(team => team.Team.match(availableTeams[newTeam]));
            tradeModalContent.innerHTML += `
          <img class="test2-class" data-team="${availableTeams[newTeam]}" id="team-trade-logo"
           src="${teamRoster[0].Logo}" height="50px" width="55px"/>
    `

            let test = document.querySelectorAll(".test2-class");
            for (let elem of test) {
                elem.addEventListener("click", (evt => {
                    addToTradeBlock(evt.target.dataset.team, player,playerSelector)
                }))

            }
        }
    });
}


//ROSTER TEMPLATE MAKER, go through each team and get the appropriate player data to fill out the table for each team
for(let i = 0; i < teamsToCreate; i++) {
    generateRosterHeader(teamDatabase[i], i );
     //get path to our JSON database. I wanted to not use jQuery but it was just really easy here.
    $.getJSON("./players.json", function (teams) {
        const players = teams.filter(team => team.Team.match(teamDatabase[i]));
        generatePlayerTable(teamTables[i], players);
        generatePlayerTableHead(teamTables[i], players, teamDatabase[i]);
    });
}

for(const tr of playerSelected){
    tr.addEventListener('click', function(e){
        const clickedPlayer = e.path[1].querySelectorAll('td')[0].innerHTML;
        let rosterTableFinder = e.path[4].innerHTML.toString()
        const rosterTable = rosterTableFinder.match(/playerTable.?/g);
        if(e.path[1].classList.contains('tradeSelected')){
            console.log(rosterTable)
            removeFromTradeBlock(rosterTable, clickedPlayer, e.path[1])
           // e.path[1].classList.remove('tradeSelected')
            //tradeBlock = tradeBlock.filter((player) => player != clickedPlayer);
           // document.querySelector(".confirm-trade").innerHTML = tradeBlock.join("");
        }
        else{
            const availableTeams = findAvailableTeams(rosterTable);
            showAvailableTeams(availableTeams, clickedPlayer, e.path[1]);
//            e.path[1].classList.add('tradeSelected');
//            tradeBlock.push(clickedPlayer);
            //document.querySelector(".confirm-trade").innerHTML = tradeBlock.join("");
            toggleModal();
        }

        //demo = demo.substring(0,50)

        //j.log(res.toString())
//        console.log(e.target.parentElement.parentElement.parentElement)
        //console.log(x.replace(/\D/g, ''))  regex for removing currency format on salary
    })
}

const test = document.querySelectorAll(".confirm-trade");
/*END GLOBAL PROCESSES*/

function toggleModal(){
    console.log("togglemodal called")
    modal.classList.toggle("show-modal")
}

//used to take off the currency format of the player's salaries for the trade logic
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
});

//Doesn't use data now, but left it as someday this will be the case, and it doesn't affect anything for this demo.
function generatePlayerTableHead(table, data){
    let thead = table.createTHead();
    let row = thead.insertRow();
    //so here I am only using 3 columns, while the JSON file has a lot more. Meaning if we looped through the JSON file it would have more information
    //then my roster template can handle at the moment!
    // so we're hardcoding in this instance TODO: Implement this with a full JSON file someday.
    const rosterHeaders = ["Player", "Salary", "PER"];

    for(let key in rosterHeaders) {
        let cell = row.insertCell(); //fun fact index -1 will insert at the bottom of the table.
        //an HTML element typically consists of an element and text node. So here we specify the element, and the text (how to bold the player table)
        let header = document.createElement("H3");
        let text = document.createTextNode(rosterHeaders[key]);
        header.appendChild(text);
        cell.appendChild(header);
    }
}

//TODO: When I'm ready to implement more data, I will need to set up my JSON file to contain only what I want to put on the roster.
//for now we're just going to hardcode a few attributes.
function generatePlayerTable(table, data){

    table.innerHTML += data.map(player =>
    `
    <tr>
        <td><img src="${player.Picture}" height="50px" width="40px" <br> ${player.Name} <br> ${player.Position} <br> </td>
        <td>${formatter.format(player.Salary)} </td>
        <td>${player.PER}</td>
    </tr>    
    `).join("")

}

function generateRosterHeader(teamName, index){
    const divs = document.getElementsByClassName("team-salary");
    let rosterHeader =  divs[index];

     $.getJSON("./logos.json", function (teams) {
         const teamRoster= teams.filter(team =>  team.Team.match(teamName));
         rosterHeader.innerHTML += `
          ${teamRoster[0].Team}            
          <img class="team__logo" src="${teamRoster[0].Logo}" height="50px" width="55px" alt="${teamRoster[0].Team}"/>
    `
    });
    $.getJSON("./salary_cap.json", function (teams) {
        const teamSalary = teams.teamSalaries.filter(team => team.Team.match(teamName));
        rosterHeader.innerHTML += ` <br>
        Salary Cap: ${teamSalary[0].Salary_Cap}  Cap Space Available: ${teamSalary[0]["Cap Space"]}`
    });
}

/**TODO: Honestly don't know if this code is needed anymore, decide if we should keep it.
  //event listener for second page
$(document).ready(function(){
    $('.test').click(function(e){
      e.preventDefault();
      //gets the selected teams from the index.html page.
      const chosenTeams= JSON.parse(localStorage.getItem('selectedTeams'));
      //get path to our JSON database
      $.getJSON("./players.json", function(teams){
      let numberOfFoundTeams = teams.filter(team => team.Team.match(chosenTeams[0]));
      console.log("yo" + numberOfFoundTeams);
    });
    });
  });
 **/
