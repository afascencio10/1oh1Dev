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
          console.log(data);
          var id = Number($("#userIdInfo").text());
          console.log("el id");
          console.log(id);
          if($("div#messages").children().last().attr('id') == data.user_id)
          {
            //return "<p id=\""+ data.user_id+ "\"> <b>&emsp;&emsp;&emsp;" + data.user + ": </b>" + data.message + "</p>";
            return "<p id=\""+ data.user_id+ "\">" +"Hola pipe"+ "</p>";
          }
          else{
            return "<p id=\""+ data.user_id+ "\">" +"Hola Andres"+ "</p>";
            //return "<p id=\""+ data.user_id+ "\"> <b>" + data.user + ": </b>" + data.message + "</p>";
          }

  },
      });
return App.messages;
}
