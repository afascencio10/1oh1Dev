$(document).on('turbolinks:load', function() {
	/*
	** Read te search value and change the beahivor
	*/
	// var URLsearchProfile = window.location.href;
	// URLsearchProfile = URLsearchProfile.split("#");
	// $( document ).ready(function() {
	// 	switch(URLsearchProfile[1]){
	// 		case "explore":
	// 			$('.tab1-tabProfile').trigger( "click" );
	// 		break;
	// 		case "guide":
	// 			$('.tab2-tabProfile').trigger('click');
	// 		break;
	// 		case "projects":
	// 			$('.tab3-tabProfile').trigger( "click" );
	// 		break;
	// 		case null || "" || undefined:
	// 			$('.tab1-tabProfile').trigger( "click" );
	// 		break;
	// 	}
	// });
	//
	// $('.tab1-tabProfile').click(function(){
	// 	var pathname = window.location.pathname;
	// 	history.pushState(null, "", pathname+'#'+"explore");
	// })
	// $('.tab2-tabProfile').click(function(){
	// 	var pathname = window.location.pathname;
	// 	history.pushState(null, "", pathname+'#'+"guide");
	// })
	// $('.tab3-tabProfile').click(function(){
	// 	var pathname = window.location.pathname;
	// 	history.pushState(null, "", pathname+'#'+"projects");
	// })

	$('#editBackgroundPic').click(function(){
		var uploadProfileInput = document.getElementById('profileBackground')
		if(uploadProfileInput){
			uploadProfileInput.click();
		}
	});

	$('#editProfilePic').click(function(){
		var uploadInput = document.getElementById('profilephoto')
		if(uploadInput){
			uploadInput.click();
		}
	});



	var createProjectCollaborators = []
	var createProjectCategories = []
	var editProfileLanguages = window.test || []

	var editProfileLanguagesHiddenElm = document.getElementById('edit-profile-hidden-languages')
	var createProjectCategoriesHiddenElm = document.getElementById('create-project-hidden-categories')
	var createProjectCollaboratorsHiddenElm = document.getElementById('create-project-hidden-collaborators')

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

      if (hiddenInput) {
        hiddenInput.value = JSON.stringify(array)
      }
    }
  }

  function removeChipFromArray (array, hiddenInput) {
    return function (chipName) {
    	array.splice(array.findIndex(function (item) {
    		return item === chipName
    	}), 1)

      if (hiddenInput) {
        hiddenInput.value = JSON.stringify(array)
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

	$('#edit-profile-languages-add').click(function () {
		addSelectedItemAsChips(
			$('#edit-profile-languages'),
			'language',
			storeChipInArray(editProfileLanguages, editProfileLanguagesHiddenElm),
			removeChipFromArray(editProfileLanguages, editProfileLanguagesHiddenElm),
			editProfileLanguages
		)
	})

	$('form#update_guide').submit(function () {
		window.sessionStorage.clear()
		return true
	})

	$('form#update_explore').submit(function () {
		window.sessionStorage.clear()
		return true
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

// initial first time call for guide_categories
	var guideCategories = window.sessionStorage.getItem('guideCategories');
 if(guideCategories){
  guideCategories = JSON.parse(guideCategories);
 }else{
  guideCategories = {guid_categories:[]};
	category_gds = window.guide_ids || []
	category_gds.forEach(id =>{
		guideCategories.guid_categories.push(id);
	  window.sessionStorage.setItem('guideCategories', JSON.stringify(guideCategories));
	})
 }
 guideCategories.guid_categories.forEach(cat=>{
	 id = "guideCat-"+cat
 	$("#" + id).addClass('active')
 });
 setGuideCategories();

 // add Edit Explore on button click
 $('.guide-item-status-button-add').click(function () {
    var parent = $(this).parent()

    var id = Number(parent.attr('id').split('-')[1])

    parent.toggleClass('active')

    if (parent.hasClass('active')) addCategoryG(id)
    else deleteCategoryG(id)

    setGuideCategories()
  })



 function addCategoryG(category){
  var array = window.sessionStorage.getItem('guideCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {guid_categories:[]};
  }
  array.guid_categories.push(category);
  window.sessionStorage.setItem('guideCategories', JSON.stringify(array));
 }

 function deleteCategoryG(category){
  var array = window.sessionStorage.getItem('guideCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {guid_categories:[]};
  }

  array.guid_categories = array.guid_categories.filter(cat=>{
   return cat!=category;
  });
  window.sessionStorage.setItem('guideCategories', JSON.stringify(array));
 }

 function setGuideCategories(){
  /*this function keeps updating the value of the hidden tag
  to use it anytime in the backend*/
  var array = window.sessionStorage.getItem('guideCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {guid_categories:[]};
  }
  var input = document.getElementById("guideCategories");
  if (input){
  	input.value = JSON.stringify(array);
  }

 }

// initial first time call for explore_categories
 var exploreCategories = window.sessionStorage.getItem('exploreCategories');
 if(exploreCategories){
  exploreCategories = JSON.parse(exploreCategories);
 }else{
  exploreCategories = {exp_categories:[]};
	category_exds = window.explore_ids || []
	category_exds.forEach(id =>{
		exploreCategories.exp_categories.push(id);
	  window.sessionStorage.setItem('exploreCategories', JSON.stringify(exploreCategories));
	})
 }

 exploreCategories.exp_categories.forEach(cat => {
	id = "exploreCat-"+cat
  $("#" + id).addClass('active')
 })

 setExploreCategories();

// add Edit Explore on button click
 $('.explore-item-status-button-add').click(function () {
	 var parent = $(this).parent()
	 var id = Number(parent.attr('id').split('-')[1])

	 parent.toggleClass('active')

	 if (parent.hasClass('active')) addCategory(id)
	 else deleteCategory(id)

	 setExploreCategories()
 })


 function addCategory(category){
  var array = window.sessionStorage.getItem('exploreCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {exp_categories:[]};
  }
  array.exp_categories.push(category);
  window.sessionStorage.setItem('exploreCategories', JSON.stringify(array));
 }

 function deleteCategory(category){
  var array = window.sessionStorage.getItem('exploreCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {exp_categories:[]};
  }

  array.exp_categories = array.exp_categories.filter(cat=>{
   return cat!=category;
  });
  window.sessionStorage.setItem('exploreCategories', JSON.stringify(array));
 }

 function setExploreCategories(){
  /*this function keeps updating the value of the hidden tag
  to use it anytime in the backend*/
  var array = window.sessionStorage.getItem('exploreCategories');
  if(array){
   array = JSON.parse(array);
  }else{
   array = {exp_categories:[]};
  }
  var input = document.getElementById("exploreCategories");
  if (input){
  	input.value = JSON.stringify(array);
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

 	//CODE FOR SHOW MORE AND LESS FEATURE
 	if(!showMoreLessInfo){
 		var showMoreLessInfo = {};
 	}

 	function showMoreAndLess(params){
 		showMoreLessInfo[params.name] = {};
 		showMoreLessInfo[params.name].totalItems = $(params.idMainDiv+" "+params.classItem).length;
 		showMoreLessInfo[params.name].showItems = 5;
 		$(params.idShowMore).click(function(){
 			var hiddenItems = showMoreLessInfo[params.name].totalItems - showMoreLessInfo[params.name].showItems;
 			if(hiddenItems > 0){
 				showMoreLessInfo[params.name].showItems = showMoreLessInfo[params.name].showItems + 5;
 			}
 			updateShowItems(params);
		});

		$(params.idShowLess).click(function(){
 			showMoreLessInfo[params.name].showItems = Math.max(5,showMoreLessInfo[params.name].showItems - 5);
			updateShowItems(params);
		});
		updateShowItems(params);
		//function to update which items should be shown
		function updateShowItems(params){
			$(params.idMainDiv+" "+params.classItem).each(function(index){
				if (index + 1 <= showMoreLessInfo[params.name].showItems){
					$(this).show();
				}else{
					$(this).hide();
				}
			});
			var itemsShow = Math.min(showMoreLessInfo[params.name].showItems,showMoreLessInfo[params.name].totalItems);
			$(params.idMessage).html("Showing " + itemsShow + " of " + showMoreLessInfo[params.name].totalItems + " items");
		}
 	}

 	var params = {
 		idMainDiv: "#projectsListProfile",
 		idMessage: "#projectsProfileMessage",
 		idShowMore:"#showMoreButton",
 		idShowLess:"#showLessButton",
 		classItem:".projectInContainer",
 		name:"projectsProfile"
 	};

 	showMoreAndLess(params);

 	var paramsExplores = {
 		idMainDiv: "#exploreCategoriesGrid",
 		idMessage: "#exploresProfileMessage",
 		idShowMore:"#moreExploresProfile",
 		idShowLess:"#lessExploresProfile",
 		classItem:".interestsImage",
 		name:"exploresProfile"
 	};
 	showMoreAndLess(paramsExplores);

 	var paramsProfileGuide = {
 		idMainDiv: "#profileGuideMain",
 		idMessage: "#profileGuideMessage",
 		idShowMore:"#moreProfileGuides",
 		idShowLess:"#lessProfileGuides",
 		classItem:".interestsImage",
 		name:"profileGuidesList"
 	};
 	showMoreAndLess(paramsProfileGuide);

 });

})
