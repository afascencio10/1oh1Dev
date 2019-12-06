jQuery(document).ready(function($) {

	// initiate select-languages-wrap
	initiateCustomCheckboxes()

	var exploreItemContainer = document.querySelector('#explore-item-container')
	var guidingItemContainer = document.querySelector('#guiding-item-container')
	var projectsContainer = document.querySelector('#projects-container')
	var calendarContainer = document.querySelector('#calendar-container')

	if (exploreItemContainer) new PerfectScrollbar(exploreItemContainer)
	if (guidingItemContainer) new PerfectScrollbar(guidingItemContainer)
	if (projectsContainer) new PerfectScrollbar(projectsContainer)
	if (calendarContainer) new PerfectScrollbar(calendarContainer)

	$('.date-picker').bootstrapMaterialDatePicker({
    weekStart: 0,
    time: false,
    format: 'D MMM YYYY'
  })

  var languages = 1;
  var objectLanguages = [];
	$('#addLanguageBtn').on('click', function () {
    var clonedSelect = $('#select-languages-wrap select').first().clone(false)
    clonedSelect.attr('id', 'language-'+languages);
		$('#select-languages-wrap').append(clonedSelect)
    languages += 1;
		clonedSelect.wrap('<div></div>')
  })

  $('.next-button').click(function(){
    objectLanguages[0] = $('#language').val();
    for (let i = 1; i <= languages-1; i++) {
      objectLanguages[i] = $('#language-'+i).val();
    }
    console.log(objectLanguages);
  })

	$('.addExploreBtn').on('click', function () {
		// alert("Clicked");
		$(this).removeClass('btn-success').addClass('btn-outline-dark').text('Added')

	})

	$('.recurringAddTimePicker').on('click', function () {
    addTimePicker($(this).parent().parent().find('.time-picker-wrap'))
  })

	function addSelectLangTemplate () {
		var clonedSelect = $('#select-languages-wrap select').first().clone(false)

		$('#select-languages-wrap').append(clonedSelect)

		clonedSelect.wrap('<div></div>')
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
