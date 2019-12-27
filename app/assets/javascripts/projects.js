$(document).ready(function(){
    $("input[type=file]").change(function(e){
        if(e.target.id == "projectphoto"){
          $('#loaderimage').fadeIn();
          $('#loaderimage').addClass('fa-spin');
        }else if(e.target.id == "profilephoto"){
          $('#loaderimageprofile').fadeIn();
          $('#loaderimageprofile').addClass('fa-spin');
        }else if(e.target.id == "profileBackground"){
          $('#loaderimagebackground').fadeIn();
          $('#loaderimagebackground').addClass('fa-spin');
        }else if(e.target.id == "edit_url"){
          $('#loaderedit').fadeIn();
          $('#loaderedit').addClass('fa-spin');
        }
            var storage = firebase.storage();
            var storageRef = firebase.storage().ref();
            if(e.target.id == "projectphoto"){
                var file= e.target.files[0];

                console.log(file);
                var thisref = storageRef.child("project/"+file.name).put(file);
                $('#' + e.target.id + ' + .custom-file-label').text(file.name)
            }
            if(e.target.id == "profilephoto"){
                var file=document.getElementById("profilephoto").files[0];
                console.log(file);
                var thisref = storageRef.child("profile/"+file.name).put(file);
            }
            if(e.target.id == "profileBackground"){
                var file=document.getElementById("profileBackground").files[0];
                console.log(file);
                var thisref = storageRef.child("banner/"+file.name).put(file);
            }
            else if(e.target.id == "edit_url"){
                var file = e.target.files[0];
                console.log(file);
                var thisref = storageRef.child("category/"+file.name).put(file);
                $('#' + e.target.id + ' + .custom-file-label').text(file.name)
            }

            thisref.on('state_changed',function(snapshot){
                console.log("File Uploaded Successfully");
                console.log(snapshot);
            },function (error) {

            },function() {
              thisref.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                  if(e.target.id=="projectphoto")
                  {
                    $('#url').val(downloadURL);
                      profile = document.getElementById("url").value = downloadURL;
                  }
                  if(e.target.id=="profilephoto")
                  {
                    $('#urlprofile').val(downloadURL);
                      profile = document.getElementById("urlprofile").value = downloadURL;
                  }
                  if(e.target.id=="profileBackground")
                  {
                    $('#urlprofileBackground').val(downloadURL);
                      profile = document.getElementById("urlprofileBackground").value = downloadURL;
                      console.log(downloadURL);
                  }
                  else if(e.target.id=="edit_url")
                  {
                      profile = document.getElementById("url_edit").value = downloadURL;
                  }
                  if(e.target.id=="projectphoto"){
                    $('#loaderimage').fadeOut();
                    $('#check').fadeIn();
                  }else if(e.target.id == "profilephoto"){
                    $('#loaderimageprofile').fadeOut();
                    $('#checkprofile').fadeIn();
                  }else if(e.target.id == "profileBackground"){
                    $('#loaderimagebackground').fadeOut();
                    $('#checkbackground').fadeIn();
                  }else if(e.target.id == "edit_url"){
                    $('#loaderedit').fadeOut();
                    $('#checkedit').fadeIn();
                  }
              })});
      })
});
