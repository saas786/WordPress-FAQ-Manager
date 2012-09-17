jQuery(document).ready(function($) {

//********************************************************
// change icon ID
//********************************************************

	$('div#icon-edit').attr('id','icon-faq-admin');

//********************************************************
// set default choice on dropdown
//********************************************************

	var htype = $('div.faq_form_options select#faq_htype').hasClass('default');
	
	if (htype === true)
		$('div.faq_form_options select.faq_htype option[value="h3"]').prop('selected',true);

//********************************************************
// remove caps and other junk from slug
//********************************************************

	$('input#faq_arch').keyup(function() {
		this.value = this.value.replace(/\d+/g, '');
	});


//********************************************************
// show / hide the speed option
//********************************************************

	$('input#faq_expand').each(function() { // for initial load
		var checkval = $(this).is(':checked');

		if (checkval === true)
			$('p.speedshow').show();

		if (checkval === false)
			$('p.speedshow').hide();

	});


	$('input#faq_expand').change( function() { // for value change
		var checkval = $(this).is(':checked');

		if (checkval === true)
			$('p.speedshow').slideToggle(200);

		if (checkval === false)
			$('p.speedshow').hide(200);
		
	});

//********************************************************
// remove non-numeric from speed
//********************************************************

	$('input#faq_exspeed').keyup(function () {
		var numcheck = $.isNumeric($(this).val() );

		if(numcheck === false) {
			this.value = this.value.replace(/[^0-9\.]/g,'');
			$(this).next('span.warning').remove();
			$(this).next('label').after('<span class="warning">No non-numeric characters allowed</span>');
		}

		if(numcheck === true)
			$(this).next('span.warning').remove();
	});

//********************************************************
// trigger checkbox on label
//********************************************************

	$('div.faq_form_options label[rel="checkbox"]').each(function() {
		$(this).click(function() {

			var check_me = $(this).prev('input');
			var is_check = $(check_me).is(':checked');

			if (is_check === false) {
				$(check_me).prop('checked', true);
				$(check_me).trigger('change');
			}

			if (is_check === true) {
				$(check_me).prop('checked', false);
				$(check_me).trigger('change');
			}

		});
	});

//********************************************************
// enable drag and drop sorting
//********************************************************

	var sortList = $('ul#custom-type-list');
 
	sortList.sortable({
		update: function(event, ui) {
			$('#loading-animation').show(); // Show the animate loading gif while waiting
 
			opts = {
				url: ajaxurl, // ajaxurl is defined by WordPress and points to /wp-admin/admin-ajax.php
				type: 'POST',
				async: true,
				cache: false,
				dataType: 'json',
				data:{
					action: 'save_sort', // Tell WordPress how to handle this ajax request
					order: sortList.sortable('toArray').toString() // Passes ID's of list items in	1,3,2 format
				},
				success: function(response) {
					$('div#message').remove();
					$('#loading-animation').hide(); // Hide the loading animation
					$('ul#custom-type-list').after('<div id="message" class="updated below-h2"><p>Menu order saved</p></div>');
					return;
				},
				error: function(xhr,textStatus,e) {  // This can be expanded to provide more information
					alert('There was an error saving the updates');
					$('#loading-animation').hide(); // Hide the loading animation
					return;
				}
			};
			$.ajax(opts);
		}
	});

});