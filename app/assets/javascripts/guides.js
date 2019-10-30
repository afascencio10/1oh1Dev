var starConfig = {
  starWidth: '20px',
  ratedFill: '#ffb649',
  rating: 4.2,
  readOnly: true
}

jQuery(document).ready(function($) {
	// initialize stars
	$('.rateYo').rateYo(starConfig)

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
})