var escapeEntityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return escapeEntityMap[s]
  })
}

var getMessageTemplate = function (url, messageContent, type, time = '10:05') {
  if (type) { // messages for left side
    return `
    <div class="row message mx-0 mb-2">
      <div class="col-auto px-0">
        <div>
          <div class="avatar"
               style="background-image: url(${url})">
          </div>
        </div>
        <div class="message-time text-center mt-1">
          ${time}
        </div>
      </div>
      <div class="col">
        <div class="message-content">
          ${escapeHtml(messageContent)}
        </div>
      </div>
    </div>`
  } else {
    return `
    <div class="message mb-2">
      <div class="text-right">
        <div class="message-content active text-left mr-2">
          ${escapeHtml(messageContent)}
        </div>
      </div>
    </div>`
  }
}

function createMessageChannel() {
  App.messages = App.cable.subscriptions.create({
    channel: 'MessageChannel', chat_id: parseInt($("#message_chat_id").val())
    },          
    {
    received: function(data) {
      $("#messages").removeClass('hidden')
      return $('#messages').append(this.renderMessage(data));
    },
    renderMessage: function (data) {
      //console.log($("div#messages").children().last().attr('id'));
      var id = Number($("#userIdInfo").text());
      var url = $("#userImageUrl").text();

      setTimeout(function(){
        $('#chatScroll').scrollTop($('#chatScroll')[0].scrollHeight);
      },500);          
      $("#chat_form").trigger('reset');

      return getMessageTemplate(url, data.message, id !== data.user_id)
     },
  },$('#chatScroll').scrollTop($('#chatScroll')[0].scrollHeight));

      
return App.messages;
}
$(document).on('turbolinks:load', function() {
  var contactListScroll = document.getElementById('chatScroll')
  var messagesScroll = document.getElementById('filterrific_results')

  if (contactListScroll) new PerfectScrollbar(contactListScroll)
  if (messagesScroll) new PerfectScrollbar(messagesScroll)
})
