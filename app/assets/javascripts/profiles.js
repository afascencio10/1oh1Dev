jQuery(document).ready(function($) {
	var createProjectCollaborators = ['1']
	var createProjectCategories = ['2']
	var editProjectCollaborators = ['2']
	var editProjectCategories = ['2']
	var editProfileLanguages = ['eng']

	var editProfileLanguagesHiddenElm = document.getElementById('edit-profile-hidden-languages')
	var createProjectCategoriesHiddenElm = document.getElementById('create-project-hidden-categories')
	var createProjectCollaboratorsHiddenElm = document.getElementById('create-project-hidden-collaborators')
	var editProjectCategoriesHiddenElm = document.getElementById('edit-project-hidden-categories')
	var editProjectCollaboratorsHiddenElm = document.getElementById('edit-project-hidden-collaborators')

	var chipTemplate = '\
    <div class="base-chips d-inline-block">\
      <span class="base-chips-name"></span>\
      <button type="button" class="close">\
        <span aria-hidden="true">&times;</span>\
      </button>\
    </div>\
    '
	$('#img-Profile').click(function (event) {
		$('#profile-pic-ui').toggleClass('d-none')
	})

	var profilePicElm = document.getElementById('profile-pic')

	if (profilePicElm) {
		new Hammer(profilePicElm).on('swipe', function (event) {
			$('#profile-pic-ui').addClass('d-none')
		})
	}

	// add default languages
	editProfileLanguages.forEach(function (language) {
		generateDefaultChipForSelectElement(language, 'language', $('#edit-profile-languages'), editProfileLanguagesHiddenElm, editProfileLanguages)
	})
	// add default createProjectCollaborators
	createProjectCollaborators.forEach(function (colab) {
		generateDefaultChipForSelectElement(colab, 'colab_id', $('#create-project-collaborators'), createProjectCollaboratorsHiddenElm, createProjectCollaborators)
	})

	// add default create project categories
	createProjectCategories.forEach(function (category) {
		generateDefaultChipForSelectElement(category, '_category_id_', $('#create-project-categories'), createProjectCategoriesHiddenElm, createProjectCategories)
	})

	// add editProjectCollaborators
	editProjectCollaborators.forEach(function (colab) {
		generateDefaultChipForSelectElement(colab, 'edit_project_colab', $('#edit-project-collaborators'), editProjectCollaboratorsHiddenElm, editProjectCollaborators)
	})

	editProjectCategories.forEach(function (category) {
		generateDefaultChipForSelectElement(category, 'edit_project_category_select', $('#edit-project-categories'), editProjectCategoriesHiddenElm, editProjectCategories)
	})
	// add
	function generateDefaultChipForSelectElement (value, selectId, wrapper, hiddenInput, storage) {
		if (hiddenInput && storage) {
			hiddenInput.text = JSON.stringify(storage)
		}

		var select = document.getElementById(selectId)

		if (!select) return

	  var selectItem = Array.from(select.options).filter(function (option) {
	    if (value === option.value) return option
	  })
	  var selectText
	  if (selectItem[0]) {
	    selectText = selectItem[0].text
	  }
	  addChips(
	    wrapper,
	    selectText,
	    value,
	    null,
	    removeChipFromArray(storage, hiddenInput)
	  )
	}

  function addChips(wrapper, chipName, chipValue, addClb, removeClb, storage) {
      var element = $(chipTemplate)
      if (storage) {
        if (storage.findIndex(function (item) {
          return item === chipValue
        }) !== -1) return
      }

      element.find('.base-chips-name').text(chipName)
      element.find('button').click(function () {
        removeChips($(this), chipValue, removeClb)
      })

      wrapper.append(element)
      if (addClb) addClb(chipValue)
  }

  function removeChips (chip, chipName, clb) {
    if (clb) clb(chipName)

    chip.parent().remove()
  }

  function addSelectedItemAsChips(wrapper, selectId, addClb, removeClb, storage) {
    var select = document.getElementById(selectId)
    if (!select) return

    var selectText = select.selectedOptions[0].text
    var selectValue = select.selectedOptions[0].value

    addChips(wrapper, selectText, selectValue, addClb, removeClb, storage)
  }

  function storeChipInArray (array, hiddenInput) {
    return function (chipName) {
      array.push(chipName)

      console.log(hiddenInput)
      if (hiddenInput) {
        hiddenInput.text = JSON.stringify(array)
        console.log(hiddenInput.text)
      }
      console.log(array)
    }
  }

  function removeChipFromArray (array, hiddenInput) {
    return function (chipName) {
    	array.splice(array.findIndex(function (item) {
    		return item === chipName
    	}), 1)

      console.log(hiddenInput)
      console.log(array)
      if (hiddenInput) {
        hiddenInput.text = JSON.stringify(array)
        console.log(hiddenInput.text)
      }
    }
  }

	$('#create-project-collaborator-add').click(function () {
		addSelectedItemAsChips(
			$('#create-project-collaborators'),
			'colab_id',
			storeChipInArray(createProjectCollaborators, createProjectCollaboratorsHiddenElm),
			removeChipFromArray(createProjectCollaborators, createProjectCollaboratorsHiddenElm),
			createProjectCollaborators
		)
	})

	$('#create-project-categories-add').click(function () {
		addSelectedItemAsChips(
			$('#create-project-categories'),
			'_category_id_',
			storeChipInArray(createProjectCategories, createProjectCategoriesHiddenElm),
			removeChipFromArray(createProjectCategories, createProjectCategoriesHiddenElm),
			createProjectCategories
		)
	})

	$('#edit-project-collaborator-add').click(function () {
		addSelectedItemAsChips(
			$('#edit-project-collaborators'),
			'edit_project_colab',
			storeChipInArray(editProjectCollaborators, editProjectCollaboratorsHiddenElm),
			removeChipFromArray(editProjectCollaborators, editProjectCollaboratorsHiddenElm),
			editProjectCollaborators
		)
	})

	$('#edit-project-categories-add').click(function () {
		addSelectedItemAsChips(
			$('#edit-project-categories'),
			'edit_project_category_select',
			storeChipInArray(editProjectCategories, editProjectCategoriesHiddenElm),
			removeChipFromArray(editProjectCategories, editProjectCategoriesHiddenElm),
			editProjectCategories
		)
	})

	$('#edit-profile-languages-add').click(function () {
		addSelectedItemAsChips(
			$('#edit-profile-languages'),
			'language',
			storeChipInArray(editProfileLanguages, editProfileLanguagesHiddenElm),
			removeChipFromArray(editProfileLanguages, editProfileLanguagesHiddenElm),
			editProfileLanguages
		)
	})

	$('.tabLink').click(function(event){
	     var tabId = "#tab_" + $(this).attr("id");
	     $('.tabLink').removeClass("selected");
	     $('.tab').removeClass("selected");
	     $(this).addClass("selected");
	     $(tabId).addClass("selected");
	});
		$('#countries').change(function ()
			{
					var input_country = $(this);
					var states_of_country = $("#states-of-country");
					var cities_of_state = $("#cities-of-state");
					if($(this).val() == "")
					{
					states_of_country.html("");
					}
					else
					{
						$.ajax({
							url: '/states/' + $(this).val(),
							type: 'GET',
							success(data) {
								states_of_country.empty();
								var opt = '<option value="" selected="">Select Your State</option>';
								if(Object.keys(data).length==0){
									var cities_of_state = $("#cities-of-state");
									states_of_country.html('<option value="" selected="">No State found</option>');
									cities_of_state.html('<option value="" selected="">No Cities found</option>');
								} else
								{
									for (var key in data) {
									  opt += '<option value='+ key +'>' + data[key] + '</option>';
										states_of_country.html(opt);
									}
									var cities_of_state = $("#cities-of-state");
									cities_of_state.html('<option value="" selected="">Select Your State</option>');
								}
							}
							});
						}
			});

			$('#states-of-country').change(function ()
				{
						var input_state = $(this);
						var country = $("#countries");
						var cities_of_state = $("#cities-of-state");
						if($(this).val() == "")
						{
						cities_of_state.html("");
						}
						else
						{
							$.ajax({
								url: '/cities/' + $(this).val()+ '/'+ country.val(),
								type: 'GET',
								success(data) {
									cities_of_state.empty();
									var opt = '<option value="" selected="">Select Your City</option>';
									if(Object.keys(data).length == 0){
										cities_of_state.html('<option value="" selected="">No Cities found</option>');
									} else
									{
										data.forEach(function(i) {
											opt += '<option value="'+ i +'">' + i + '</option>';
											cities_of_state.html(opt);
										});
									}
								}
								});
							}
				});

	// Select the node that will be observed for mutations
	var guideCategories = window.localStorage.getItem('guideCategories');
 if(guideCategories){
  guideCategories = JSON.parse(guideCategories);
 }else{
  guideCategories = {categories:[]};
 }
 guideCategories.categories.forEach(cat=>{
  $("#guideCat-"+cat).removeClass('btn-success').addClass('btn-outline-dark').text('Added');
 });
 setGuideCategories();

 $('.addGuideBtnn').on('click', function () {
   // alert("Clicked  ");
   var id = this.id;
   id = id.split("-")[1];
   var isSelected = $(this).hasClass("btn-outline-dark");
   if(isSelected){
    unselecCategoryG(id);
   }else {
    selectCategoryG(id);
   }
   setGuideCategories();

 })



  $('.newCategoryMessage').on('click', function () {
    // alert("Clicked  ");
    console.log("Hey, im keep here!");

  })


 function selectCategoryG(category){
  addCategoryG(category);
  $("#guideCat-"+category).removeClass('btn-success').addClass('btn-outline-dark').text('Added');
 }

 function unselecCategoryG(category){
  deleteCategoryG(category);
  $("#guideCat-"+category).removeClass('btn-outline-dark').addClass('btn-success').text('Add');
 }

 function addCategoryG(category){
  var array = window.localStorage.getItem('guideCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {categories:[]};
  }
  array.categories.push(category);
  window.localStorage.setItem('guideCategories', JSON.stringify(array));
 }
 function deleteCategoryG(category){
  var array = window.localStorage.getItem('guideCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {categories:[]};
  }

  array.categories = array.categories.filter(cat=>{
   return cat!=category;
  });
  window.localStorage.setItem('guideCategories', JSON.stringify(array));
 }

 function setGuideCategories(){
  /*this function keeps updating the value of the hidden tag
  to use it anytime in the backend*/
  var array = window.localStorage.getItem('guideCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {categories:[]};
  }
  console.log(array);
  var input = document.getElementById("guideCategories");
  if (input){
  	input.value = array;
  }

 }


 var exploreCategories = window.localStorage.getItem('exploreCategories');
 if(exploreCategories){
  exploreCategories = JSON.parse(exploreCategories);
 }else{
  exploreCategories = {categories:[]};
 }
 exploreCategories.categories.forEach(cat=>{
  $("#explorerCat-"+cat).removeClass('btn-success').addClass('btn-outline-dark').text('Added');
 });
 setExploreCategories();

 $('.addExploreBtnn').on('click', function () {
   // alert("Clicked  ");
   var id = this.id;
   id = id.split("-")[1];
   var isSelected = $(this).hasClass("btn-outline-dark");
   if(isSelected){
    unselecCategory(id);
   }else {
    selectCategory(id);
   }
   setExploreCategories();

 })

  $('.title').on('click', function () {
    // alert("Clicked  ");
    console.log("Hey, im still here!");

  })


 function selectCategory(category){
  addCategory(category);
  $("#explorerCat-"+category).removeClass('btn-success').addClass('btn-outline-dark').text('Added');
 }

 function unselecCategory(category){
  deleteCategory(category);
  $("#explorerCat-"+category).removeClass('btn-outline-dark').addClass('btn-success').text('Add');
 }

 function addCategory(category){
  var array = window.localStorage.getItem('exploreCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {categories:[]};
  }
  array.categories.push(category);
  window.localStorage.setItem('exploreCategories', JSON.stringify(array));
 }
 function deleteCategory(category){
  var array = window.localStorage.getItem('exploreCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {categories:[]};
  }

  array.categories = array.categories.filter(cat=>{
   return cat!=category;
  });
  window.localStorage.setItem('exploreCategories', JSON.stringify(array));
 }

 function setExploreCategories(){
  /*this function keeps updating the value of the hidden tag
  to use it anytime in the backend*/
  var array = window.localStorage.getItem('exploreCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {categories:[]};
  }
  console.log(array);
  var input = document.getElementById("exploreCategories");
  if (input){
  	input.value = array;
  }

 }

 $(function () {	
	$(".rateYoCustom").each(function(){
		if ( $(this).attr("rating") != null || $(this).attr("rating") != undefined || $(this).attr("rating") != "" ) {
			if ($(this).attr("starsSize") == "normal") {
				$(this).rateYo({
					rating: $(this).attr("rating"),
					ratedFill: "#f1c40f",
					normalFill: "#e4e4e4",
					readOnly: true,
					starWidth: "30px"
				});
			}
			if ($(this).attr("starsSize") == "small") {
				$(this).rateYo({
					rating: $(this).attr("rating"),
					ratedFill: "#f1c40f",
					normalFill: "#e4e4e4",
					readOnly: true,
					starWidth: "20px"
				});	
			}
		}			
 	});

 	var $rateYo = $(".rateYoInput").rateYo({
 		rating: 3,
 		ratedFill: "#f1c40f",
		normalFill: "#e4e4e4",
		onSet: function (){
			var rating = $rateYo.rateYo("rating");						
			var input = document.getElementById("rateExperience");
		 	if (input) {
		 		input.value = rating;		 		
		 	}
		}
 	}); 

 	
 	function showMoreLess(idContainer,idShowMore,idShowLess) {
 		var idContainerString = "#" + idContainer;
 		var idShowMoreString = "#" + idShowMore;
 		var idShowLessString = "#" + idShowLess;
 		$("#projectInContainer").each(function(index){ 			
 			$("#showMoreButton").click(function(){
 				if (index < showCount + 5) {
 					$("#projectInContainer")[index].css("display","block");
 				}else{
 					$("#projectInContainer")[index].css("display","none");
 				}
 			});
 			$("#showLessButton").click(function(){
 				if (showCount > 5) {
 					if (index < showCount - 5) {
	 					$("#projectInContainer")[index].css("display","block");
	 				}else{
	 					$("#projectInContainer")[index].css("display","none");
	 				}
 				}	 				
 			});
 		});
 	}






 	//Ids for buttons and class of the items
 	var idShowMore = "showMoreButton";
 	var idShowLess = "showLessButton";
 	var idContainer = "projectInContainer";

 	//Show less, show more function
 	var showCount;
 	var showCountTotal;
 	var idShowMoreString = "#" + idShowMore;
 	var idShowLessString = "#" + idShowLess;
 	var idContainerString = "." + idContainer;

 	showCountTotal = $(idContainerString).length;
 	showCount = showCountTotal;

 	$(idShowMoreString).click(function(){  		
 		if (showCount < showCountTotal) {
 			$(idContainerString).each(function(index){
				if (index < showCount + 5) {
					$(this).show();
				}else{
					$(this).hide();
				}
			});
			showCount = showCount + 5;
 		}			
	});

	$(idShowLessString).click(function(){		
		if (showCount > 5) {
			$(idContainerString).each(function(index){
				if (index < showCount - 5) {
					$(this).show();
				}else{
					$(this).hide();
				}
			});
			showCount = showCount - 5;
		}					
	});



 });

})


