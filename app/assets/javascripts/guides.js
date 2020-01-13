var starConfig = {
  starWidth: '20px',
  ratedFill: '#ffb649',
  rating: 4.2,
  readOnly: true
}

$(document).on('turbolinks:load', function() {
	// initialize stars
	$('.rateYo').rateYo(starConfig)

	$('.time-picker').mdtimepicker()

	var timeout = null

	$(".minimal-card-wrap").mousemove(function(e) {
		clearTimeout(timeout);
		var wrap = $(this)
		var card = $(this).find(".minimal-card")
		var avatar = $(this).find(".avatar")

	    timeout = setTimeout(function(){
		    var main = e.target.getBoundingClientRect()
		 	var x = e.pageX - wrap.offset().left - main.width / 2;
			var y = e.pageY - wrap.offset().top - main.height / 2;
			card.css({"transform":"translate("+(x/50)+"%,"+(y/50)+"%) perspective(1500px) rotateX("+-y/50+"deg) rotateY("+x/50+"deg) scale(1.1)"});
			avatar.css({"transform":"translate("+(x/50-50)+"%,"+(y/50-50)+"%) perspective(1500px) rotateX("+-y/50+"deg) rotateY("+x/50+"deg) scale(0.8)"});
		}, 1)


	});


	$(".minimal-card-wrap").mouseleave(function() {
		clearTimeout(timeout);
		var card = $(this).find(".minimal-card")
		var avatar = $(this).find(".avatar")
		card.css({"transform":"scale(1)"});
		avatar.css({"transform":"translate3d(-50%,-50%,10px) scale(0.75)"});
	});

	$('#arroundScheduleBtn').click(function () {
		$(this).toggleClass('active')
		$('.schedule-popup-wrap').toggleClass('d-none')
	})

	/*
	** Read the search value and change the beahivor
	*/
	var URLsearch = window.location.search;
	URLsearch=URLsearch.slice(6,15);
	$( document ).ready(function() {
		console.log( "ready!" );
		$('#tabExplorers').click(function(){
			var pathname = window.location.pathname;
			history.pushState(null, "", pathname+"?type=explores");
		})
		$('#tabGuides').click(function(){
			var pathname = window.location.pathname;
			history.pushState(null, "", pathname+"?type=guides");
		})
		$('#tabProjects').click(function(){
			var pathname = window.location.pathname;
			history.pushState(null, "", pathname+"?type=projects");
		})
		setTimeout(()=>{
			switch(URLsearch){
				case "explorers":
					console.log("case explore");
					$('#tabExplorers').trigger( "click" );
				break;
				case "guides":
					console.log("case guide");
					$('#tabGuides').trigger('click');
				break;
				case "projects":
					console.log("case projects");
					$('#tabProjects').trigger( "click" );
				break;
			}
			$('#tabExplorers').click(function(){
				var pathname = window.location.pathname;
				history.pushState(null, "", pathname+"?type=explores");
		    	window.location.reload();
			})
			$('#tabGuides').click(function(){
				var pathname = window.location.pathname;
				history.pushState(null, "", pathname+"?type=guides");
		    	window.location.reload();
			})
			$('#tabProjects').click(function(){
				var pathname = window.location.pathname;
				history.pushState(null, "", pathname+"?type=projects");
				window.location.reload();
			})
		},1)



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

 	var paramsPopularGuides = {
 		idMainDiv: "#mainPopularGuides",
 		idMessage: "#popularGuidesMessage",
 		idShowMore:"#showMorePopular",
 		idShowLess:"#showLessPopular",
 		classItem:".popularGuidesItem",
 		name:"popularGuides"
 	};
 	showMoreAndLess(paramsPopularGuides);

 	var paramsPopularRol = {
 		idMainDiv: "#mainPopularRol",
 		idMessage: "#popularRolMessage",
 		idShowMore:"#showMoreRol",
 		idShowLess:"#showLessRol",
 		classItem:".popularRolItem",
 		name:"popularRolGuides"
 	};
 	showMoreAndLess(paramsPopularRol);

 	var paramsTopGuides = {
 		idMainDiv: "#mainTopGuides",
 		idMessage: "#topGuidesMessage",
 		idShowMore:"#showMoreTop",
 		idShowLess:"#showLessTop",
 		classItem:".topGuidesItem",
 		name:"topGuides"
 	};
 	showMoreAndLess(paramsTopGuides);

 	var paramsCategorieGuides = {
 		idMainDiv: "#mainCategoryGuides",
 		idMessage: "#categoryGuidesMessage",
 		idShowMore:"#showMoreCategory",
 		idShowLess:"#showLessCategory",
 		classItem:".categoryGuidesItem",
 		name:"categoryGuides"
 	};
 	showMoreAndLess(paramsCategorieGuides);


 	//FOR EXPLORES
 	var paramsPopularExplore = {
 		idMainDiv: "#mainPopularExplore",
 		idMessage: "#popularExploreMessage",
 		idShowMore:"#showMorePopular",
 		idShowLess:"#showLessPopular",
 		classItem:".popularExploreItem",
 		name:"popularExplore"
 	};
 	showMoreAndLess(paramsPopularExplore);

 	var paramsPopularRolExplore = {
 		idMainDiv: "#mainPopularRolExplore",
 		idMessage: "#popularRolExploreMessage",
 		idShowMore:"#showMoreRolExplore",
 		idShowLess:"#showLessRolExplore",
 		classItem:".popularRolExploreItem",
 		name:"popularRolExplore"
 	};
 	showMoreAndLess(paramsPopularRolExplore);

 	var paramsTopExplore = {
 		idMainDiv: "#mainTopExplore",
 		idMessage: "#topExploreMessage",
 		idShowMore:"#showMoreTopExplore",
 		idShowLess:"#showLessTopExplore",
 		classItem:".topExploreItem",
 		name:"topExplore"
 	};
 	showMoreAndLess(paramsTopExplore);

 	var paramsCategorieExplore = {
 		idMainDiv: "#mainCategoryExplore",
 		idMessage: "#categoryExploreMessage",
 		idShowMore:"#showMoreCategoryExplore",
 		idShowLess:"#showLessCategoryExplore",
 		classItem:".categoryExploreItem",
 		name:"categoryGuides"
 	};
 	showMoreAndLess(paramsCategorieExplore);

})
