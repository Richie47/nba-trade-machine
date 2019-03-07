window.onload = function(){
  var selectCount = 0;
  const teamSelectLimit = 4;

  $(document).ready(function(){
  
     $('.button').click(function(e){
        e.preventDefault();  //catch something idk just copied this online

        //so if the team was already selected we want to remove the selection
        if(e.currentTarget.classList.contains('selected')){
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
          e.currentTarget.className += ' selected';
           e.currentTarget.style.backgroundColor = "rgb(233,233,233)";
           selectCount++;
           $("#team-trades").prepend($(e.currentTarget).find("img").clone().attr("height", 45).attr("width", 45))
         } 
        });
});
};
