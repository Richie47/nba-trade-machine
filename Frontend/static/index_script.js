var selectCount = 0;
var selectedTeams = [];
const teamSelectLimit = 4;
window.onload = function(){


 //code to either catch team selection logic issue or go to the next page
  $(document).ready(function(){
    $('.trade-button').click(function(e){
      e.preventDefault();

      if(selectCount < 2){ 
        alert("You need atleast two teams selected in order to conduct a trade.");
      }
      else{
          window.localStorage.setItem("selectedTeams", JSON.stringify(selectedTeams));
          var href = 'trade.html';
          alert(selectedTeams)
          document.location.href = href; 
          

      }
         });
});
  //code that keeps track of user selected teams
  $(document).ready(function(){
     $('.button').click(function(e){
        e.preventDefault();  //prevent any links from opening since my images are from websites
        //so if the team was already selected we want to remove the selection
        if(e.currentTarget.classList.contains('selected')){
          selectedTeams.splice(selectedTeams.indexOf(this.innerText), 1);
          e.currentTarget.classList.remove('selected'); //remove the selected class
          e.currentTarget.style.backgroundColor = "#fff";
          selectCount--;
        //search the span ID, find the exact text of the image we inserted and remove it
        $("#team-trades").find("img[src='" + $(e.currentTarget).find("img").attr("src") + "']").remove()
         }
         //if the user selects more then 4 teams we tell them this is not valid
         // TODO: make a checkbox on the alert
         else if(selectCount >= teamSelectLimit){
           alert("You can only trade 4 teams maximum!");
         }
         //otherwise we add selected to the button's class and clone the image to the span
         else{ 
           selectedTeams.push(this.innerText);
           e.currentTarget.className += ' selected';
           e.currentTarget.style.backgroundColor = "rgb(233,233,233)";
           selectCount++;
           $("#team-trades").prepend($(e.currentTarget).find("img").clone().attr("height", 45).attr("width", 45))
         } 
         console.log(selectedTeams);
        });
});
};






    
