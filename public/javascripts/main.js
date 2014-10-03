
// JQuery function that gets info from route /searching passing along the
// string that user typed from the search box. The output is a table of data
// including the value of the search string itself.  Here "data" is the returned
// value from the /searching route. 
$(function(){

  $('#searchButton').on('click',function(e){
    if(e.type === 'click') {
    var parameters = { search: $('#search').val() };
      $.get( '/searching',parameters, function(data) {
        //$('#results').html(data);
        $('#resultsTable tr').remove();
        $('#resultsTable').append('<tr><th></th><th> Highlighted Content </th> <th>Tag</th> <th>Note</th> <th>Source</th><th>Date</th></tr>');
        for (var h=0; h<data.length; h++){
          $('#resultsTable').append('<tr class="edit_tr" id="'+data[h]._id+'"><td><button type="button" class="btn btn-xs btn-danger delete_button" id="delete_'+data[h]._id+'"> <span class="glyphicon glyphicon-remove"></span></button> &nbsp</td> <td > '+data[h].content +'</td> <td class="edit_td"><span class="texty" id="tag_'+data[h]._id+'">'+data[h].tag +'</span><input type="text" class="editbox" id="tag_input_'+data[h]._id+'" value="'+data[h].tag+'"</td> <td class="edit_td"><span class="texty" id="note_'+data[h]._id+'">'+data[h].note +'</span><input type="text" class="editbox" id="note_input_'+data[h]._id+'" value="'+data[h].note+'"</td><td>'+ '<a target="_blank" href="'+data[h].source+'">'+data[h].source+'</a>' +'</td> <td>'+data[h].date +'</td> </tr>');
        };
      });
    };
  });

  $('#search').on('keyup',function(e){
    if(e.keyCode === 13) {
      $('#searchButton').click();
    };
  });

  $('#twitterShare').on('click',function(e){
    if(e.type === 'click'){
      var tagValue = $('#search').val() ;
      $('#twitterShare').attr("href", "https://twitter.com/home?status=Look%20what%20I%20connected!%20%23"+tagValue+"%20@getmetamoo");
    };
  });

  $('#showAll').on('click',function(e){
    if(e.type === 'click'){
     var parameters = { search: "" };
      $.get( '/searching',parameters, function(data) {
        //$('#results').html(data);
        $('#resultsTable tr').remove();
       $('#resultsTable').append('<tr><th></th><th> Highlighted Content </th> <th>Tag</th> <th>Note</th> <th>Source</th><th>Date</th></tr>');
        for (var h=0; h<data.length; h++){
          $('#resultsTable').append('<tr class="edit_tr" id="'+data[h]._id+'"><td><button type="button" class="btn btn-xs btn-danger delete_button" id="delete_'+data[h]._id+'"> <span class="glyphicon glyphicon-remove"></span></button> &nbsp</td> <td > '+data[h].content +'</td> <td class="edit_td"><span class="texty" id="tag_'+data[h]._id+'">'+data[h].tag +'</span><input type="text" class="editbox" id="tag_input_'+data[h]._id+'" value="'+data[h].tag+'"</td> <td class="edit_td"><span class="texty" id="note_'+data[h]._id+'">'+data[h].note +'</span><input type="text" class="editbox" id="note_input_'+data[h]._id+'" value="'+data[h].note+'"</td><td>'+ '<a target="_blank" href="'+data[h].source+'">'+data[h].source+'</a>' +'</td> <td>'+data[h].date +'</td> </tr>');
        }
      }); 
    }
  });


});


