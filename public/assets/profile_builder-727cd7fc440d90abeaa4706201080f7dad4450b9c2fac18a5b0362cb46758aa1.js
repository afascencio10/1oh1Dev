jQuery(document).ready(function($) {
  var profileBuilderLanguages = ['eng']
  var profileBuilderLanguagesHiddenElm = document.getElementById('check')

  var chipTemplate = '\
    <div class="base-chips d-inline-block">\
      <span class="base-chips-name"></span>\
      <button type="button" class="close">\
        <span aria-hidden="true">&times;</span>\
      </button>\
    </div>\
    '
 // initiate select-languages-wrap
 initiateCustomCheckboxes()
 // initiate languages
 profileBuilderLanguages.forEach(function (language) {
  generateDefaultChipForSelectElement(
    language,
    'profile-builder-languages-select',
    $('#profile-builder-languages'),
    profileBuilderLanguagesHiddenElm,
    profileBuilderLanguages
  )
 })

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

  function generateDefaultChipForSelectElement (value, selectId, wrapper, hiddenInput, storage) {
    if (hiddenInput && storage) {
      hiddenInput.text = JSON.stringify(storage)
    }
    var select = document.getElementById(selectId)
    var selectItem = Array.from(select.options).filter(function (option) {
      if (value === option.value) return option
    })
    var selectText
    if (selectItem[0]) {
      selectText = selectItem[0].text
    }
    addChips(
      wrapper,
      selectText,
      value,
      null,
      removeChipFromArray(storage, hiddenInput)
    )
  }
  function addChips(wrapper, chipName, chipValue, addClb, removeClb, storage) {
      var element = $(chipTemplate)
      if (storage) {
        if (storage.findIndex(function (item) {
          return item === chipValue
        }) !== -1) return
      }

      element.find('.base-chips-name').text(chipName)
      element.find('button').click(function () {
        removeChips($(this), chipValue, removeClb)
      })

      wrapper.append(element)
      if (addClb) addClb(chipValue)
  }

  function removeChips (chip, chipName, clb) {
    if (clb) clb(chipName)

    chip.parent().remove()
  }

  function addSelectedItemAsChips(wrapper, selectId, addClb, removeClb, storage) {
    var select = document.getElementById(selectId)
    if (!select) return

    var selectText = select.selectedOptions[0].text
    var selectValue = select.selectedOptions[0].value

    addChips(wrapper, selectText, selectValue, addClb, removeClb, storage)
  }

  function storeChipInArray (array, hiddenInput) {
    return function (chipName) {
      array.push(chipName)
      console.log(array)
      if (hiddenInput) {
        hiddenInput.text = JSON.stringify(array)
        console.log(hiddenInput.text)
      }
    }
  }

  function removeChipFromArray (array, hiddenInput) {
    return function (chipName) {
      array.splice(array.findIndex(function (item) {
        return item === chipName
      }), 1)

      console.log(array)
      if (hiddenInput) {
        hiddenInput.text = JSON.stringify(array)
        console.log(hiddenInput.text)
      }
    }
  }

  $('#addLanguageBtn').on('click', function () {
    addSelectedItemAsChips(
      $('#profile-builder-languages'),
      'profile-builder-languages-select',
      storeChipInArray(profileBuilderLanguages, profileBuilderLanguagesHiddenElm),
      removeChipFromArray(profileBuilderLanguages, profileBuilderLanguagesHiddenElm),
      profileBuilderLanguages
    )
  })


  $('.next-button').on('click', function () {
  });

 

 $('.recurringAddTimePicker').on('click', function () {
    addTimePicker($(this).parent().parent().find('.time-picker-wrap'))
  })


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
;
