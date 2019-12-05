// Broadcast Types
const JOIN_ROOM = "JOIN_ROOM";
const EXCHANGE = "EXCHANGE";
const REMOVE_USER = "REMOVE_USER";

// DOM Elements
let currentUser;
let localVideo;
let remoteVideoContainer;

// Objects
let pcPeers = {};
let localstream;

window.onload = () => {
  currentUser = document.getElementById("current-user").innerHTML;
  end_time = document.getElementsByTagName("time")[0].innerHTML;
  console.log(end_time);
  countdown_timer(end_time);
  seesionId = document.getElementById("session_id").innerHTML;
  localVideo = document.getElementById("local-video");
  remoteVideoContainer = document.getElementById("remote-video-container");
};

function countdown_timer(end_time)
{

  countDownDate= new Date(end_time).getTime();

  var x = setInterval(function() {

    var now = new Date().getTime();

    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    days = days?days+"d ":"";
    hours = hours?hours+"h ":"";
    minutes = minutes?minutes+"m ":"";
    seconds = seconds?seconds+"s ":"";

    document.getElementById("demo").innerHTML = days + hours+ minutes+ seconds;

    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("demo").innerHTML = "EXPIRED";
      $('#timesUp').modal('show');
  }
}, 1000);

}
// Ice Credentials
const ice = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// Initialize user's own video
document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true
      })
      .then(stream => {
        localstream = stream;
        localVideo.srcObject = stream;
        localVideo.muted = false;
      })
      .catch(logError);
  }
};

const handleJoinSession = async () => {
  //Here to fadeOut the middlecam and add to topbarcam
  $('.wrapCardPre').fadeOut();
  $('#local-video-up').fadeIn();
  navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: true
  })
  .then(stream => {
    localstream = stream;
    localVideoUp = document.getElementById("local-video-right");
    localVideoUp.srcObject = stream;
    localVideoUp.muted = false;
  })
  .catch(logError);
  App.session = await App.cable.subscriptions.create({channel: 'SessionChannel',session_id: document.getElementById("session_id").innerHTML },
  { connected: () => {
      broadcastData({
        type: JOIN_ROOM,
        from: currentUser,
        session_id: seesionId
      });
  },
    received: data => {
      console.log("received", data);
      if (data.from === currentUser) return;
      switch (data.type) {
        case JOIN_ROOM:
          return joinRoom(data);
        case EXCHANGE:
          if (data.to !== currentUser) return;
          return exchange(data);
        case REMOVE_USER:
          return removeUser(data);
        default:
          return;
      }
    },
    speak: messageBody => {
      console.log("received", messageBody);
      return App.session.perform('speak', { body: messageBody });
      }
  });
};
// $(document).on('keypress', '[data-behavior~=message_speaker]', function(event) {
//     if (event.keyCode === 13) {
//       App.session.speak(event.target.value);
//       event.target.value = '';
//       return event.preventDefault();
//     }
//   });


const handleLeaveSession = () => {
  for (user in pcPeers) {
    pcPeers[user].close();
  }
  pcPeers = {};

  App.session.unsubscribe();

  remoteVideoContainer.innerHTML = "";

  broadcastData({
    type: REMOVE_USER,
    from: currentUser,
    session_id: seesionId
  });
};

const joinRoom = data => {
  createPC(data.from, true);
};

const removeUser = data => {
  console.log("removing user", data.from);
  let video = document.getElementById(`remoteVideoContainer+${data.from}`);
  video && video.remove();
  delete pcPeers[data.from];
  $('div#show').hide();
};

const createPC = (userId, isOffer) => {
  let pc = new RTCPeerConnection(ice);
  pcPeers[userId] = pc;
  pc.addStream(localstream);

  isOffer &&
    pc
      .createOffer()
      .then(offer => {
        return pc.setLocalDescription(offer);
      }).then(() => {
        broadcastData({
          type: EXCHANGE,
          from: currentUser,
          session_id: seesionId,
          to: userId,
          sdp: JSON.stringify(pc.localDescription)
        });
      })
      .catch(logError);

  pc.onicecandidate = event => {
    event.candidate &&
      broadcastData({
        type: EXCHANGE,
        from: currentUser,
        session_id: seesionId,
        to: userId,
        candidate: JSON.stringify(event.candidate)
      });
  };

  pc.onaddstream = event => {
    const element = document.createElement("video");
    element.id = `remoteVideoContainer+${userId}`;
    element.autoplay = "autoplay";
    element.srcObject = event.stream;
    remoteVideoContainer.appendChild(element);
    $('div#show').toggle();

  };

  pc.oniceconnectionstatechange = event => {
    if (pc.iceConnectionState == "disconnected") {
      console.log("Disconnected:", userId);
      broadcastData({
        type: REMOVE_USER,
        from: userId,
        session_id: seesionId
      });
    }
  };

  return pc;
};

const exchange = data => {
  let pc;

  if (!pcPeers[data.from]) {
    pc = createPC(data.from, false);
  } else {
    pc = pcPeers[data.from];
  }

  if (data.candidate) {
    pc
      .addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)))
      .then(() => console.log("Ice candidate added"))
      .catch(logError);
  }

  if (data.sdp) {
    sdp = JSON.parse(data.sdp);
    pc
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .then(() => {
        if (sdp.type === "offer") {
          pc.createAnswer().then(answer => {
            return pc.setLocalDescription(answer);
          }).then(()=> {
            broadcastData({
              type: EXCHANGE,
              from: currentUser,
              session_id: seesionId,
              to: data.from,
              sdp: JSON.stringify(pc.localDescription)
            });
          });
        }
      })
      .catch(logError);
  }
};

const broadcastData = data => {
  fetch('/sessions', {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" }
  });
};

const logError = error => console.warn("Whoops! Error:", error);
