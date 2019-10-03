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
          console.log(parseInt($("div#messages").children().last().attr('id')));
          if(parseInt($("div#messages").children().last().attr('id')) == data.user_id)
          {
            return "<p id=\""+ data.user_id+ "\"> <b>&emsp;&emsp;&emsp;" + data.user + ": </b>" + data.message + "</p>";
          }
          else{
            return "<p id=\""+ data.user_id+ "\"> <b>" + data.user + ": </b>" + data.message + "</p>";
          }

  },
      });
return App.messages;
}
