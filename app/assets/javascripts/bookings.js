$(document).on('turbolinks:load', function() {
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
			$("#approve_booking_id").val($(this).attr("id"));
			var dateInfo = getBookingInfo($(this).attr("id"));
			var classesDateInfo = {
				date:".today-placeholder",
				start_time:".start-time-placeholder",
				end_time:".end-time-placeholder",
				name:".nameCompanionDialog",
				subject:".subjectSessionDialog"
			};
			showBookingInfo(dateInfo, classesDateInfo)
			$('#bookingApproveDialog').modal();
	});

	function getBookingInfo(id){
		var startSelector = "#infoBooking-"+id+" .{_class} time";
		var dateInfo = {
			date:getLabel("date",startSelector),
			start_time:getLabel("start_time",startSelector),
			end_time:getLabel("end_time",startSelector),
			name:$("#nameBooking-"+id).html(),
			subject:$("#categoryBooking-"+id).html()
		};
		console.log(dateInfo);
		function getLabel(classTime,startSelector){
			var selector = (""+startSelector).replace("{_class}",classTime);
			return $(selector).attr("aria-label");
		};
		return dateInfo;
	}

	function showBookingInfo(dateInfo, classesInfo){
		//dateInfo and classesInfo should match keys
		Object.keys(dateInfo).forEach(key=>{
			$(classesInfo[key]).each(function(index){
				$(this).html(dateInfo[key]);
			});
		});
		/*$(classesInfo.date).each(function(index){
			$(this).html(dateInfo.date);
		});
		$(classesInfo.start_time).each(function(index){
			$(this).html(dateInfo.start_time);
		});
		$(classesInfo.end_time).each(function(index){
			$(this).html(dateInfo.end_time);
		});*/
	}


	$(document).on("click", ".booking-decline-btn", function(e) {
			$("#decline_booking_id").val($(this).attr("id"))
			$('#declineBookingDialog').modal()
	});

	$(document).on("click", ".upcomming-change-or-cancel", function(e) {
			$("#change_booking_id").val($(this).attr("id"))
			$("#cancel_booking_id").val($(this).attr("id"))
			var dateInfo = getBookingInfo($(this).attr("id"));
			var classesDateInfo = {
				date:".today-placeholder",
				start_time:".start-time-placeholder",
				end_time:".end-time-placeholder",
				name:".nameCompanionDialog",
				subject:".subjectSessionDialog"
			};
			showBookingInfo(dateInfo, classesDateInfo);
			$('#chagneOrCancelDialog').modal()
	});

	// on change or cancel dialog box
	$(document).on("click", "#chagneOrCancelDialogChangeReservation", function(e) {
			$('#bookingChangeRequestDialog').modal()
	});

	$(document).on("click", "#chagneOrCancelDialogCancelReservationBtn", function(e) {
			$('#cancelSessionDialog').modal()
	});

	$(document).on("click", ".showTipModal", function(e) {
		$("#send_tip_booking").val($(this).attr("id"))
		$('#sendTipDialog').modal()
	});

	$('#send-tip-options .btn').click(function () {
		$('#send-tip-options .btn').removeClass('active')
		//write code for selecting coins value from #sendTipDialog into a hidden input named "tip_coins"
		$(this).addClass('active')
	})

// block of code for rating the user after sessions
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


 	/*
	** Read te search value and change the beahivor
	*/
	// var URLsearchBooking = window.location.href;
	// URLsearchBooking = URLsearchBooking.split("#");
	// $( document ).ready(function() {
	// 	switch(URLsearchBooking[1]){
	// 		case "pending":
	// 			$('.tab1-tabBooking').trigger( "click" );
	// 		break;
	// 		case "upcoming":
	// 			$('.tab2-tabBooking').trigger('click');
	// 		break;
	// 		case "completed":
	// 			$('.tab3-tabBooking').trigger( "click" );
	// 		break;
	// 		case null || "" || undefined:
	// 			$('.tab1-tabBooking').trigger( "click" );
	// 		break;
	// 	}
	// });
	// $('.tab1-tabBooking').click(function(){
	// 	var pathname = window.location.pathname;
	// 	history.pushState(null, "", pathname+'#'+"pending");
	// })
	// $('.tab2-tabBooking').click(function(){
	// 	var pathname = window.location.pathname;
	// 	history.pushState(null, "", pathname+'#'+"upcoming");
	// })
	// $('.tab3-tabBooking').click(function(){
	// 	var pathname = window.location.pathname;
	// 	history.pushState(null, "", pathname+'#'+"completed");
	// })



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
			updateUIMoreLess(params);
		}
		function updateUIMoreLess(params){
			if(showMoreLessInfo[params.name].totalItems==0){
				$(params.idShowMore).css({opacity:0, cursor:"default"});
				$(params.idShowLess).css({opacity:0, cursor:"default"});
				$(params.idMessage).css({opacity:0, cursor:"default"});
			}else{
				$(params.idShowMore).css({opacity:1, cursor:"pointer"});
				$(params.idShowLess).css({opacity:1, cursor:"pointer"});
				$(params.idMessage).css({opacity:1, cursor:"pointer"});
				if(showMoreLessInfo[params.name].showItems <= 5){
					$(params.idShowLess).css({opacity:0, cursor:"default"});
				}

				if(showMoreLessInfo[params.name].showItems >= showMoreLessInfo[params.name].totalItems){
					$(params.idShowMore).css({opacity:0, cursor:"default"});
				}
			}
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

 	var paramsUpcomingBookings = {
 		idMainDiv: "#mainUpcomingBookings",
 		idMessage: "#upcomingBookingsMessage",
 		idShowMore:"#moreUpcomingBookings",
 		idShowLess:"#lessUpcomingBookings",
 		classItem:".upcomingBookingsItem",
 		name:"upcomingBookingsList"
 	};
 	showMoreAndLess(paramsUpcomingBookings);
 	var paramsPendingBookings = {
 		idMainDiv: "#mainPendingBookings",
 		idMessage: "#pendingBookingsMessage",
 		idShowMore:"#morePendingBookings",
 		idShowLess:"#lessPendingBookings",
 		classItem:".pendingBookingsItem",
 		name:"pendingBookingsList"
 	};
 	showMoreAndLess(paramsPendingBookings);
 	var paramsPreviousBookings = {
 		idMainDiv: "#mainPreviousBookings",
 		idMessage: "#previousBookingsMessage",
 		idShowMore:"#morePreviousBookings",
 		idShowLess:"#lessPreviousBookings",
 		classItem:".previousBookingsItem",
 		name:"previousBookingsList"
 	};
 	showMoreAndLess(paramsPreviousBookings);

})
