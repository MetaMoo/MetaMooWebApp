
// JQuery function that gets info from route /searching passing along the
// string that user typed from the search box. The output is a table of data
// including the value of the search string itself.  Here "data" is the returned
// value from the /searching route. 
$(function(){
  $('#search').on('keyup',function(e){
    if(e.keyCode === 13) {
    var parameters = { search: $(this).val() };
      $.get( '/searching',parameters, function(data) {
        //$('#results').html(data);
        $('#resultsTable tr').remove();
        $('#resultsTable').append('<tr><th> Content </th> <th>Tag</th> <th>Note</th> <th>Source</th><th>Date</th></tr>');
        for (var h=0; h<data.length; h++){
          $('#resultsTable').append('<tr><td>'+data[h].content +'</td> <td>'+data[h].tag +'</td> <td>'+data[h].note +'</td> <td>'+data[h].source +'</td> <td>'+data[h].date +'</td> </tr>');
        }
      });
    };
  });
});