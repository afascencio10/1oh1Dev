var starConfig = {
  starWidth: '20px',
  ratedFill: '#ffb649',
  rating: 4.2,
  readOnly: true
}

jQuery(document).ready(function($) {
	// initialize stars
	$('.rateYo').rateYo(starConfig)
})