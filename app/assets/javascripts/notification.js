$(document).on('turbolinks:load', function() {
  notification();
 
  $("#notification").on('click',function(){
    console.log($(".site-menu li.has-children"))
    $(".site-menu li.has-children").focus();
  });

  jQuery(document.body).on('click', 'a.unread', function(event){
    var notif_id =  $(this).attr("id");
    $.ajax({
           url: "/notifications/"+notif_id+"/mark_as_read/",
           dataType: "JSON",
           type: "POST",
           success: function(result){
             console.log(result);
       }});
});
});

function notification()
{
  $.ajax({url: "/notifications.json", success: function(result){
    $("#notification > #unread_count").text(result["unread"].length);
    check = result;
    if (result["unread"].length == 0)    
    {
      $("#notification > #unread_count").addClass("d-none");
      unread = ["<li>New:</li><li><a class=\"nav-link\">No new notifications</a></li><hr><li>Earlier:</li>"]
      read = result["read"].map((item) => {
        return "<li><a href=\""+window.location.origin+item.url+"\" class=\"nav-link\">"+item.actor.firstname+ " "+ item.action+" you\!</a></li>"
      });
      items = unread.concat(read);
    }
    else
    {
      empty = ["<li>New:</li>"];
      unread = result["unread"].map((item) => {
        return "<li><a href=\""+window.location.origin+item.url+"\" id=\""+ item.id +"\" class=\"nav-link unread\">"+"New "+item.action+" from " +item.actor.firstname+"\!</a></li>"
      });
      unread = empty.concat(unread);
      unread.push("<hr><li>Earlier:</li>")
      read = result["read"].map((item) => {
        return "<li><a href=\""+window.location.origin+item.url+"\" class=\"nav-link\">"+item.actor.firstname+ " "+ item.action+" you\!</a></li>"
      });
      items = unread.concat(read);
    }

    // $("#nav-data").html(items);
    jQuery(document.body).on('click', '#notification', function(){
      $("#nav-data").html(items);      
    });

  }});
}
