jQuery(document).ready(function($) {
    var timedelay = 1;
	var _delay = setInterval(delayCheck, 500);

	$('.containerSessionVid').on('mousemove', showAllEvent);

	function delayCheck() {
	  if (timedelay == 5) {
	    $('.isHide').removeClass('showRoomBar');
	    timedelay = 1;
	  }
	  timedelay = timedelay + 1;
	}

	function showAllEvent() {
	  $('.isHide').addClass('showRoomBar');
	  timedelay = 1;
	  clearInterval(_delay);
	  _delay = setInterval(delayCheck, 500);
	}
})