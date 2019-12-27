jQuery(document).ready(function($) {

	$(document).on("click", ".category_modal", function () {
		 var category = $(this).data('val');
		 $("#editid").val(category.split(',')[0]) ;
		 $("#editname").val(category.split(',')[1]);
		 $("#editdescription").val(category.split(',')[2]);
		 $('img#editurl').attr('src', category.split(',')[3]);

	 });
	 
	$("input[type=file].categories").change(function(e){
		alert('paras')
			var storage = firebase.storage();
			var storageRef = firebase.storage().ref();
			if(e.target.id == "cat_url"){
				$('#loaderCategoryImage').fadeIn();
				$('#loaderCategoryImage').addClass('fa-spin');
					var file=document.getElementById("cat_url").files[0];
					console.log(file);
					var thisref = storageRef.child("category/"+file.name).put(file);

			}
			else if(e.target.id == "edit_url"){
					var file=document.getElementById("edit_url").files[0];
					console.log(file);
					var thisref = storageRef.child("category/"+file.name).put(file);

			}

			thisref.on('state_changed',function(snapshot){
					console.log("File Uploaded Successfully");
			},function (error) {

			},function() {
					thisref.snapshot.ref.getDownloadURL().then(function(downloadURL) {
							if(e.target.id=="cat_url")
							{
									profile = document.getElementById("url").value = downloadURL;
									$('#loaderCategoryImage').fadeOut();
									$('#checkCategoryImage').fadeIn();
							}
							else if(e.target.id=="edit_url")
							{
									profile = document.getElementById("edurl").value = downloadURL;
							}
							//alert("\nFile is here successfully");
					})});
	});
})
