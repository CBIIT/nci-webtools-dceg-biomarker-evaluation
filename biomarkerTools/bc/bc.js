var uniqueKey = null;
var old_value = null;
var editing = false;
var row = null;
var col = null;
var validPrevValue = false;
var thisTool;
var inputElm;
var valuesFromFile = [];

function init_bc(){
  thisTool = $("#bc");
  inputElm = thisTool.find('#inputdata');
  thisTool.find("#errors").alert();
  thisTool.find('#errors').addClass("hide");
}

$(document).ready(function(){
  init_bc();

  bind_reference_row();
  bind_input();
  bind_calculate_button();
  thisTool.find('#inputdata').on('click', '.remove_row_button', function(e) {
    e.preventDefault();
    remove_row($(this));
  });
  bind_add_new_row();

  thisTool.find("#file_upload").on('change', uploading_csv);
  thisTool.find("#reset").on('click', reset_bc);
});

$('a[href="#bc"]').on('shown.bs.tab',function(e){
  thisTool = $("#bc");
});

$('a[href="#bc"]').on('hide.bs.tab',function(e){
  thisTool.find('#errors').addClass("hide");
});

$('a[href="#bc"]').on('click', function (e) {
  init_bc();
});

function uploading_csv(e) {
  thisTool.find('#errors').addClass("hide");

  var files = e.target.files;

  if(files.length > 0){
    validate_csv(files[0]);
  }
}

function validate_csv(file){

  var file_types = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv" ];
 
  var correct_type = ($.inArray(file.type, file_types) > -1) ? true : false;

  if(correct_type) {
   
    if ( window.FileReader ) {
      var fr = new FileReader();

      fr.onload = function(e) {
        var valid = false;
        var txt = e.target.result;
        var lines = txt.split("\n").filter(Boolean);

        if (lines.length > 0) numberOfCols = lines[0].split(",").length;
        numberOfRows = 0;

        if(numberOfCols != 2) {
          display_errors("2 columns of data expected in CSV file. Found " + numberOfCols + " columns.");
        }
        else {
          valuesFromFile = [];

         
          for (var count = 1; count < 11;count++) {
            var arr = lines[count].split(",");
            if(arr.length > 1) {
              if (!isNaN(arr[0]) && !isNaN(arr[1]) ) {
                valuesFromFile.push(arr);
                numberOfRows++;
              }
              else {
                var error_msg = "Only decimal values are expected. Found incorrect data type in file. Either '" +
                  arr[0] + "' or '" + arr[1] + "' is not a decimal value";
                display_errors(error_msg);
                break;
              }
            }
          }
        }

        if(valuesFromFile.length == 10) {
          valid = true;
         
          inputElm.children(':not(.non-data-row)').each(function(i, row) {
            $(row).remove();
          });

         
          valuesFromFile.forEach(import_data_row);
        }
        else {
          display_errors("There was a problem importing your file.");
        }

      };

      fr.readAsText(file);
    }
  }
  else{
    display_errors(["Incorrect file type detected. Please upload a csv file."]);
  }
  return false;
}

function bind_add_new_row(){
  thisTool.find('#new_row_button').click(function(){
    add_new_row();
  });
}
function bind_calculate_button(){
  thisTool.find('#calculate_button').click(function(){
    do_calculation();
  });
}
function bind_reference_row(){
  thisTool.find('.reference').click(function(e){
    var row, col;
    row = $(this).attr('row');
    col = $(this).attr('col');
    var oldReference = $(this).html("<img src='/common/images/checkbox.png' alt='check'/>")
      .siblings().last().empty().html('&nbsp;')
      .parent().addClass('reference_row')
      .siblings('.reference_row').removeClass('reference_row');
    oldReference.children('.reference').html("<a href='javascript:void(0);'><img src='/common/images/uncheckbox.png' alt='Click to set this as the reference row'/></a>");
    if (oldReference.parent().children().length > 4) {
      oldReference.children().last().empty().html("<BUTTON class='remove_row_button'><span class='text'>Remove</span><span class='glyphicon glyphicon-minus-sign'></span></BUTTON>");
    }
  });
}
function bind_input() {
    thisTool.find('.input_field').click(function (e) {
        var row, col, val, inp;
        if (!editing) {
            row = $(this).attr('row');
            col = $(this).attr('col');
            val = $(this).text();
            old_value = val;
            inp = $("<INPUT id='new_value' type='text' size='5' class='new_value' value=''></INPUT>");
            $(this).empty();
            $(this).append(inp);
            bind_text_change(inp);
            inp.focus();
            editing = true;
        }
    });

    thisTool.find('.input_field, .input_field a').on("focus", function (e) {
        var row, col, val, inp;
        if (!editing) {
            row = $(this).attr('row');
            col = $(this).attr('col');
            val = $(this).text();
            old_value = val;
            inp = $("<INPUT id='new_value' type='text' size='5' class='new_value' value=''></INPUT>");
            $(this).empty();
            $(this).append(inp);
            bind_text_change(inp);
            inp.focus();
            editing = true;
        }
    });
}

