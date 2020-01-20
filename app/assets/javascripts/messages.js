$(document).ready(function () {
  var debouncedInit = debounce(initMessages, 250)

  $(document).on('turbolinks:load', debouncedInit)

  debouncedInit()

  function initMessages () {
    $('#backToConversation').on('click', function () {
      $('#conversationColumn').removeClass('d-none')

      $('#chatColumn').addClass('d-none')
    })
  }

  function debounce (func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  }
})

// jQuery(function ($) {

//     //Responsive chat

//     $(".gridContact").click(function () {
//         $(".gridcontainer").addClass("onChat");
//     });

//     $("#chatIcon").click(function () {
//         $(".gridcontainer").removeClass("onChat");
//     });

// });

// function messageForm(){
//   var shiftDown = false;
//   var chatForm = $("#new_message");
//   var messageBox = chatForm.children("textarea");
//   // $(document).keypress(function (e) {
//   //     if(e.keyCode == 13) {
//   //         if(messageBox.is(":focus") && !shiftDown) {
//   //          e.preventDefault(); // prevent another \n from being entered
//   //          chatForm.submit();
//   //          $(chatForm).trigger('reset');

//   //         }
//   //     }
//   // });
// // $(document).keydown(function (e) {
// //       if(e.keyCode == 16) shiftDown = true;
// //   });
// // $(document).keyup(function (e) {
// //       if(e.keyCode == 16) shiftDown = false;
// //   });
// }
