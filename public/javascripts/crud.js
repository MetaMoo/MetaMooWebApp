$(function(){

$(document).on('click', '.edit_tr' , function() {
    var RowID = $(this).attr('id');
    $("#tag_"+RowID).hide();
    $("#note_"+RowID).hide();
    $("#tag_input_"+RowID).show();
    $("#note_input_"+RowID).show();
    //need to show delete button
    $("#delete_"+RowID).show();
});


$(document).on('change', '.edit_tr' , function() {
    var NewID = $(this).attr('id');

	var tag = $("#tag_input_"+NewID).val();
	var note = $("#note_input_"+NewID).val();

	var infoSend = {};
      infoSend['_id'] = NewID;
      infoSend['tag'] = tag;
      infoSend['note'] = note;

      if(tag.length>0 && note.length>0){
        $.post('/update', infoSend, function(data){
        }, "json");
      } else {
        alert('Enter something.');
      };

      $( "#searchButton" ).trigger( "click" );
});

  //Edit input box click action
  
  $(".editbox").mouseup(function() 
  {
    return false
  });

  //Outside click action

  $(document).mouseup(function()
  {
    $(".delete_button").hide();
    $(".editbox").hide();
    $(".texty").show();
  });


  $(document).on('click', '.delete_button' , function() {
    var RowID = $(this).closest('tr').attr('id');
    var infoSend = {};
	var r = confirm("Are you sure you want to delete this snippet? There's no undo.");
		if (r == true) {
      		infoSend['_id'] = RowID;
      		$.post('/delete', infoSend, function(data){
        }, "json");
		} else {
    		return false
    	};
    $( "#searchButton" ).trigger( "click" );

  });


});