jQuery(function ($) {

    //Responsive chat

    $(".gridContact").click(function () {
        $(".gridcontainer").addClass("onChat");
    });

    $("#chatIcon").click(function () {
        $(".gridcontainer").removeClass("onChat");
    }); 

    

    
});








function messageForm(){
  var shiftDown = false;
  var chatForm = $("#new_message");
  var messageBox = chatForm.children("textarea");  
  $(document).keypress(function (e) {      
      console.log(chatForm);
      if(e.keyCode == 13) {
          if(messageBox.is(":focus") && !shiftDown) {
           e.preventDefault(); // prevent another \n from being entered           
           if ( messageBox.text() != "" ) {
             chatForm.submit();      
           }           
      $(chatForm).trigger('reset');
          }
      }
  });
$(document).keydown(function (e) {
      if(e.keyCode == 16) shiftDown = true;
  });
$(document).keyup(function (e) {
      if(e.keyCode == 16) shiftDown = false;
  });
}