function bind_text_change(inp){
  inp.on('blur', function(e){
    var $this, new_value;
    $this = $(this);
    new_value = thisTool.find('#new_value').val();
    change_value($this, new_value);
  });
  inp.on('keypress', function(e){
    var $this, new_value;
    $this = $(this);
    if (e.which === 13) {
      new_value = thisTool.find('#new_value').val();
      change_value($this, new_value);
    }
  });
}
function change_value(field, new_value){

  if (!new_value || new_value === '') {
    field.parent().empty().text(old_value);
    editing = false;
    return;
  }
  if (isNumberBetweenZeroAndOne(new_value)) {
    thisTool.find('#errors').addClass("hide");
    field.parent().empty().text(new_value);
    editing = false;
  } else {
    display_errors("Valid Values are between 0 and 1 inclusive, you tried: " + new_value);
    field.parent().empty().text(old_value);
    editing = false;
  }
}

function import_data_row(data, ind){
  var cell_1 = "<div class='table_row' row='" + ind + "'><div class='table_data emptyblock'></div>";
  var cell_2 = "<div class='table_data reference' row='" + ind + "' col='reference'><img src='/common/images/uncheckbox.png' alt='uncheck'/></div>";
  var cell_3 = "<div class='table_data input_field sensitivity' row='" + ind + "' col='sensitivity'>" + data[0] + "</div>" ;
  var cell_4 = "<div class='table_data input_field specificity' row='" + ind + "' col='specificity'>" + data[1] + "</div>";
  var cell_5 = "<div class='table_data emptyblock'>" +
                 "<BUTTON class='remove_row_button'><span class='text'>Remove</span><span class='glyphicon glyphicon-minus-sign'></span></BUTTON>" +
               "</div>";

  $(cell_1 + cell_2 + cell_3 + cell_4 + cell_5).insertBefore(inputElm.children().last());

  inputElm.children(":not(.non-data-row):first").addClass("reference_row").children().eq(1).empty().append("<img src='/common/images/checkbox.png' alt='check'/>").siblings().last().empty();
  bind_reference_row();
  bind_input();
}

function add_new_row(){
 
  var num_rows = inputElm.children(':not(.non-data-row)').length;
  var row_1 = "<div class='table_row' row='" + num_rows + "'><div class='table_data emptyblock'></div>";
  var row_2 = "<div class='table_data reference' row='" + num_rows + "' col='reference'><a href='javascript:void(0);'><img src='/common/images/uncheckbox.png' alt='uncheck'/></a></div>";
  var row_3 = "<div class='table_data input_field sensitivity' row='" + num_rows + "' col='sensitivity'><a href='javascript:void(0);'>&nbsp;</a></div>" ;
  var row_4 = "<div class='table_data input_field specificity' row='" + num_rows + "' col='specificity'><a href='javascript:void(0);'>&nbsp;</a></div>";
  var row_5 = "<div class='table_data emptyblock'>" +
                 "<BUTTON class='remove_row_button'><span class='text'>Remove</span><span class='glyphicon glyphicon-minus-sign'></span></BUTTON></div>";
  inputElm.children().last().before(row_1 + row_2 + row_3 + row_4 + row_5);
  if (num_rows === 2) {
    inputElm.children(':not(.non-data-row)').each(function(i, row){
      update_row_index(i, row);
      if (!$(this).hasClass('reference_row')) {
        $(this).children().last().empty().html("<BUTTON class='remove_row_button'><span class='text'>Remove</span><span class='glyphicon glyphicon-minus-sign'></span></BUTTON>");
      }
    });
  }
  bind_reference_row();
  bind_input();
}

function update_row_index(i, row){
  var ind = i + 1;
 
  $(row).attr("row", i);

  $(row).find("div:gt(0)").each(function(j, el){
    if($(el).attr('row') !== undefined){
      $(el).attr('row', i);
    }
  });
}

function remove_row(el){
  var row_to_remove = el.parent().parent().remove();
  var num_rows = inputElm.children('*:not(.non-data-row)').length;
  if (num_rows <= 2) {
    inputElm.find('.remove_row_button').remove();
  }
  inputElm.children(':not(.non-data-row)').each(update_row_index);
}

