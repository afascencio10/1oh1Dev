jQuery(document).ready(function($) {
	var bookingCalendar = document.querySelector('.booking-calendar') // .category-calendar
	if (!bookingCalendar) return
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
})
