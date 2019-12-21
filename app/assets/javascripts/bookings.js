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
	$(document).on("click", ".booking-approve-btn", function(e) {
			$("#approve_booking_id").val($(this).attr("id"))
			$('#bookingApproveDialog').modal()
	});
	$(document).on("click", ".booking-decline-btn", function(e) {
			$("#decline_booking_id").val($(this).attr("id"))
			$('#declineBookingDialog').modal()
	});

	$(document).on("click", ".upcomming-change-or-cancel", function(e) {
			$("#change_booking_id").val($(this).attr("id"))
			$("#cancel_booking_id").val($(this).attr("id"))
			$('#chagneOrCancelDialog').modal()
	});

	// on change or cancel dialog box
	$(document).on("click", "#chagneOrCancelDialogChangeReservation", function(e) {
			$('#bookingChangeRequestDialog').modal()
	});

	$(document).on("click", "#chagneOrCancelDialogCancelReservationBtn", function(e) {
			$('#cancelSessionDialog').modal()
	});

	$('.showTipModal').on('click', function () {
    $('#sendTipDialog').modal()
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
