jQuery(document).ready(function($){
  notification();

  jQuery(document.body).on('click', 'a.unread', function(event){
    var notif_id =  $(this).attr("id");
    $.ajax({
           url: "/notifications/"+notif_id+"/mark_as_read/",
           dataType: "JSON",
           type: "POST",
           success: function(result){
             console.log(result);
             // $("#notification > #unread_count").text(result.length);
             // items = ["<li><a class=\"nav-link\">No new notifications\!</a></li>"];
             // $("#nav-data").html(items);
             // notification();

       }});


});
  // $('a.unread').click(function(event){
  //   console.log(event);
  //   var notif_id =  $(this).attr("id");
  //   alert($(this).attr("id"));
  //   console.log(notif_id);
  //
  // })
//   $("#notification").click(function(){
//     $.ajax(
//       {
//         url: "/notifications/:id/mark_as_read",
//         dataType: "JSON",
//         type: "POST",
//         success: function(result){
//           $("#notification > #unread_count").text(result.length);
//           // items = ["<li><a class=\"nav-link\">No new notifications\!</a></li>"];
//           // $("#nav-data").html(items);
//           // notification();
//
//     }});
// });
});

function notification()
{
  $.ajax({url: "/notifications.json", success: function(result){
    $("#notification > #unread_count").text(result["unread"].length);
    check = result;
    if (result["unread"].length == 0)
    {
      unread = ["<li>New:</li><li><a class=\"nav-link\">No new notifications</a></li><hr><li>Earlier:</li>"]
      read = result["read"].map((item) => {
        return "<li><a href=\""+window.location.origin+"/markets"+"\" class=\"nav-link\">"+item.actor.firstname+ " "+ item.action+" you\!</a></li>"
      });
      items = unread.concat(read);
    }
    else
    {
      empty = ["<li>New:</li>"];
      unread = result["unread"].map((item) => {
        return "<li><a href=\""+window.location.origin+"/markets"+"\" id=\""+ item.id +"\" class=\"nav-link unread\">"+item.actor.firstname+ " "+ item.action+" you\!</a></li>"
      });
      unread = empty.concat(unread);
      unread.push("<hr><li>Earlier:</li>")
      read = result["read"].map((item) => {
        return "<li><a href=\""+window.location.origin+"/markets"+"\" class=\"nav-link\">"+item.actor.firstname+ " "+ item.action+" you\!</a></li>"
      });
      items = unread.concat(read);
    }

    // $("#nav-data").html(items);
    jQuery(document.body).on('click', '#notification', function(){
      $("#nav-data").html(items);
});


  }});
}
