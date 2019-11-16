function createMessageChannel() {
  App.messages = App.cable.subscriptions.create({
        channel: 'MessageChannel', chat_id: parseInt($("#message_chat_id").val())
        },          
        {
        received: function(data) {
          $("#messages").removeClass('hidden')
          return $('#messages').append(this.renderMessage(data));
        },
        renderMessage: function(data) {
          //console.log($("div#messages").children().last().attr('id'));
          var id = Number($("#userIdInfo").text());
          var url = $("#userImageUrl").text();
          setTimeout(function(){
            $('#chatScroll').scrollTop($('#chatScroll')[0].scrollHeight);
          },500);          
          $("#chat_form").trigger('reset');
          if(id == data.user_id)
          {
            //return "<p id=\""+ data.user_id+ "\"> <b>&emsp;&emsp;&emsp;" + data.user + ": </b>" + data.message + "</p>";
            return '<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">'+ data.message +'</div><div class="img_cont_msg"></div></div>';
          }
          else{
            return '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="'+url+'" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">'+data.message+'<span class="msg_time">8:40 AM, Today</span></div></div>';
            //return "<p id=\""+ data.user_id+ "\"> <b>" + data.user + ": </b>" + data.message + "</p>";
          }
         },
            },$('#chatScroll').scrollTop($('#chatScroll')[0].scrollHeight));

      
return App.messages;
}
