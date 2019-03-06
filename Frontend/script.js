/**
 * this function is responsible for handeling user selection of the teams for the homepage
 */
window.onload = function () {
    var reveal =document.querySelector(".trade-button");
    var teams = document.getElementsByClassName('button'); //teams is all the team selection buttons on the webpage
   
    
    var selectCount = 0; //keep track of team selection logic
    const teamSelectLimit = 4; //set a hard limit of max teams to be selected at one time
    var selectedTeams = [] 
    
    for (team in teams) {
        teams[team].onclick = function () {
            console.log(this.innerText)
            //team is already selected but clicked again, we unselect the team and decrement the select count
            if (this.classList.contains('selected')) {
                selectedTeams.splice(selectedTeams.indexOf(this.innerText), 1)
                this.classList.remove('selected')
                this.style.backgroundColor = "#fff";
                selectCount--;
            }
            //team is selected after the selection limit is reached, for now we just do nothing
            //TODO: Implement a popup box notifying the user that they must unselect one team.
            //TODO: Implement within this popup box a "don't show me this again" checkbox logic
            else if(selectCount >= teamSelectLimit) {
                checkExceededLimit();
            }
           
            //otherwise we select the team and add to our selectCount
            else{
                selectedTeams.push(this.innerText)
                this.style.backgroundColor = "rgb(233,233,233)";
                this.className += ' selected'
                reveal.style.display = "inline"
                selectCount++;
                
            }

            if(selectCount == 0){
                reveal.style.display ="none";
            }
            console.log(selectedTeams)
        };
    }
};

var checkExceededLimit = () => {
        var errorMsg = document.getElementById('error-message');
        errorMsg.innerText = "You have too many Teams selected.\n Please choose four or less\nTODO MAKE THIS A POPUP!";
        };
