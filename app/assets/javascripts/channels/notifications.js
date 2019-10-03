App.notifications = App.cable.subscriptions.create("NotificationsChannel", {
  connected: function() {
    // Called when the subscription is ready for use on the server
  },

  disconnected: function() {
    // Called when the subscription has been terminated by the server
  },

  received: function(data) {
    // Called when there's incoming data on the websocket for this channel
    $("#notifications").prepend(data.html);
    // alert(data.html);
    var audio = new Audio('https://firebasestorage.googleapis.com/v0/b/oh1-b365f.appspot.com/o/check.wav?alt=media&token=d214e82d-c59d-4c91-8222-6f8c6e924a8f');
    audio.play();


    notification();


  }
});
