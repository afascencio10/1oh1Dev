jQuery(document).ready(function($) {

	$('.tabLink').click(function(event){
	     var tabId = "#tab_" + $(this).attr("id");
	     $('.tabLink').removeClass("selected");
	     $('.tab').removeClass("selected");
	     $(this).addClass("selected");
	     $(tabId).addClass("selected");
	});
		$('#countries').change(function ()
			{
					var input_country = $(this);
					var states_of_country = $("#states-of-country");
					var cities_of_state = $("#cities-of-state");
					if($(this).val() == "")
					{
					states_of_country.html("");
					}
					else
					{
						$.ajax({
							url: '/states/' + $(this).val(),
							type: 'GET',
							success(data) {
								states_of_country.empty();
								var opt = '<option value="" selected="">Select Your State</option>';
								if(Object.keys(data).length==0){
									var cities_of_state = $("#cities-of-state");
									states_of_country.html('<option value="" selected="">No State found</option>');
									cities_of_state.html('<option value="" selected="">No Cities found</option>');
								} else
								{
									for (var key in data) {
									  opt += '<option value='+ key +'>' + data[key] + '</option>';
										states_of_country.html(opt);
									}
									var cities_of_state = $("#cities-of-state");
									cities_of_state.html('<option value="" selected="">Select Your State</option>');
								}
							}
							});
						}
			});

			$('#states-of-country').change(function ()
				{
						var input_state = $(this);
						var country = $("#countries");
						var cities_of_state = $("#cities-of-state");
						if($(this).val() == "")
						{
						cities_of_state.html("");
						}
						else
						{
							$.ajax({
								url: '/cities/' + $(this).val()+ '/'+ country.val(),
								type: 'GET',
								success(data) {
									cities_of_state.empty();
									var opt = '<option value="" selected="">Select Your City</option>';
									if(Object.keys(data).length == 0){
										cities_of_state.html('<option value="" selected="">No Cities found</option>');
									} else
									{
										data.forEach(function(i) {
											opt += '<option value="'+ i +'">' + i + '</option>';
											cities_of_state.html(opt);
										});
									}
								}
								});
							}
				});
})
