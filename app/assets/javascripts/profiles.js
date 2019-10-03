jQuery(document).ready(function($) {

	$('.tabLink').click(function(event){
	     var tabId = "#tab_" + $(this).attr("id");
	     $('.tabLink').removeClass("selected");
	     $('.tab').removeClass("selected");
	     $(this).addClass("selected");
	     $(tabId).addClass("selected");
	});
})