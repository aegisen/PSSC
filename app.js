$(document).ready(function() {
  function cbDropdown(column) {
    return $('<ul>', {
      'class': 'cb-dropdown'
    }).appendTo($('<div>', {
      'class': 'cb-dropdown-wrap'
    }).appendTo(column));

  }

  $('#data_table').DataTable({
    bAutoWidth: false, 
    aoColumns : [
      { sWidth: '20%' }, //org
      { sWidth: '10%' }, //filename
      { sWidth: '12%' }, //year
      { sWidth: '13%' }, //edition
      { sWidth: '20%' }, //author
      { sWidth: '25%' }, //tags
    ],
    responsive: true,
    columnDefs: [
      {
        targets: 0,
        render: function (data, type, row) {
          if (type === 'filter') {
            if ( data.includes( 'href' ) ) {
              return $(data).text();
            }
            return data;
          }
          return data;
        }
      }
    ],
    initComplete: function() {
      this.api()
      .columns()
      .every(function(index) 
      {
        if (index != 1 && index != 5 && index != 4)
            {
                var column = this;
                var ddmenu = cbDropdown($(column.header()))
                  .on('change', ':checkbox', function() {
                    var active;
                    var vals = $(':checked', ddmenu).map(function(index, element) {
                      active = true;
                      return $.fn.dataTable.util.escapeRegex($(element).val());
                    }).toArray().join('|');
        
                    column
                      .search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                      .draw();
        
                    // Highlight the current item if selected.
                    if (this.checked) {
                      $(this).closest('li').addClass('active');
                    } else {
                      $(this).closest('li').removeClass('active');
                    }
        
                    // Highlight the current filter if selected.
                    var active2 = ddmenu.parent().is('.active');
                    if (active && !active2) {
                      ddmenu.parent().addClass('active');
                    } else if (!active && active2) {
                      ddmenu.parent().removeClass('active');
                    }
                  });
        
                //. Keep track of the select options to not duplicate
                var selectOptions = [];
                column.data().unique().sort().each(function(d, j) {
                  
                  // Use jQuery to get the text if the cell is a link
                  if ( d.includes( 'href' ) ) {
                    d = $(d).text();
                  }
                  
                  if ( ! selectOptions.includes( d ) ) {
                    
                    selectOptions.push( d );
                    
                    var // wrapped
                    $label = $('<label>'),
                        $text = $('<span>', {
                          text: d
                        }),
                        $cb = $('<input>', {
                          type: 'checkbox',
                          value: d
                        });
        
                    $text.appendTo($label);
                    $cb.appendTo($label);
        
                    ddmenu.append($('<li>').append($label));
                  }
                });
            }
            if (index == 5 || index == 4)
              {
                var column = this;
                var ddmenu = cbDropdown($(column.header()))
                  .on('change', ':checkbox', function() {
                    var active;
                    var vals = $(':checked', ddmenu).map(function(index, element) {
                      active = true;
                      return $.fn.dataTable.util.escapeRegex($(element).val());
                    }).toArray().join('|');
      
                    column
                      .search(vals.length > 0 ? '\\b(' + vals + ')\\b' : '', true, false) // Regex search for exact matches
                      .draw();
      
                    // Highlight the current item if selected
                    if (this.checked) {
                      $(this).closest('li').addClass('active');
                    } else {
                      $(this).closest('li').removeClass('active');
                    }
      
                    // Highlight the current filter if selected
                    var active2 = ddmenu.parent().is('.active');
                    if (active && !active2) {
                      ddmenu.parent().addClass('active');
                    } else if (!active && active2) {
                      ddmenu.parent().removeClass('active');
                    }
                  });
      
                var selectOptions = [];
                column.data().unique().sort().each(function(d, j) {
                  // Assuming 'd' contains comma-separated tags
                  var tags = d.split(', ');
                  tags.forEach(function(tag) {
                    if (!selectOptions.includes(tag.trim())) {
                      selectOptions.push(tag.trim());
                      var $label = $('<label>'),
                        $text = $('<span>', {
                          text: tag.trim()
                        }),
                        $cb = $('<input>', {
                          type: 'checkbox',
                          value: tag.trim()
                        });
      
                      $text.appendTo($label);
                      $cb.appendTo($label);
      
                      ddmenu.append($('<li>').append($label));
                    }
                  });
                });
              }
       
      });
    }
  });
});

