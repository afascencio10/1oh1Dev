jQuery(document).ready(function($) {
	var currentPage = 1
	var maxPage = 6

	// initiate select-languages-wrap
	activatePage(currentPage)
	initiateCustomCheckboxes()
	new PerfectScrollbar(document.querySelector('#explore-item-container'))
	new PerfectScrollbar(document.querySelector('#guiding-item-container'))
	new PerfectScrollbar(document.querySelector('#projects-container'))
	new PerfectScrollbar(document.querySelector('#calendar-container'))
	$('.date-picker').bootstrapMaterialDatePicker({
     weekStart: 0,
     time: false,
     format: 'D MMM YYYY'
   })
	// listeners
	$('#nextPageBtn').on('click', function () {
		nextPage()
	})
	$('#prevPageBtn').on('click', function () {
		prevPage()
	})
	$('#last-page-back').on('click', function () {
		prevPage()
	})

	$('#addLanguageBtn').on('click', function () {
		addSelectLangTemplate()
	})

	$('.addExploreBtn').on('click', function () {
		alert("Clicked");
		$(this).removeClass('btn-success').addClass('btn-outline-dark').text('Added')
	})

	$('.recurringAddTimePicker').on('click', function () {
    addTimePicker($(this).parent().parent().find('.time-picker-wrap'))
  })
	// method
	function nextPage () {
		currentPage += 1

		$('#prevPageBtn').removeClass('d-none')

		if (currentPage === maxPage) {
			$('#action-buttons').addClass('d-none')
			$('#nextPageBtn').addClass('d-none')
		}

		activatePage(currentPage)
	}
	function prevPage () {
		currentPage -= 1

		$('#nextPageBtn').removeClass('d-none')
		$('#action-buttons').removeClass('d-none')

		if (currentPage === 1) {
			$('#prevPageBtn').addClass('d-none')
		}

		activatePage(currentPage)
	}
	function activatePage (pageNumber) {
		for (var i = maxPage; i >= 1; i--) {
			$('.page-' + i).addClass('d-none')
		}

		$('.page-' + pageNumber).removeClass('d-none')

		activateNavigation(pageNumber)
	}

	function addSelectLangTemplate () {
		var clonedSelect = $('#select-languages-wrap select').first().clone(false)

		$('#select-languages-wrap').append(clonedSelect)

		clonedSelect.wrap('<div></div>')
	}

	function activateNavigation (pageNumber) {
		$('.navigation-item-wrap').removeClass('active')
		for (var i = pageNumber; i >= 1; i--) {
			$('.navigation-item-wrap-' + i).addClass('active')
		}
	}

	function initiateCustomCheckboxes () {
    var checkboxButtons = $('.checkbox-switcher') // let btn = document.getElementById("btn")
    checkboxButtons.each(function (index, el) {
      el = $(el) // button

      var checkbox = el.find('.checkbox')
      var rect1 = el.find('.rect-1')
      var rect2 = el.find('.rect-2')

      el.mouseup(function () {
        el.toggleClass('h_btn')
        checkbox.toggleClass('h_cb')
        rect1.toggleClass('h_rects')
        rect2.toggleClass('h_rects')

        // find timepicker wrap
        var timePickerWrap = el.parent().parent().parent().find('.time-picker-wrap')

        timePickerWrap.toggleClass('d-none')
        timePickerWrap.next().toggleClass('d-none')

        if (!timePickerWrap.children().length) {
          addTimePicker(timePickerWrap)
        }
      })
    })
  }

  function addTimePicker (el) {
    var template = `
      <div>
        <input type="text" value="" class="time-picker gray-input"/>

        <span class="mx-2">to</span>

        <input type="text" value="" class="time-picker gray-input"/>

        <button type="button" class="d-inline-block btn btn-link btn-link-close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`

    var element = document.createElement('div')

    element.innerHTML = template

    $(el).append(element)

    $(el).find('.time-picker').mdtimepicker()

    $(element).find('.btn-link-close').on('click', function () {
      $(this).parent().parent().remove()
    })
  }
})
