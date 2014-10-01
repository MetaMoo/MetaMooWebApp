$(document).ready(function(){
	$('#opener').on('click', function() {		
		var panel = $('#slide-panel');
		if (panel.hasClass("visible")) {
			panel.removeClass('visible').animate({'margin-left':'-300px'});
      $('#content').css({'margin-right':'0px'});
		} else {panel.addClass('visible').animate({'margin-left':'0px'});
      $('#content').css({'margin-right':'-300px'});
		}	
	  $.get( '/alltags',function(data) {

	    var tagsArray = [];
	    for (var h=0; h<data.length; h++){
	      tagsArray.push(data[h].tag);
	    };
	    var uniqueTags = [];
		// Removes duplicates.
		$.each(tagsArray, function(i, el){
    		if($.inArray(el, uniqueTags) === -1) uniqueTags.push(el);
		});
		$('#alltags').empty();
	    for (var hh=0; hh<uniqueTags.length; hh++){
	    $('#alltags').append("<p>"+uniqueTags[hh]+"</p>");
	    };
	  });

		return false;	

	});
});