const JOIN_ROOM="JOIN_ROOM",EXCHANGE="EXCHANGE",REMOVE_USER="REMOVE_USER";let currentUser,localVideo,remoteVideoContainer,localstream,pcPeers={};window.onload=(()=>{currentUser=document.getElementById("current-user").innerHTML,end_time=document.getElementsByTagName("time")[0].innerHTML,seesionId=document.getElementById("session_id").innerHTML,localVideo=document.getElementById("local-video"),remoteVideoContainer=document.getElementById("remote-video-container")});const ice={iceServers:[{urls:"stun:stun.l.google.com:19302"}]};document.onreadystatechange=(()=>{"interactive"===document.readyState&&navigator.mediaDevices.getUserMedia({audio:!0,video:!0}).then(e=>{localstream=e,localVideo.srcObject=e,localVideo.muted=!1})["catch"](logError)});const handleJoinSession=async()=>{App.session=await App.cable.subscriptions.create({channel:"SessionChannel",session_id:document.getElementById("session_id").innerHTML},{connected:()=>{broadcastData({type:JOIN_ROOM,from:currentUser,session_id:seesionId})},received:e=>{if(console.log("received",e),e.from!==currentUser)switch(e.type){case JOIN_ROOM:return joinRoom(e);case EXCHANGE:if(e.to!==currentUser)return;return exchange(e);case REMOVE_USER:return removeUser(e);default:return}},speak:e=>(console.log("received",e),App.session.perform("speak",{body:e}))})},handleLeaveSession=()=>{for(user in pcPeers)pcPeers[user].close();pcPeers={},App.session.unsubscribe(),remoteVideoContainer.innerHTML="",broadcastData({type:REMOVE_USER,from:currentUser,session_id:seesionId})},joinRoom=e=>{createPC(e.from,!0)},removeUser=e=>{console.log("removing user",e.from);let o=document.getElementById(`remoteVideoContainer+${e.from}`);o&&o.remove(),delete pcPeers[e.from],$("div#show").hide()},createPC=(e,o)=>{let t=new RTCPeerConnection(ice);return pcPeers[e]=t,t.addStream(localstream),o&&t.createOffer().then(e=>t.setLocalDescription(e)).then(()=>{broadcastData({type:EXCHANGE,from:currentUser,session_id:seesionId,to:e,sdp:JSON.stringify(t.localDescription)})})["catch"](logError),t.onicecandidate=(o=>{o.candidate&&broadcastData({type:EXCHANGE,from:currentUser,session_id:seesionId,to:e,candidate:JSON.stringify(o.candidate)})}),t.onaddstream=(o=>{const t=document.createElement("video");t.id=`remoteVideoContainer+${e}`,t.autoplay="autoplay",t.srcObject=o.stream,remoteVideoContainer.appendChild(t),$("div#show").toggle()}),t.oniceconnectionstatechange=(()=>{"disconnected"==t.iceConnectionState&&(console.log("Disconnected:",e),broadcastData({type:REMOVE_USER,from:e,session_id:seesionId}))}),t},exchange=e=>{let o;o=pcPeers[e.from]?pcPeers[e.from]:createPC(e.from,!1),e.candidate&&o.addIceCandidate(new RTCIceCandidate(JSON.parse(e.candidate))).then(()=>console.log("Ice candidate added"))["catch"](logError),e.sdp&&(sdp=JSON.parse(e.sdp),o.setRemoteDescription(new RTCSessionDescription(sdp)).then(()=>{"offer"===sdp.type&&o.createAnswer().then(e=>o.setLocalDescription(e)).then(()=>{broadcastData({type:EXCHANGE,from:currentUser,session_id:seesionId,to:e.from,sdp:JSON.stringify(o.localDescription)})})})["catch"](logError))},broadcastData=e=>{fetch("/sessions",{method:"POST",body:JSON.stringify(e),headers:{"content-type":"application/json"}})},logError=e=>console.warn("Whoops! Error:",e);