function do_calculation(){
 
  var promise;
  var refSens = "";
  var refSpec = "";
  var sensArray = "";
  var specArray = "";
  var prev = "";
  var sensArrayWithRef = "";
  var specArrayWithRef = "";
  var labels = "";
  var prevalence = thisTool.find('#prevalence_bc').val();
  var hasNoErrors = true;

  validPrevValue = isNumberBetweenZeroAndOne(prevalence);

  if (prevalence.length === 0) {
    prev = 0;
  }
  else if (!validPrevValue && prevalence.length > 0) {
    hasNoErrors = validPrevValue;
  }
  else {
    prev = prevalence;
  }

  inputElm.children(':not(:last-child)').each(function(i, el){
    if ($(this).hasClass('reference_row')) {
      refSens = parseFloat($(this).find('.sensitivity a').text());
      refSpec = parseFloat($(this).find('.specificity a').text());
      sensArrayWithRef += refSens + ",";
      specArrayWithRef += refSpec + ",";
      hasNoErrors = isNumberBetweenZeroAndOne(refSens);
      hasNoErrors = isNumberBetweenZeroAndOne(refSpec);
    }
    else if (!$(this).hasClass('non-data-row')) {
      sensArray += parseFloat($(this).find('.sensitivity a').text()) + ",";
      specArray += parseFloat($(this).find('.specificity a').text()) + ",";
      sensArrayWithRef += parseFloat($(this).find('.sensitivity a').text()) + ",";
      specArrayWithRef += parseFloat($(this).find('.specificity a').text()) + ",";
      hasNoErrors = isNumberBetweenZeroAndOne(parseFloat($(this).find('.sensitivity a').text()));
      hasNoErrors = isNumberBetweenZeroAndOne(parseFloat($(this).find('.specificity a').text()));
      labels += i + ",";
    }

    if(!hasNoErrors)
      return hasNoErrors;
  });

  sensArray = sensArray.slice(0, -1);
  specArray = specArray.slice(0, -1);
  sensArrayWithRef = sensArrayWithRef.slice(0, -1);
  specArrayWithRef = specArrayWithRef.slice(0, -1);
  labels = labels.slice(0, -1);

  if (!hasNoErrors) {
    display_errors("Error with input data.  Not all values are numbers between Zero and One");
    return;
  }
  else {
    thisTool.find('#errors').addClass("hide");

    uniqueKey = generateUniqueKey();
    var hostname = window.location.hostname;
   
    var service = rest + "/bc/";

    pre_request();

    if (validPrevValue) {
      promise = $.ajax({
        type: 'POST',
        url: service,
        data: {
          numberOfValues: '8',
          refSpec: refSpec,
          refSens: refSens,
          specArray: specArray,
          specArrayWithRef: specArrayWithRef,
          sensArray: sensArray,
          sensArrayWithRef: sensArrayWithRef,
          prev: prev,
          labels: labels,
          unique_key: uniqueKey
        },
        dataType: 'json'
      });
    } else {
      promise = $.ajax({
        type: 'POST',
        url: service,
        data: {
          numberOfValues: '7',
          refSpec: refSpec,
          refSens: refSens,
          specArray: specArray,
          specArrayWithRef: specArrayWithRef,
          sensArray: sensArray,
          sensArrayWithRef: sensArrayWithRef,
          labels: labels,
          unique_key: uniqueKey
        },
        dataType: 'json'
      });
    }

    promise.then(set_data, default_ajax_error).always(post_request);
  }
}

function pre_request() {
  disableAll();
  thisTool.find('#spinner').removeClass('hide');
  thisTool.find("#calculate_button").attr("disabled","").text("Please Wait...");
}

function post_request() {
  enableAll();
  thisTool.find('#spinner').addClass('hide');
  thisTool.find("#calculate_button").removeAttr("disabled").text("Calculate");
}

function isNumberBetweenZeroAndOne(n){
  if (isNaN(parseFloat(n))) {
    return false;
  } else if (n > 1) {
    return false;
  } else if (n < 0) {
    return false;
  } else {
    return true;
  }
}

function refreshGraph(drawgraph){
  var graph_file, d;
  if (drawgraph === 1) {
    graph_file = "tmp/SensSpecLR-" + uniqueKey + ".png?";
  } else {
    graph_file = "/common/images/fail-message.jpg?";
  }
  d = new Date();

  thisTool.find('.graph img').removeClass("hide")
      .attr("alt",'output after calculation')
      .attr("src", graph_file + d.getTime())
    .next('.graph small').removeClass("hide");
}

function set_data(dt){
  var jsonObject = JSON.parse(JSON.stringify(dt));
  refreshGraph(1);
  thisTool.find('.output').empty();
  if (validPrevValue) {
    createOutputTableWithPrev(jsonObject);
  } else {
    createOutputTable(jsonObject);
  }
}

