$(document).on("turbolinks:load",function(){function e(e,t,i,r,a){r&&a&&(r.text=JSON.stringify(a));var o=document.getElementById(t);if(o){var l,s=Array.from(o.options).filter(function(n){if(e===n.value)return n});s[0]&&(l=s[0].text),n(i,l,e,null,c(a,r))}}function n(e,n,i,r,c,a){var o=$(g);a&&-1!==a.findIndex(function(e){return e===i})||(o.find(".base-chips-name").text(n),o.find("button").click(function(){t($(this),i,c)}),e.append(o),r&&r(i))}function t(e,n,t){t&&t(n),e.parent().remove()}function i(e,t,i,r,c){var a=document.getElementById(t);a&&n(e,a.selectedOptions[0].text,a.selectedOptions[0].value,i,r,c)}function r(e,n){return function(t){e.push(t),console.log(e),n&&(n.value=JSON.stringify(e))}}function c(e,n){return function(t){e.splice(e.findIndex(function(e){return e===t}),1),console.log(e),n&&(n.text=JSON.stringify(e),console.log(n.text))}}function a(){$(".checkbox-switcher").each(function(e,n){var t=(n=$(n)).find(".checkbox"),i=n.find(".rect-1"),r=n.find(".rect-2");n.mouseup(function(){n.toggleClass("h_btn"),t.toggleClass("h_cb"),i.toggleClass("h_rects"),r.toggleClass("h_rects");var e=n.parent().parent().parent().find(".time-picker-wrap");e.toggleClass("d-none"),e.next().toggleClass("d-none"),e.children().length||o(e)})})}function o(e){var n='\n      <div class="time-picker-row">\n        <input type="text" value="" class="time-picker gray-input time-picker-start"/>\n\n        <span class="mx-2">to</span>\n\n        <input type="text" value="" class="time-picker gray-input time-picker-end"/>\n\n        <button type="button" class="d-inline-block btn btn-link btn-link-close" aria-label="Close">\n          <span aria-hidden="true">&times;</span>\n        </button>\n      </div>',t=document.createElement("div");t.innerHTML=n,$(e).append(t),$(e).find(".time-picker").mdtimepicker(),$(t).find(".btn-link-close").on("click",function(){$(this).parent().parent().remove()})}function l(e,n,t){u[e]||(u[e]=[]),u[e].push([n,t])}function s(){return u={},$(".recurring-calendar-row").each(function(e,n){if(!(n=$(n)).find(".checkbox-switcher .checkbox").hasClass("h_cb")){var t=n.find(".time-picker-row"),i=n.find(".recurring-day-name").text().trim();t.each(function(e,n){var t=(n=$(n)).find(".time-picker-start").val(),r=n.find(".time-picker-end").val();l(i,t,r)})}}),$("#availabilty").val(JSON.stringify(u)),u}var u={},d=document.getElementById("profile-calendar-hidden-recurring-unavailable"),f=[],p=document.getElementById("check"),g='    <div class="base-chips d-inline-block">      <span class="base-chips-name"></span>      <button type="button" class="close">        <span aria-hidden="true">&times;</span>      </button>    </div>    ';a(),f.forEach(function(n){e(n,"profile-builder-languages-select",$("#profile-builder-languages"),p,f)});var m=document.querySelector("#explore-item-container"),b=document.querySelector("#guiding-item-container"),k=document.querySelector("#projects-container"),h=document.querySelector("#calendar-container");m&&new PerfectScrollbar(m),b&&new PerfectScrollbar(b),k&&new PerfectScrollbar(k),h&&new PerfectScrollbar(h),$(".date-picker").bootstrapMaterialDatePicker({weekStart:0,time:!1,format:"D MMM YYYY"}),$("#addLanguageBtn").on("click",function(){i($("#profile-builder-languages"),"profile-builder-languages-select",r(f,p),c(f,p),f)}),$(".recurringAddTimePicker").on("click",function(){o($(this).parent().parent().find(".time-picker-wrap"))}),$("#availabiltyNextBtn").on("click",function(){d&&(d.text=JSON.stringify(s())),console.log(s())})});