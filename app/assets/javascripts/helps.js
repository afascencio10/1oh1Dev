jQuery(document).ready(function($) {
  var calendar = document.querySelector('.timeline-calendar')
  if (!calendar) return
	var timelineCalendar = new FullCalendar.Calendar(calendar, {
    header: {
      left: '',
      center: '',
      right: ''
    },
    plugins: [ 'dayGrid', 'timeGrid', 'interaction' ],
    defaultView: 'timeGridDay',
    nowIndicator: true,
    allDaySlot: false,
    contentHeight: 800,
    selectable: true,
    selectHelper: true,
    eventOverlap: false,
    select: function(info) {
      var calendarViewType = timelineCalendar.view.type
      var milliseconds = moment.utc(moment(info.end).diff(moment(info.start))).valueOf()
      var minutes = Math.floor(milliseconds / 60000)
      var maximumSlotMinutes = 0

      if (calendarViewType === 'timeGridDay') maximumSlotMinutes = 30
      else maximumSlotMinutes = 1440

      if (minutes > maximumSlotMinutes) {
        timelineCalendar.unselect()
      } else {
        // check for time conflicts
        var events = timelineCalendar.getEvents()
        var hasConflict = events.some(function (event) {
          return hasOverlap(event.start.getTime(), info.start.getTime(), event.end.getTime(), info.end.getTime())
        })

        if (hasConflict) {
          // show conflict error dialog
          $('#newEventTimeConflict').modal()
          return
        }
        console.log(info)
        // set modal content
        if (info.allDay) {
          $('#newEventTimeText').text(moment(info.start).format('D MMM YYYY') + ' (All day)')
        } else {
          $('#newEventTimeText').text(moment(info.start).format('hh:mm A') + ' - ' + moment(info.end).format('hh:mm A'))
        }

        $('#newEventDateText').text(moment(info.start).format('D MMM YYYY'))

        // show modal
        $('#newEventDialog').modal()
      }
    },
    events: [{
      title: 'Meeting',
      start: '2019-09-19T10:30:00',
      end: '2019-09-19T11:30:00',
      className: 'unavailable',
      extendedProps: {
        eventDescription: 'this is a short description',
        eventName: 'Jordan',
        hasStar: true
      }
    }, {
      title: "Developer's feedback",
      start: '2019-09-19T12:00:00',
      end: '2019-09-19T13:00:00',
      className: 'pending',
      extendedProps: {
        eventDescription: 'this is a short review',
        eventName: 'Jordan'
      }
    }, {
      title: "Call with Stefano",
      start: '2019-09-19T13:30:00',
      end: '2019-09-19T14:30:00',
      className: 'guiding',
      extendedProps: {
        eventDescription: 'this is a short review',
        eventName: 'Jordan'
      }
    }, {
      title: "Exploring with Stefano",
      start: '2019-09-19T15:30:00',
      end: '2019-09-19T16:30:00',
      className: 'exploring',
      extendedProps: {
        eventDescription: 'this is a short review',
        eventName: 'Jordan'
      }
    }],
    eventRender: function (info) {
      var description = info.event.extendedProps.eventDescription
      var eventName = info.event.extendedProps.eventName
      var hasStar = info.event.extendedProps.hasStar

      if (description) {
        var descriptionEl = document.createElement('div')
        descriptionEl.innerText = description
        descriptionEl.classList.add('fc-event-description')
        info.el.append(descriptionEl)
      }
      if (eventName) {
        var eventNameEl = document.createElement('div')
        eventNameEl.innerText = eventName
        eventNameEl.classList.add('fc-event-name')
        info.el.append(eventNameEl)
      }
      if (hasStar) {
        var eventStarEl = document.createElement('div')
        eventStarEl.innerText = 'S'
        eventStarEl.classList.add('fc-event-star')
        info.el.append(eventStarEl)
      }
    }
  })

  timelineCalendar.render()

  // very custom calendar
  var veryCustomCalendar = document.querySelector('.very-custom-calendar')
  if (!veryCustomCalendar) return
  var veryCustomCalendar = new FullCalendar.Calendar(veryCustomCalendar, {
      plugins: [ 'dayGrid', 'interaction', 'moment' ],
      header: {
        left: '',
        center: '',
        right: ''
      },
      aspectRatio: 0.85,
      selectable: true,
      select: function(info) {
        if (moment.utc(moment(info.end).diff(moment(info.start))).format('D') > 2) { // disable multi select
          veryCustomCalendar.unselect()
        } else {
          timelineCalendar.gotoDate(info.start)
          setCurrentDateTitle(moment(info.start))
        }
     }
  })

  // render calendar
  veryCustomCalendar.render()

  // apply custom scroll bar
  var scrollContainer = document.querySelector('.months-wrap');
  var ps = new PerfectScrollbar(scrollContainer)

  // activate current month moment("12-25-1995", "MM-DD-YYYY")
  var currentDate = moment(veryCustomCalendar.getDate())
  var prevMonth = currentDate.format('M')

  activeSpecificMonth(prevMonth, true)
  setCurrentDateTitle(currentDate)

  // listeners
  $('.months-wrap .month').on('click', function () {
    var month = $(this).attr('id').replace('month-', '')
    var day = '1'
    var year = currentDate.format('Y')

    // go to specific month
    veryCustomCalendar.gotoDate(moment(month + "-" + day + "-" + year, "MM-DD-YYYY").format())

    activeSpecificMonth(month)
  })

  $('#daily').on('click', function () {
    timelineCalendar.changeView('timeGridDay')
  })
  $('#weekly').on('click', function () {
    timelineCalendar.changeView('dayGridWeek')
  })
  $('#monthly').on('click', function () {
    timelineCalendar.changeView('dayGridMonth')
  })
  
  // methods
  function activeSpecificMonth (currentMonth, scrollToThatMonth) {
    document.getElementById('month-' + prevMonth).classList.remove('active')

    document.getElementById('month-' + currentMonth).classList.add('active')

    prevMonth = currentMonth

    if (scrollToThatMonth) {
      var activeEl = document.querySelector('.months-wrap .active')
      activeEl.scrollIntoView()
    }
  }

  function setCurrentDateTitle (date) {
    var monthEl = document.querySelector('.very-custom-calendar-wrap .calendar-current-date .month-placeholder')
    var dayEl = document.querySelector('.very-custom-calendar-wrap .calendar-current-date .day-placeholder')

    monthEl.innerText = date.format('dddd .')
    dayEl.innerText = date.format('D MMM')
  }

  function hasOverlap (startDate1, startDate2, endDate1, endDate2) {
    return (startDate1 < endDate2 && startDate2 < endDate1)
  }
})