function jsonToCell(obj){
  var Specificity;
  var Sensitivity;
  var LRplus;
  var LRminus;

  for (var key in obj) {
    var value = obj[key];
    if (obj.hasOwnProperty(key)) {
      value = obj[key];
    }
    if (key === 'Specificity') {
      Specificity = value;
    } else if (key === 'Sensitivity') {
      Sensitivity = value;
    } else if (key === 'LRplus') {
      LRplus = value;
    } else if (key === 'LRminus') {
      LRminus = value;
    }
  }
  var new_row = $("<div>");
  new_row.append("<div>" + Sensitivity + "</div>");
  new_row.append("<div>" + Specificity + "</div>");
  new_row.append("<div>" + LRplus + "</div>");
  new_row.append("<div>" + LRminus + "</div>");
  thisTool.find('.output').append(new_row);
}

function jsonToCellWithPrev(obj){
  var Specificity;
  var Sensitivity;
  var LRplus;
  var LRminus;
  var PPV;
  var cNPV;
  for (var key in obj)
  {
    if (obj.hasOwnProperty(key))
    {
      value = obj[key];
      if (key == 'Specificity') Specificity=value;
      else if (key== 'Sensitivity') Sensitivity=value;
      else if (key== 'LRplus') LRplus=value;
      else if (key== 'LRminus') LRminus=value;
      else if (key== 'PPV') PPV=value;
      else if (key== 'cNPV') cNPV=value;
    }
  }
  var new_row = $("<div>");
  new_row.append("<div>" + Sensitivity + "</div>");
  new_row.append("<div>" + Specificity + "</div>");
  new_row.append("<div>" + LRplus + "</div>");
  new_row.append("<div>" + LRminus + "</div>");
  if (validPrevValue) {
    new_row.append("<div>" + PPV + "</div>");
    new_row.append("<div>" + cNPV + "</div>");
  }
  thisTool.find('.output').append(new_row);
}

function createOutputTable(jsondata){
  var top_header_row, header_row, i$, len$, each;
  thisTool.find('.output').empty();
  top_header_row = $("<div></div>");
  top_header_row.append("<div class='top-header'><strong>Output Data</strong></div>");
  thisTool.find('.output').append(top_header_row);
  header_row = $("<div></div>");
  header_row.append("<div id='Sens2' class='define' data-term='Sens'>Sensitivity</div>");
  header_row.append("<div id='Spec2' class='define' data-term='Spec'>Specificity</div></div>");
  header_row.append("<div id='LRP2' class='define' data-term='LRP'>LR+</div></div>");
  header_row.append("<div id='LRN2' class='define' data-term='LRN'>LR-</div></div>");
  thisTool.find('.output').append(header_row);
  for (i$ = 0, len$ = jsondata.length; i$ < len$; ++i$) {
    each = jsondata[i$];
    jsonToCell(each);
  }
}

function createOutputTableWithPrev(jsondata){
  thisTool.find('.output').empty();
  top_header_row = $("<div></div>");
  top_header_row.append("<div class='top-header'>Output Data</div>");
  thisTool.find('.output').append(top_header_row);
  var header_row = $("<div></div>");
  header_row.append("<div id='Sens3' class='define' data-term='Sens'>Sensitivity</div></div>");
  header_row.append("<div id='Spec3' class='define' data-term='Spec'>Specificity</div></div>");
  header_row.append("<div id='LRP3' class='define' data-term='LRP'>LR+</div></div>");
  header_row.append("<div id='LRN3' class='define' data-term='LRN'>LR-</div></div>");
  header_row.append("<div id='PPV3' class='define' data-term='PPV'>PPV</div></div>");
  header_row.append("<div id='cNPV3' class='define' data-term='cNPV'>cNPV</div></div>");
  thisTool.find('.output').append(header_row);
  for (var each in jsondata) {
    jsonToCellWithPrev(jsondata[each]);
  }
}

function reset_bc(){
  thisTool.find('#errors').addClass("hide");
  thisTool.find("#file_upload, #prevalence_bc").val("");

  inputElm.children(':not(.non-data-row)').each(function(i, el) {
    $(el).remove();
  });

  add_new_row();
  add_new_row();
  add_new_row();

  thisTool.find(".reference:first").click();
  thisTool.find('.graph img').attr('alt','image of example output after calculation');
  thisTool.find('.graph img').addClass("hide").attr('src', '/common/images/initial.jpg');
  thisTool.find('.graph small').addClass("hide");
  thisTool.find('.output').empty();

  thisTool.find("[row='0'] .sensitivity a").text("0.8");
  thisTool.find("[row='0'] .specificity a").text("0.7");

  thisTool.find("[row='1'] .sensitivity a").text("0.85");
  thisTool.find("[row='1'] .specificity a").text("0.68");

  thisTool.find("[row='2'] .sensitivity a").text("0.9");
  thisTool.find("[row='2'] .specificity a").text("0.5");

}
