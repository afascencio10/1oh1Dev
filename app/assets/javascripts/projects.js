$(document).ready(function(){  
  var loaderId;
  var checkId;
  var inputId;
  $("input[type=file]").change(function(e){
    var storage = firebase.storage();
    var storageRef = firebase.storage().ref();
    if(e.target.id == "projectphoto") {
      loaderId = '#loaderimage';
      checkId = '#check';
      inputId = 'url';
      $(loaderId).fadeIn();
      $(loaderId).addClass('fa-spin');
      var file= e.target.files[0];
      var thisref = storageRef.child("project/"+file.name).put(file);
      $('#' + e.target.id + ' + .custom-file-label').text(file.name);
    }else if(e.target.id == "profilephoto") {
      loaderId = '#loaderimageprofile';
      checkId = '#checkprofile';
      inputId = 'urlprofile';
      $(loaderId).fadeIn();
      $(loaderId).addClass('fa-spin');
      var file=document.getElementById("profilephoto").files[0];
      var thisref = storageRef.child("profile/"+file.name).put(file);
    }else if(e.target.id == "profileBackground") {
      loaderId = '#loaderimagebackground';
      checkId = '#checkbackground';
      inputId = 'urlprofileBackground';
      $(loaderId).fadeIn();
      $(loaderId).addClass('fa-spin');
      var file=document.getElementById("profileBackground").files[0];
      var thisref = storageRef.child("banner/"+file.name).put(file);
    }else if(e.target.id == "edit_url") {
      loaderId = '#loaderedit';
      checkId = '#checkedit';
      inputId = 'edit_url';
      $(loaderId).fadeIn();
      $(loaderId).addClass('fa-spin');
      var file = e.target.files[0];
      var thisref = storageRef.child("category/"+file.name).put(file);
      $('#' + e.target.id + ' + .custom-file-label').text(file.name);
    }
    thisref.on('state_changed',function(snapshot) {
        console.log("File Uploaded Successfully");
        console.log(snapshot);
    },function (error) {
        console.log("Upload Error");
    },function() {
      thisref.snapshot.ref.getDownloadURL().then(function(downloadURL) {                
        var inputIdComplete = '#' + inputId;        
        $(inputIdComplete).val(downloadURL);
        profile = document.getElementById(inputId).value = downloadURL;
        $(loaderId).fadeOut();
        $(checkId).fadeIn();
        console.log(profile);
        console.log(inputId);
        switch (inputId) {
          case 'urlprofileBackground':
          $('.backgroundimagechange').attr('style','background-image: url(' + downloadURL + ');');
          break;
          case 'urlprofile':
          $('.profileImg').attr('src',downloadURL);
          break;
          case 'url':
          $('.projectPhotoPreview').attr('src',downloadURL);
          $('.projectPhotoPreview').css('height','125px');
          $('.projectPhotoPreview').css('width','125px');
          $('.projectPhotoPreview').css('border','3px solid #e9ecef');
          $('.projectPhotoPreview').css('margin-left','25px');
          break;
          case 'edit_url':
          $('.projecteditPhotoPreview').attr('src',downloadURL);
          $('.projecteditPhotoPreview').css('height','125px');
          $('.projecteditPhotoPreview').css('width','125px');
          $('.projecteditPhotoPreview').css('border','3px solid #e9ecef');
          $('.projecteditPhotoPreview').css('margin-left','25px');
          break;
        }
      })      
    });
  })
});