jQuery(document).ready(function($) {
	var bookingCalendar = document.querySelector('.booking-calendar') // .category-calendar
	if (bookingCalendar) {
		var calendars = new FullCalendar.Calendar(bookingCalendar, {
		    plugins: [ 'dayGrid', 'interaction' ],
		    header: {
		      left: 'title',
		      center: '',
		      right: 'prev,next'
		    },
		    showNonCurrentDates: false,
		    aspectRatio: 0.85,
		    columnHeaderFormat: {
				weekday: 'narrow'
		    },
		    dayRender: function (info) {
		      if (Math.round(Math.random() * 10 + 1) % 2 === 0) {
		      	var el = $(info.el)
		        var index = el.index()
		        var tdContent = el.closest('.fc-bg').next().find('td.fc-day-top')[index]

		        $(tdContent).addClass('done')
		      }
		    }
		})

		calendars.render()
	}

	// assign listeners
	// to approve button
	$('.booking-approve-btn').click(function () {
		$('#bookingApproveDialog').modal()
	})

	// to decline button declineBookingDialog
	$('.booking-decline-btn').click(function () {
		$('#declineBookingDialog').modal()
	})

	// to change or cancel
	$('.upcomming-change-or-cancel').click(function () {
		$('#chagneOrCancelDialog').modal()
	})

	// on change or cancel dialog box
	$('#chagneOrCancelDialogChangeReservation').on('click', function () {
    $('#bookingChangeRequestDialog').modal()
  })


	$('.showTipModal').on('click', function () {
    $('#sendTipDialog').modal()
  })

  $('#chagneOrCancelDialogCancelReservationBtn').on('click', function () {
	  $('#cancelSessionDialog').modal()
	})

	$('#send-tip-options .btn').click(function () {
		$('#send-tip-options .btn').removeClass('active')

		$(this).addClass('active')
	})

	var $rateYo = $(".rateYoInput").rateYo({
 		rating: 3,
 		ratedFill: "#f1c40f",
		normalFill: "#e4e4e4",
		onSet: function (){
			var rating = $rateYo.rateYo("rating");
			var input = document.getElementById("rateExperience");
		 	if (input) {
		 		input.value = rating;
		 		console.log(input.value);		 		
		 	}
		}
 	});
})
