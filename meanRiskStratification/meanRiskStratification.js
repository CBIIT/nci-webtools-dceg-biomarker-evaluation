{
 "tab1": {
 "PPVData": [ {
 "Sensitivity":    0.8,
"Optimal k": 0.24661,
"Relative efficiency gain or loss compared to k = 0.5": 0.57963 
},
{
 "Sensitivity":    0.9,
"Optimal k": 0.17913,
"Relative efficiency gain or loss compared to k = 0.5": 0.99327 
},
{
 "Sensitivity":   0.95,
"Optimal k": 0.13058,
"Relative efficiency gain or loss compared to k = 0.5": 1.3898 
},
{
 "Sensitivity":  0.995,
"Optimal k": 0.04435,
"Relative efficiency gain or loss compared to k = 0.5": 2.3506 
} ],
"cNPVData": [ {
 "Sensitivity":    0.8,
"Optimal k": 0.75339,
"Relative efficiency gain or loss compared to k = 0.5": 0.57963 
},
{
 "Sensitivity":    0.9,
"Optimal k": 0.82087,
"Relative efficiency gain or loss compared to k = 0.5": 0.99327 
},
{
 "Sensitivity":   0.95,
"Optimal k": 0.86942,
"Relative efficiency gain or loss compared to k = 0.5": 1.3898 
},
{
 "Sensitivity":  0.995,
"Optimal k": 0.95565,
"Relative efficiency gain or loss compared to k = 0.5": 2.3506 
} ] 
},
"tab2": {
 "PPVData": [ {
 "Sensitivity":    0.8,
"Optimal k":    0.2,
"Relative efficiency gain or loss compared to k = 0.5": 0.8496 
},
{
 "Sensitivity":    0.9,
"Optimal k": 0.14286,
"Relative efficiency gain or loss compared to k = 0.5": 1.2807 
},
{
 "Sensitivity":   0.95,
"Optimal k": 0.1029,
"Relative efficiency gain or loss compared to k = 0.5": 1.6593 
},
{
 "Sensitivity":  0.995,
"Optimal k": 0.03423,
"Relative efficiency gain or loss compared to k = 0.5": 2.4885 
} ],
"cNPVData": [ {
 "Sensitivity":    0.8,
"Optimal k":    0.8,
"Relative efficiency gain or loss compared to k = 0.5": 0.8496 
},
{
 "Sensitivity":    0.9,
"Optimal k": 0.85714,
"Relative efficiency gain or loss compared to k = 0.5": 1.2807 
},
{
 "Sensitivity":   0.95,
"Optimal k": 0.8971,
"Relative efficiency gain or loss compared to k = 0.5": 1.6593 
},
{
 "Sensitivity":  0.995,
"Optimal k": 0.96577,
"Relative efficiency gain or loss compared to k = 0.5": 2.4885 
} ] 
},
"tab3": {
 "PPVData": [ {
 "Sensitivity":    0.8,
"Optimal k": 0.14286,
"Relative efficiency gain or loss compared to k = 0.5": 1.2807 
},
{
 "Sensitivity":    0.9,
"Optimal k":    0.1,
"Relative efficiency gain or loss compared to k = 0.5": 1.6896 
},
{
 "Sensitivity":   0.95,
"Optimal k": 0.07104,
"Relative efficiency gain or loss compared to k = 0.5": 2.0138 
},
{
 "Sensitivity":  0.995,
"Optimal k": 0.02308,
"Relative efficiency gain or loss compared to k = 0.5": 2.6473 
} ],
"cNPVData": [ {
 "Sensitivity":    0.8,
"Optimal k": 0.85714,
"Relative efficiency gain or loss compared to k = 0.5": 1.2807 
},
{
 "Sensitivity":    0.9,
"Optimal k":    0.9,
"Relative efficiency gain or loss compared to k = 0.5": 1.6896 
},
{
 "Sensitivity":   0.95,
"Optimal k": 0.92896,
"Relative efficiency gain or loss compared to k = 0.5": 2.0138 
},
{
 "Sensitivity":  0.995,
"Optimal k": 0.97692,
"Relative efficiency gain or loss compared to k = 0.5": 2.6473 
} ] 
} 
}
requirejs.config({
  paths: {
    jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min",
    'jquery.ui': "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min",
    bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
    sampleSize: 'sampleSize/sampleSize',
    bc: 'bc/bc',
    meanstorisk: 'meanstorisk/meanstorisk',
    riskStratAdvanced: 'riskStratAdvanced/riskStratAdvanced',
    meanRiskStratification: 'meanRiskStratification/meanRiskStratification',
    glossary: '/common/js/meansToRiskGlossary',
    routes: 'routes'
  },
  shim: {
    'jquery.ui': {
      deps: ['jquery']
    },
    bootstrap: {
      deps: ['jquery']
    },
    glossary: {
      deps: ['jquery']
    },
    sampleSize: {
      deps: ['jquery.ui', 'bootstrap']
    },
    m2rs: {
      deps: ['jquery.ui', 'bootstrap']
    },
    riskStratAdvanced: {
      deps: ['jquery.ui', 'bootstrap']
    },
    routes: {
      deps: ['bootstrap', 'glossary']
    }
  }
});
require(['routes'], function(){
  console.log("default scripts loaded");
  return {};
});
var default_ajax_error;
$(document).ready(function(){
  document.title = "Biomarker Tools: Home";
});
$(document).on('show.bs.tab', function(el){
  var id, title;
  id = el.target.dataset.target.replace('#', '');
  require([id]);
  title = "Biomarker Tools: " + el.target.text;
  document.title = title;
});
$('.goToTab').on('click', function(el){
  var ref;
  $('.nav li.active').removeClass('active');
  ref = $(this).attr('data-target');
  $(".nav a[data-target='" + ref + "']").tab('show').parent().addClass('active');
  window.scrollTo(0, 0);
});
default_ajax_error = function(request, status, error){
  $('#spinner').addClass('hide');
  alert(request.responseText);
};
var uniqueKey, old_value, editing, row, col, validPrevValue;
uniqueKey = null;
old_value = null;
editing = false;
row = null;
col = null;
validPrevValue = false;
$(document).ready(function(){
  bind_reference_row();
  bind_input();
  bind_calculate_button();
  bind_remove_row();
  bind_add_new_row();
});
function bind_remove_row(){
  $('.remove_row_button').on('click', function(){
    remove_row($(this));
  });
}
function bind_add_new_row(){
  $('#new_row_button').click(function(){
    add_new_row();
  });
}
function bind_calculate_button(){
  $('#calculate_button').click(function(){
    do_calculation();
  });
}
function bind_reference_row(){
  $('.reference').click(function(e){
    var row, col;
    row = $(this).attr('row');
    col = $(this).attr('col');
    clear_reference_row();
    $(this).html("<img src='/common/images/checkbox.png' height='18' width='18' alt='check'/>");
    $(this).parent().addClass('reference_row').children().last().empty().html('&nbsp');
  });
}
function bind_input(){
  $('.input').click(function(e){
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
    new_value = $('#new_value').val();
    change_value($this, new_value);
  });
  inp.on('keypress', function(e){
    var $this, new_value;
    $this = $(this);
    if (e.which === 13) {
      new_value = $('#new_value').val();
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
    field.parent().empty().text(new_value);
    editing = false;
  } else {
    alert("Valid Values are between 0 and 1 inclusive, you tried: " + new_value);
    field.parent().empty().text(old_value);
    editing = false;
  }
}
function clear_reference_row(){
  var num_rows;
  $('#inputdata').find('.reference').html("<img src='/common/images/uncheckbox.png' height='18' width='18' alt='uncheck'/>");
  $('#inputdata').find('tr').each(function(){
    $(this).removeClass('reference_row');
    if (!$(this).hasClass('non-data-row')) {
      $(this).children().last().empty().html("<BUTTON class='remove_row_button'>Remove</BUTTON>");
    }
  });
  bind_remove_row();
  num_rows = $('#inputdata').find('tr').length - 3;
  if (num_rows <= 2) {
    $('#inputdata').find('.remove_row_button').remove();
  }
}
function add_new_row(){
  var num_rows;
  num_rows = $('#inputdata').find('tr').length - 3;
  $('#inputdata').find('tr').last().prev().after(("<tr row='" + num_rows + "'><td><b>" + (num_rows + 1) + "</b></td>") + ("<td class='reference' row='" + num_rows + "' col='reference'><img src='/common/images/uncheckbox.png' height='18' width='18'  alt='uncheck'/></td>") + ("<td class='input sensitivity' row='" + num_rows + "' col='sensitivity'>&nbsp;</td>") + ("<td class='input specificity' row='" + num_rows + "' col='specificity'>&nbsp;</td>") + "<td><BUTTON class='remove_row_button'>Remove</BUTTON></td></tr>");
  if (num_rows === 2) {
    $('#inputdata').find('tr').each(function(){
      if (!$(this).hasClass('non-data-row' && !$(this)).hasClass('reference_row')) {
        $(this).children().last().empty().html("<BUTTON class='remove_row_button'>Remove</BUTTON>");
      }
    });
  }
  bind_remove_row();
  bind_reference_row();
  bind_input();
}
function remove_row(el){
  var row_to_remove, num_rows;
  row_to_remove = el.parent().parent();
  row_to_remove.remove();
  num_rows = $('#inputdata').find('tr').length - 3;
  if (num_rows <= 2) {
    $('#inputdata').find('.remove_row_button').remove();
  }
}
function do_calculation(){
  var refSens, refSpec, sensArray, specArray, prev, sensArrayWithRef, specArrayWithRef, labels, prevalence, validPrevValue, hasNoErrors, hostname, promise;
  refSens = "";
  refSpec = "";
  sensArray = "";
  specArray = "";
  prev = "";
  sensArrayWithRef = "";
  specArrayWithRef = "";
  labels = "";
  prevalence = $('#prevalence').val();
  if (!isNumberBetweenZeroAndOne(prevalence)) {
    validPrevValue = false;
    prev = 0;
  } else {
    validPrevValue = true;
    prev = prevalence;
  }
  hasNoErrors = true;
  $('#inputdata > tbody > tr').each(function(i, el){
    var hasNoErrors;
    if ($(this).hasClass('reference_row')) {
      refSens = parseFloat($(this).find('.sensitivity').text());
      refSpec = parseFloat($(this).find('.specificity').text());
      sensArrayWithRef += refSens + ",";
      specArrayWithRef += refSpec + ",";
      hasNoErrors = isNumberBetweenZeroAndOne(refSens);
      hasNoErrors = isNumberBetweenZeroAndOne(refSpec);
    } else if (!$(this).hasClass('non-data-row')) {
      sensArray += parseFloat($(this).find('.sensitivity').text()) + ",";
      specArray += parseFloat($(this).find('.specificity').text()) + ",";
      sensArrayWithRef += parseFloat($(this).find('.sensitivity').text()) + ",";
      specArrayWithRef += parseFloat($(this).find('.specificity').text()) + ",";
      hasNoErrors = isNumberBetweenZeroAndOne(parseFloat($(this).find('.sensitivity').text()));
      hasNoErrors = isNumberBetweenZeroAndOne(parseFloat($(this).find('.specificity').text()));
      labels += (i + 1) + ",";
    }
  });
  sensArray = sensArray.slice(0, -1);
  specArray = specArray.slice(0, -1);
  sensArrayWithRef = sensArrayWithRef.slice(0, -1);
  specArrayWithRef = specArrayWithRef.slice(0, -1);
  labels = labels.slice(0, -1);
  if (!hasNoErrors) {
    alert("Error with input data.  Not all values are numbers between Zero and One");
    return;
  }
  uniqueKey = new Date().getTime();
  hostname = window.location.hostname;
  if (validPrevValue) {
    promise = $.ajax({
      type: 'POST',
      url: "http://" + hostname + "/bcRest/",
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
      url: "http://" + hostname + "/bcRest/",
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
  $('#spinner').removeClass('hide');
  promise.then(set_data, default_ajax_error);
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
    graph_file = "../bc/tmp/SensSpecLR-" + uniqueKey + ".png?";
  } else {
    graph_file = "/common/images/fail-message.jpg?";
  }
  d = new Date();
  $('#graph').attr('src', graph_file + d.getTime());
}
function set_data(dt){
  var jsonObject;
  jsonObject = JSON.parse(JSON.stringify(dt));
  refreshGraph(1);
  $('#output').empty();
  $('#output th').remove();
  if (validPrevValue) {
    createOutputTableWithPrev(jsonObject);
  } else {
    createOutputTable(jsonObject);
  }
  bindTermToDefine();
  $('#spinner').addClass('hide');
}
function jsonToCell(obj){
  var key, value, Specificity, Sensitivity, LRplus, LRminus, new_row;
  for (key in obj) {
    value = obj[key];
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
  new_row = $("<tr>");
  new_row.append("<td>" + Sensitivity + "</td>");
  new_row.append("<td>" + Specificity + "</td>");
  new_row.append("<td>" + LRplus + "</td>");
  new_row.append("<td>" + LRminus + "</td>");
  $('#output').append(new_row);
}
function jsonToCellWithPrev(obj){
  var i$, len$, key, value, Specificity, Sensitivity, LRplus, LRminus, PPV, cNPV, new_row;
  for (i$ = 0, len$ = obj.length; i$ < len$; ++i$) {
    key = obj[i$];
    if (obj.hasOwnProperty(key)) {
      value = obj[key];
      if (key === 'Specificity') {
        Specificity = value;
      } else if (key === 'Sensitivity') {
        Sensitivity = value;
      } else if (key === 'LRplus') {
        LRplus = value;
      } else if (key === 'LRminus') {
        LRminus = value;
      } else if (key === 'PPV') {
        PPV = value;
      } else if (key === 'cNPV') {
        cNPV = value;
      }
    }
  }
  new_row = $("<tr>");
  new_row.append("<td>" + Sensitivity + "</td>");
  new_row.append("<td>" + Specificity + "</td>");
  new_row.append("<td>" + LRplus + "</td>");
  new_row.append("<td>" + LRminus + "</td>");
  if (validPrevValue) {
    new_row.append("<td>" + PPV + "</td>");
  }
  if (validPrevValue) {
    new_row.append("<td>" + cNPV + "</td>");
  }
  $('#output').append(new_row);
}
function createOutputTable(jsondata){
  var top_header_row, header_row, i$, len$, each;
  $('#output').empty();
  top_header_row = $("<tr>");
  top_header_row.append("<th class='top-header' colspan='7'>Output Data</th>");
  $('#output').append(top_header_row);
  header_row = $("<tr>");
  header_row.append("<th class='header'><div class='termToDefine' id='Sens2' data-term='Sens'>Sensitivity</div><div class='popupDefinition' id='Sens2Definition'></div></th>");
  header_row.append("<th class='header'><div class='termToDefine' id='Spec2' data-term='Spec'>Specificity</div><div class='popupDefinition' id='Spec2Definition'></div></th>");
  header_row.append("<th class='header'><div class='termToDefine' id='LRP2' data-term='LRP'>LR+</div><div class='popupDefinition' id='LRP2Definition'></div></th>");
  header_row.append("<th class='header'><div class='termToDefine' id='LRN2' data-term='LRN'>LR-</div><div class='popupDefinition' id='LRN2Definition'></div></th>");
  $('#output').append(header_row);
  for (i$ = 0, len$ = jsondata.length; i$ < len$; ++i$) {
    each = jsondata[i$];
    jsonToCell(each);
  }
}
function createOutputTableWithPrev(jsondata){
  var top_header_row, header_row, i$, len$, each;
  $('#output').empty();
  top_header_row = $("<tr>");
  top_header_row.append("<th class='top-header' colspan='7'>Output Data</th>");
  $('#output').append(top_header_row);
  header_row = $("<tr>");
  header_row.append("<th class='header'><div class='termToDefine' id='Sens3' data-term='Sens'>Sensitivity</div><div class='popupDefinition' id='Sens3Definition'></div></th>");
  header_row.append("<th class='header'><div class='termToDefine' id='Spec3' data-term='Spec'>Specificity</div><div class='popupDefinition' id='Spec3Definition'></div></th>");
  header_row.append("<th class='header'><div class='termToDefine' id='LRP3' data-term='LRP'>LR+</div><div class='popupDefinition' id='LRP3Definition'></div></th>");
  header_row.append("<th class='header'><div class='termToDefine' id='LRN3' data-term='LRN'>LR-</div><div class='popupDefinition' id='LRN3Definition'></div></th>");
  header_row.append("<th class='header'><div class='termToDefine' id='PPV3' data-term='PPV'>PPV</div><div class='popupDefinition' id='PPV3Definition'></div></th>");
  header_row.append("<th class='header'><div class='termToDefine' id='cNPV3' data-term='cNPV'>cNPV</div><div class='popupDefinition' id='cNPV3Definition'></div></th>");
  $('#output').append(header_row);
  for (i$ = 0, len$ = jsondata.length; i$ < len$; ++i$) {
    each = jsondata[i$];
    jsonToCellWithPrev(jsondata[each]);
  }
}
function ajax_error(jqXHR, exception){
  refreshGraph(1);
  alert("ajax problem");
}

requirejs([ 'glossary' ]);
var uniqueKey;

var valuesFromFile = [];
var numberOfRows;
var numberOfCols;


var ppv_tabs = {
	"PPV": "PPV = Positive Predictive Value (PPV)",
	"cNPV": "cNPV = 1 - PPV = Compliment of the Negative Predictive Value",
	"Risk Difference": "PPV - cNPV",
	"Cases per 1000 Screened": "# of Cases Detected per 1000 Screened",
	"Cases per 1000 Positive": "# of Cases Detected per 1000 Who Screened Positive",
	"Cases per 1000 with Disease": "# of Cases Detected per 1000 with the Disease"
};


$(document).ready(function() {
	bind_calculate_button();
	bind_download_button();
	bind_option_choices();
	$("#please_wait_calculate").dialog({ autoOpen: false, position: 'top', title: "Please Wait", height: 60 });
	$("#please_wait_download").dialog({ autoOpen: false, position: 'top', title: "Please Wait", height: 60 });
	$("#download_button").hide();
	$(".data_entry_by_input").on('click', function () {
		$("#download_button").hide();
	});
	
});

function prepare_upload (e){
        files = e.target.files;
        if ( window.FileReader ) {
                var fr = new FileReader();
                fr.onload = function(e) {
                        var txt = e.target.result;
                var lines = txt.split("\n");
                if (lines.length > 0) numberOfCols = lines[0].split(",").length;
                numberOfRows = 0;
                for (count = 0; count < lines.length;count++) {
                        var arr = lines[count].split(",");
                        if (!isNaN(arr[0]) && !isNaN(arr[1]) ) {
                                valuesFromFile = valuesFromFile.concat(arr);
				numberOfRows++;
                        }
                }
                };
                fr.readAsText(files[0]);
        }
        else {
                var filePath = $("#input_file_upload").val();
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var textStream = fso.OpenTextFile(filePath);
                var fileData = textStream.ReadAll();
                var lines = fileData.split("\n");
                numberOfRows = lines.length;
                if (numberOfRows > 0) numberOfCols = lines[0].split(",").length;

                for (count = 0; count < lines.length;count++) {

                        var arr = lines[count].split(",");
                        if (!isNaN(arr[0]) && !isNaN(arr[1]) ) {
                                valuesFromFile = valuesFromFile.concat(arr);
                        }
                }
        }
}


function bind_option_choices() {
	
	$( "#accordion" ).accordion({ 
		active: 0,
		autoHeight: true,
	    clearStyle: true,
        activate: function (event, ui) { $("#download_button").hide(); }
	});	
	$( "#input_file_upload" ).on('change', prepare_upload);

	

	

	

}


function bind_calculate_button() {
	$( "#calculate_button" ).click(function() {
		if ($( "#accordion" ).accordion("option", "active" ) === 0	) {	
		
			if (valuesFromFile.length === 0) {
				alert ("Please Upload a file or pick the normalized option and enter key data first");
			} else {
				$("#please_wait_calculate").dialog("open");
				get_inputs_for_user_defined_calculation();
				make_ajax_call_user_defined_calculation();				
			}
		} else {
			$("#please_wait_calculate").dialog("open");
			get_inputs_for_standard_calculation();
			make_ajax_call_standard_calculation();			
		}
	});
}

function bind_download_button() {
	$( "#download_button" ).click(function() {
		if ($( "#accordion" ).accordion("option", "active" ) === 0	) {			
		
			if (valuesFromFile.length === 0) {
				alert ("Please Upload a file or pick the normalized option and enter key data first");
			} else {
				$("#please_wait_download").dialog("open");
				get_inputs_for_user_defined_calculation();
				make_excel_call_user_defined_calculation();
			}
		} else {
			$("#please_wait_download").dialog("open");
			get_inputs_for_standard_calculation();
			make_excel_call_standard_calculation();			
		}
	});
}

function ajax_error(jqXHR, exception)
{	
   refreshGraph(1);
   alert("ajax problem");
}





function get_inputs_for_user_defined_calculation () {
	specificity_string="" + $("#specificity").val() + ""; 
	prevalence_string="" + $("#prevalence").val() + ""; 
	
}

function get_inputs_for_standard_calculation () {
	
	var mean_cases = parseFloat($("#mean_cases_input").val());
	var mean_controls = parseFloat($("#mean_controls_input").val());
	var stderr_cases = parseFloat($("#stderr_cases_input").val());
	var stderr_controls = parseFloat($("#stderr_controls_input").val());
	var N_cases = parseFloat($("#N_cases_input").val());
	var N_controls = parseFloat($("#N_controls_input").val());

	
	cases_string="" +mean_cases+","+stderr_cases+","+N_cases+""; 
	controls_string="" +mean_controls+","+stderr_controls+","+N_controls+""; 
	specificity_string="" + $("#specificity").val() + ""; 
	prevalence_string="" + $("#prevalence").val() + ""; 
		


}



function set_standard_inputs(mean_cases,mean_controls,stderr_cases,stderr_controls,N_cases,N_controls) {


	set_value("#mean_cases",mean_cases);	
	set_value("#mean_controls",mean_controls);	
	set_value("#stderr_cases",stderr_cases);	
	set_value("#stderr_controls",stderr_controls);	
	set_value("#N_cases",N_cases);	
	set_value("#N_controls",N_controls);	
	

	var deviation_cases= stderr_cases * Math.sqrt(N_cases);
	set_value("#deviation_cases",deviation_cases.toPrecision(4) );
	var deviation_controls= stderr_controls * Math.sqrt(N_controls);
	set_value("#deviation_controls",deviation_controls.toPrecision(4) );
	var variance_cases= deviation_cases * deviation_cases;	
	set_value("#variance_cases",variance_cases.toPrecision(4) );
	var variance_controls= deviation_controls * deviation_controls;	
	set_value("#variance_controls",variance_controls.toPrecision(4) );
	var variance_overall = ( (N_cases * variance_cases) + (N_controls * variance_controls) )/ (N_cases + N_controls);
	set_value("#variance_overall",variance_overall.toPrecision(4) );
	
	var mean_overall = ( (N_cases * mean_cases) + (N_controls * mean_controls) )/ (N_cases + N_controls);
	set_value("#mean_overall",mean_overall.toPrecision(4) );

	var N_overall = N_cases + N_controls;
	set_value("#N_overall",N_overall.toPrecision(4) );

	var cv_cases = Math.sqrt(variance_cases) / mean_cases;
	set_value("#cv_cases",cv_cases.toPrecision(4) );
	var cv_controls = Math.sqrt(variance_controls) / mean_controls;
	set_value("#cv_controls",cv_controls.toPrecision(4) );
	var cv_overall = Math.sqrt(variance_overall) / mean_overall;
	set_value("#cv_overall",cv_overall.toPrecision(4) );
	
	var difference_in_mean = mean_cases - mean_controls;
	set_value("#mean_difference",difference_in_mean.toPrecision(4) );
	set_value("#diff_overall",difference_in_mean.toPrecision(4) );
	
	var delta = difference_in_mean / Math.sqrt(variance_overall);
	set_value("#delta_overall",delta.toPrecision(4) );

    delta_string = "c("+delta.toPrecision(4)+")";
	
}

function make_ajax_call_user_defined_calculation() {

    uniqueKey = (new Date()).getTime();	
    hostname = window.location.hostname;
    url = "http://" + hostname +"/meanstoriskRest/";
    $.ajax({
		type: "POST",
		url: url,
		data: {
			option:1,
			spec:specificity_string, 
			prev: prevalence_string,
			datarowcount: numberOfRows,
			colcount: numberOfCols,
			unique_key: uniqueKey,
			graphkey:'CSV',
			dataCSV: valuesFromFile.join()
		},
		dataType: "json",
		success: set_data,
		error: ajax_error
	});
}
function make_ajax_call_standard_calculation() {

    uniqueKey = (new Date()).getTime();	
    hostname = window.location.hostname;
    url = "http://" + hostname +"/meanstoriskRest/";
    $.ajax({
		type: "POST",
		url: url,
		data: {
			option:2,
			spec:specificity_string, 
			prev: prevalence_string, 
			cases: cases_string, 
			controls: controls_string, 
			unique_key: uniqueKey,
			graphkey:'input'
		},
		dataType: "json",
		success: set_data,
		error: ajax_error
	});
}

function make_excel_call_user_defined_calculation() {

    uniqueKey = (new Date()).getTime();	
    hostname = window.location.hostname;
    url = "http://" + hostname +"/meanstoriskRest/";
    $.ajax({
		type: "POST",
		url: url,
		data: {
			option:3,
			spec:specificity_string, 
			prev: prevalence_string,
			datarowcount: numberOfRows,
			colcount: numberOfCols,
			unique_key: uniqueKey,
			graphkey:'CSV',
			dataCSV: valuesFromFile.join()
		},
		dataType: "json",
		success: set_excel,
		error: ajax_error
	});
}

function make_excel_call_standard_calculation() {

    uniqueKey = (new Date()).getTime();	
    hostname = window.location.hostname;
    url = "http://" + hostname +"/meanstoriskRest/";
    $.ajax({
		type: "POST",
		url: url,
		data: {
			option:4,
			spec:specificity_string, 
			prev: prevalence_string, 
			cases: cases_string, 
			controls: controls_string, 
			unique_key: uniqueKey,
			graphkey:'input'
		},
		dataType: "json",
		success: set_excel,
		error: ajax_error
	});
}

function set_data(dt) {

	$("#please_wait_calculate").dialog("close");
	$("#download_button").show();
	set_values_table(dt);
	create_tabbed_table(dt);
	draw_graph();
}

function set_excel(dt) {
	$("#please_wait_download").dialog("close");


	window.open(dt);	

}

function ajax_error(dt) {
	alert("There was some problem getting the data. " + JSON.stringify(dt) ); 	
}

function set_values_table(dt) {

	values = dt.Delta;
	

	if (values[0].Cases) set_value("#mean_cases",values[0].Cases.toPrecision(2)); else set_value("#mean_cases","");
	if (values[0].Controls) set_value("#mean_controls",values[0].Controls.toPrecision(2));	else set_value("#mean_controls","");
	if (values[0].Overall) set_value("#mean_overall",values[0].Overall.toPrecision(2) ); else set_value("#mean_overall","");

	
	if (values[1].Cases) set_value("#stderr_cases",values[1].Cases.toPrecision(4));	else set_value("#stderr_cases","");
	if (values[1].Controls) set_value("#stderr_controls",values[1].Controls.toPrecision(4)); else set_value("#stderr_controls","");
	if (values[1].Overall) set_value("#stderr_overall",values[1].Overall.toPrecision(4)); else set_value("#stderr_overall","");

	if (values[2].Cases) set_value("#N_cases",values[2].Cases); else set_value("#N_cases","");
	if (values[2].Controls) set_value("#N_controls",values[2].Controls);	else set_value("#N_controls","");
	if (values[2].Overall) set_value("#N_overall",values[2].Overall); else set_value("#N_overall","");
	
	if (values[3].Cases) set_value("#deviation_cases",values[3].Cases.toPrecision(4)); else set_value("#deviation_cases","");
	if (values[3].Controls) set_value("#deviation_controls",values[3].Controls.toPrecision(4) ); else set_value("#deviation_controls","");
	if (values[3].Overall) set_value("#deviation_overall",values[3].Overall.toPrecision(4) );else set_value("#deviation_overall","");

	if (values[4].Cases) set_value("#variance_cases",values[4].Cases.toPrecision(4) ); else set_value("#variance_cases","");
	if (values[4].Controls) set_value("#variance_controls",values[4].Controls.toPrecision(4)); else set_value("#variance_controls","");
	if (values[4].Overall) set_value("#variance_overall",values[4].Overall.toPrecision(4) ); else set_value("#variance_overall","");
	
	if (values[5].Cases) set_value("#cv_cases",values[5].Cases.toPrecision(4) ); else set_value("#cv_cases","");
	if (values[5].Controls) set_value("#cv_controls",values[5].Controls.toPrecision(4)); else set_value("#cv_controls","");
	if (values[5].Overall) set_value("#cv_overall",values[5].Overall.toPrecision(4) ); else set_value("#cv_overall","");
	
	if (values[6].Overall) set_value("#diff_overall",values[6].Overall.toPrecision(4) ); else set_value("#diff_overall","");
	
	if (values[7].Overall) set_value("#delta_overall",values[7].Overall.toPrecision(4) ); else set_value("#delta_overall","");

	if (values[8]&& values[8].Overall) set_value("#auc_overall",values[8].Overall.toPrecision(4) ); else set_value("#auc_overall","");
}

function create_tabbed_table(dt) {






	
	make_tabs();
	
	set_matrix("tab-1", 'PPV', 'Risk of Disease after a POSITIVE Test', 'Positive Predictive Value (PPV)', 
			dt['Sensitivity Given Specificity'], dt.PPV);	
	set_matrix("tab-2", 'cNPV', 'Risk of Disease after a NEGATIVE Test', 'Complement of the Negative Predictive Value (cNPV)', 
			dt['Sensitivity Given Specificity'], dt.cNPV);	
	set_matrix("tab-3", 'PPVmcNPV', 'Range of Risk after Test Results', 'PPV &minus; cNPV', 
			dt['Sensitivity Given Specificity'], dt['PPV-cNPV']);	
	set_matrix("tab-4", 'ProgramBased', '# of Cases Detected per 1000 People Screened', 'Program &minus; Based', 
			dt['Sensitivity Given Specificity'], dt['Program-Based']);	
	set_matrix("tab-5", 'PPV', '# of Cases Detected per 1000 Who are Screen Positive', 'PPV &minus; Based', 
			dt['Sensitivity Given Specificity'], dt['PPV-Based']);	
	set_matrix("tab-6", 'Sens', '# of Cases Detected per 1000 With Disease', 'Sensitivity &minus; Based', 
			dt['Sensitivity Given Specificity'], dt['Sensitivity-Based']);	
	set_matrix("tab-7", 'DominatedByRareDisease', '# Per 1000 Screenees Who Screen Positive', 'Dominated by Specificity for Rare Disease', 
			dt['Sensitivity Given Specificity'], dt['Dominated by Specificity for a Rare Disease']);	
	
}

function make_tabs() {
	tabs = $("<div id='tabs' style='width:1180px;margin:5px;'> </div>");
	$(".tabbed_output_panel").empty().append(tabs);
	tab_names = $("<UL> </UL>");
	tabs.append(tab_names);
	
	var index = 0;
	for(var key in ppv_tabs) {
		index++;
		tab_names.append("<LI><a  style='padding:3px;' href='#tab-" + index + "' title='" + ppv_tabs[key] + "'>" + key + "</a></LI>");
		tabs.append("<DIV style='width:1180px;height:325px;' id='tab-" + index + "' > " + ppv_tabs[key] + " </div>"); 
	}
	
	tabs.tabs();
	
}

function set_matrix(tab_id, type, table_name, table_second_name, sensitivity_matrix, matrix) {
	var prevalence_values = Object.keys(matrix[0]);
	var prevalence_count = prevalence_values.length;
	var specificity_count = matrix.length;
	
	
	var general_table = $("<TABLE class='table_data' style='width:94%;'></TABLE>");
	$("#"+tab_id).empty().append(general_table);
	
	var first_header_row = $("<tr></tr>");	
	first_header_row.append("<TH class='table_data header' colspan='" +  (prevalence_count + 4) + 
                            "'>" + table_name + "</TH>");
	first_header_row.appendTo(general_table);

	var second_header_row = $("<tr></tr>");	
	second_header_row.append("<TH class='table_data " + type + "_stripe' colspan='" +  (prevalence_count + 4) + "'><div class='termToDefine' id='" + type + tab_id+"' data-term='"+type+"'>" + table_second_name + "</div><div class='popupDefinition' id='" + type +tab_id+ "Definition'></div></TH>");
	second_header_row.appendTo(general_table);

	var third_header_row = $("<tr></tr>");	
	third_header_row.append("<TH class='table_data header' colspan='4' style='border-right:1px solid black;'>" +
                            "<div class='termToDefine' id='Sens2-" + tab_id +
                            "' data-term='Sens'>Sensitivity Given Specificity <br /> for Given Delta </div>" +
                            "<div class='popupDefinition' id='Sens2-" + tab_id + "Definition'></div></TH>" );
	third_header_row.append("<TH class='table_data header' colspan='" + prevalence_count + "' >" +
                            "<div class='termToDefine' id='DP2-" + tab_id + 
                            "' data-term='DP'>Disease Prevalence</div>" +
                            "<div class='popupDefinition' id='DP2-" + 
                            tab_id + "Definition'></div></TH>");
	third_header_row.appendTo(general_table);
	
	var header_row = $("<tr></tr>");
	header_row.attr('id', type + '_table_row_header');
	header_row.append("<TH class='table_data header'><div class='termToDefine' id='Spec-"+tab_id+"' data-term='Spec'>Specificity</div><div class='popupDefinition' id='Spec-"+tab_id+"Definition'></div></TD>");
	header_row.append("<TH class='table_data header'><div class='termToDefine' id='Sens-"+tab_id+"' data-term='Sens'>Sensitivity</div><div class='popupDefinition' id='Sens-"+tab_id+"Definition'></div></TD>");
	header_row.append("<TH class='table_data header'><div class='termToDefine' id='LRP-"+tab_id+"' data-term='LRP'>LR+</div><div class='popupDefinition' id='LRP-"+tab_id+"Definition'></div></TD>");
	header_row.append("<TH class='table_data header' style='border-right:1px solid black;'><div class='termToDefine' id='LRN-"+tab_id+"' data-term='LRN'>LR-</div><div class='popupDefinition' id='LRN-"+tab_id+"Definition'></div></TD>");
	for (var x=0;x<prevalence_count;x++) {
		header_row.append("<TH class='table_data header'>" + format_number(prevalence_values[x]) + "</TD>");
	}
	header_row.appendTo(general_table);
	
	for (var y=0;y < specificity_count;y++) {
		var row = $("<tr></tr>");
	
		row.attr('id', type + '_table_row_' + x);





		row.append("<TD class='table_data col1'>" + format_number(sensitivity_matrix[y].Specificity) + "</TD>");
		row.append("<TD class='table_data col1'>" + format_number(sensitivity_matrix[y].Sensitivity) + "</TD>");
		row.append("<TD class='table_data col1'>" + format_number(sensitivity_matrix[y]['LR+']) + "</TD>");
		row.append("<TD class='table_data col1' style='border-right:1px solid black;'>" + 
			format_number(sensitivity_matrix[y]['LR-']) + "</TD>");
		
		
		
	
		for (x=0;x<prevalence_count;x++) {
			var prevalence_value = prevalence_values[x];
			row.append("<TD class='table_data col1'>" + format_number(matrix[y][prevalence_value]) + "</TD>");			
		}
		row.appendTo(general_table);
	}	
   
	bindTermToDefine();
}


function draw_graph() {
    url = "http://" + hostname +"/meanstoriskRest/";

    if ($( "#accordion" ).accordion("option", "active" ) === 0) {
    	graph_file = "./tmp/CSV"+uniqueKey+".png?";
    } else {
    	graph_file = "./tmp/input"+uniqueKey+".png?";
   	
    }

    $(".graph_panel").empty().append("<IMG alt='graph' class='output_graph' src='" + graph_file+"'/>");
}

function set_value(field, value) {
	$(field).text("" + value);
    $(field).addClass('highlight');
    setTimeout(
        function() { $(field).removeClass('highlight'); }, 
        2000
    );		
}

function format_number(num) {



	return num;
}


Object.keys = Object.keys || function(o) { 
    var result = []; 
    for(var name in o) { 
        if (o.hasOwnProperty(name)) 
          result.push(name); 
    } 
    return result; 
};

var oTable;
var outputTable;
var giRedraw = false;
var aData;
var numberOfRows;
var uniqueKey;

var old_value;
var editing = false;
var row;
var col;
var validPrevValue = false;
var tableFirstColLabel;
var tableFirstRowLabel;
var keysforfunctionnames = [ "", "Sens", "Spec", "PPV", "cNPV", "Prev", "Delta" ];

var functionnames = [ "", "sensitivity", "specificity", "ppv", "cnpv",
		"prevalence", "delta" ];

var invalidCombos = [ "delta-sensitivity-specificity", "cnpv-delta-ppv",
		"cnpv-ppv-prevalence", "cnpv-ppv-sensitivity", "cnpv-ppv-specificity",
		"delta-ppv-prevalence", "cnpv-delta-prevalence" ];
var initialData = [ "", "0.8, 0.85,0.9, 0.95, 0.995",
		"0.6, 0.75, 0.8, 0.86, 0.92", "0.6, 0.7, 0.8, 0.9, 0.95",
		"0.39, 0.48, 0.59, 0.62, 0.78", "0.01, 0.05, 0.1", "1, 1.5, 2, 3" ];

var activeSelectionChange = false;
var validCombo = false;
var rulesViolationMsg = "";

var keysforfunction = [ {
	1 : "Sens"
}, {
	2 : "Spec"
}, {
	3 : "PPV"
}, {
	4 : "cNPV"
}, {
	5 : "Prev"
}, {
	6 : "Delta"
} ];
var keysforfunction = [ {
	1 : "sensitivity"
}, {
	2 : "specificity"
}, {
	3 : "ppv"
}, {
	4 : "cnpv"
}, {
	5 : "prevalence"
}, {
	6 : "delta"
} ];
var rfunctions = [ "SensPPVDelta", "SensPPVPrev", "SensSpecPPV",
		"SensPrevDelta", "SenscNPVDelta", "SenscNPVPrev", "SensSpeccNPV",
		"SensSpecPrev", "SpecPPVDelta", "SpecPPVPrev", "SpecPrevDelta",
		"SpeccNPVDelta", "SpeccNPVPrev" ];

var keyShort = [ {
	1 : "Prevalence"
}, {
	1 : 'Delta',
	2 : 'Specificity'
}, {
	1 : 'Prevalence'
}, {
	1 : 'PPV',
	2 : 'cNPV'
}, {
	1 : 'Prevalence'
}, {
	1 : 'Delta',
	2 : 'Specificity'
}, {
	1 : 'Prevalence'
}, {
	1 : 'PPV',
	2 : 'cNPV'
}, {
	1 : 'Prevalence'
}, {
	1 : 'Delta',
	2 : 'Sensitivity'
}, {
	1 : 'PPV',
	2 : 'cNPV'
}, {
	1 : 'Prevalence'
}, {
	1 : 'Delta',
	2 : 'Sensitivity'
} ];
var keyLong = [
		{
			1 : "Prevalence given desired PPV, delta, and sensitivity",
			2 : "Specificity given desired PPV, delta, and sensitivity"
		},
		{
			1 : "Delta given desired PPV, prevalence, and sensitivity",
			2 : "Specificity given desired PPV, prevalence, and sensitivity"
		},
		{
			1 : "Prevalence given desired PPV, specificity, and sensitivity",
			2 : "Delta given desired PPV, specificity, and sensitivity"
		},
		{
			1 : "Positive Predictive Value given sensitivity, prevalence, and delta",
			2 : "Complement of the Negative Predictive Value given sensitivity, prevalence, and delta"
		},
		{
			1 : "Prevalence given desired cNPV, delta, and sensitivity",
			2 : "Specificity given desired cNPV, delta, and sensitivity"
		},
		{
			1 : "Delta given desired cNPV, prevalence, and sensitivity",
			2 : "Specificity given desired cNPV, prevalence, and sensitvity"
		},
		{
			1 : "Prevalence given desired cNPV, specificity, and sensitivity",
			2 : "Delta given specificity and sensitivity"
		},
		{
			1 : "Positive Predictive Value given sensitivity, specificity, and prevalence",
			2 : "Complement of the Negative Predictive Value given sensitivity, specificity, and prevalence"
		},
		{
			1 : "Prevalence given desired PPV, delta, and specificity",
			2 : "Sensitivity given desired PPV, delta, and specificity"
		},
		{
			1 : "Delta given desired PPV, prevalence, and specificity",
			2 : "Sensitivity given desired PPV, prevalence, and specificity"
		},
		{
			1 : "Positive Predictive Value given specificity, prevalence, and delta",
			2 : "Complement of the Negative Predictive Value given specificity, prevalence, and delta",
			3 : "Sensitivity given delta and specificity"
		}, {
			1 : "Prevalence given desired cNPV, delta, and specificity",
			2 : "Sensitivity given desired cNPV, delta, and specificity"
		}, {
			1 : "Delta given desired cNPV, prevalence, and specificity",
			2 : "Sensitivity given desired cNPV, prevalence, and specificity"
		} ];

$(document).ready(function() {
	$('body').bind('beforeunload', function() {
	
		alert("We gonna clear some things up.");
	});



	createRulesDialog();

	$("select").change(function() {
		makeSelectionsUnique(functionnames, this.id);
	});

	if (typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	$("#reset").button().click(function() {
		resetPage();
	});

	$("input").keyup(function() {
		checkInputFields();
	});

	$("input").change(function() {
		checkInputFields();
	});


	$("input").bind("mouseup", function(e) {
		var $input = $(this);
		var oldValue = $input.val();

		if (oldValue === "")
			return;

	
	
		setTimeout(function() {
			var newValue = $input.val();
			if (newValue === "") {
			
				$input.trigger("cleared");
				checkInputFields();
			}
		}, 1);
	});
	$("#calculate").button().click(function(e) {
		e.preventDefault();
		if (checkRules() == "Fail") {
			$("#dialog-confirm").dialog("open");
			return false;
		} else {
			calculate();
		}
	});
	$("#add-test-data").click(function(e) {
		e.preventDefault();
		addTestData();
	});

	resetPage();
});

function addTestData() {

	$("#independent_dropdown").val("specificity");
	$("#contour_dropdown").val("prevalence");
	$("#fixed_dropdown").val("delta");

	makeSelectionsUnique(functionnames, "independent_dropdown");
	$("#independent").val("0.6, 0.75, 0.8, 0.86, 0.92");
	$("#contour").val("0.01, 0.05, 0.1");
	$("#fixed").val("1, 1.5, 2, 3");
	$("#calculate").button("option", "disabled", false);
	$(".variable-example").text("");
	addPopupDefinition();
}

var termLookup = {
	ppv : "PPV",
	cnpv : "cNPV",
	sensitivity : "Sens",
	specificity : "Spec",
	delta : "Delta",
	prevalence : "DP"
};

function addPopupDefinition() {
	var independent = $('#independent_dropdown').val();
	var contour = $('#contour_dropdown').val();
	var fixedValue = $('#fixed_dropdown').val();
	if (!!independent) {
		var independentTerm = termLookup[independent];
		createPopupDefinitionElement("indDef", independentTerm, independentTerm);
	}
	else {
		$("#indDef").html("");
	}
	if (!!contour) {
		var contourTerm = termLookup[contour];
		createPopupDefinitionElement("contourDef", contourTerm, contourTerm);
	}
	else {
		$("#contourDef").html("");
	}
	if (!!fixedValue) {
		var fixedValueTerm = termLookup[fixedValue];
		createPopupDefinitionElement("fvDef", fixedValueTerm, fixedValueTerm);
	}
	else {
		$("#fvDef").html("");
	}
	bindTermToDefine();
}

function createPopupDefinitionElement(elementId, termId, dataTerm) {
	$("#" + elementId)
			.html("<div class='termToDefine' id='" +
                  termId + "' data-term='" +
                  dataTerm +
                  "'><img src='/common/images/info.png' alt='pop up definition'></div><div class='popupDefinition' id='" +
                  termId + "Definition'></div>");
}

function resetPopupDefinition() {

	$("#indDef").html("");
	$("#contourDef").html("");
	$("#fvDef").html("");
}

function resetPage() {
	makeSelectionsUnique(functionnames, "independent_dropdown");
	$("span.variable-example").text("");
	$("option").removeAttr("disabled");
	$("#status-bar").css("visibility", "hidden");



	$("select").val("");
	$("input").val("");
	$("#output").empty();
	resetPopupDefinition();
}

function createRulesDialog() {
	$(function() {
		$("#dialog-confirm").dialog({
			resizable : false,
			height : 375,
			width : 400,
			autoOpen : false,
			buttons : {
				Yes : function() {
					$(this).dialog("close");
				
					calculate();
				},
				Cancel : function() {
					$(this).dialog("close");
				
				}
			},
			modal : true
		});
	});
}

function sortFloat(a, b) {
	return a - b;
}

function checkRules() {

	var overallStatus = "Pass";
	var numberOfRules = 5;
	var selectedVars = [];
	var values = [];
	var min = [];
	var max = [];
	rulesViolationMsg = "";
    var ids;


	ids = $("select").map(function() {
		return this.id;
	}).get();

	$.each(ids, function(key, elementId) {
		selectedVars.push($('#' + elementId).val());
	});

	ids = $("input").map(function() {
		return this.id;
	}).get();

	$.each(ids, function(key, elementId) {
	
		userInput = $('#' + elementId).val();
		temp = userInput.split(',');
		for (var i; i < temp.length; i++) {
			values[key].push(parseFloat(temp[i]));
		}

		values[key] = temp;
		sorted = values[key].sort(sortFloat);
		min[key] = sorted[0];
		max[key] = sorted[sorted.length - 1];
	});

	$(".rule").removeAttr("style");
	for (var ruleId = 1; ruleId <= numberOfRules; ruleId++) {
		if (checkRule(ruleId, selectedVars, values, min, max) == "Fail") {
			ruleClass = "rule" + ruleId;
			$("." + ruleClass).css("font-weight", "bold");
			overallStatus = "Fail";
		}
	}

	return overallStatus;

}

function checkRule(ruleId, vars, values, min, max) {

	status = "Pass";
	switch (ruleId) {
	case 1:
	
	
	
		minValue = 0;
		maxValue = 1;
		$
				.each(
						vars,
						function(key, selectedVar) {
							if (selectedVar != "delta") {
								if (min[key] < minValue || max[key] > maxValue) {
									status = "Fail";
									rulesViolationMsg += "<div>Rule: Specificity, Sensitivity, PPV, cNPV, Prevalence can only be 0 to 1</div>";
								}
							}
						});

		break;
	case 2:
	
	
	
		minValue = 0;
		maxValue = 5;
		$
				.each(
						vars,
						function(key, selectedVar) {
							if (selectedVar == "delta") {
								if (min[key] < minValue || max[key] > maxValue) {
									status = "Fail";
									rulesViolationMsg += "<div>Rule: Delta can be 0 to 5</div>";
								}
							}
						});
		break;
	case 3:
	
	
	
	
		prevalencePostion = $.inArray("prevalence", vars);
		if (cnpvPostion >= 0 && prevalencePostion >= 0) {
			if (max[cnpvPostion] >= min[prevalencePostion]) {
				status = "Fail";
				rulesViolationMsg += "<div>Rule: max(cNPV) < min(Prevalence)</div>";
			}
		}
		break;
	case 4:
	
	
	
		prevalencePostion = $.inArray("prevalence", vars);
		ppvPostion = $.inArray("ppv", vars);
		if (prevalencePostion >= 0 && ppvPostion >= 0) {
			if (max[prevalencePostion] >= min[ppvPostion]) {
				status = "Fail";
				rulesViolationMsg += "<div>Rule: max(prev) < min(PPV)</div>";
			}
		}

		break;
	case 5:
	
	
	
		specificityPosition = $.inArray("specificity", vars);
		if (sensitivityPosition >= 0 && specificityPosition >= 0) {
		
		
			if (max[sensitivityPosition] + max[specificityPosition] <= 1) {
				status = "Fail";
				rulesViolationMsg += "<div>Rule: max(sensitivity) + max(specificity) > 1</div>";
			}
		}
		break;
	}

	return status;
}

function checkInputFields() {
	var selectedValues = [];

	var ids = $("input").map(function() {
		return this.id;
	}).get();

	$.each(ids, function(key, elementId) {
		selectedValues.push($('#' + elementId).val().length);
	});
	if ($.inArray(0, selectedValues) == -1 && validCombo) {
		$("#calculate").button("option", "disabled", false);
	} else {
		$("#calculate").button("option", "disabled", true);
	}

}

function calculate() {


	var checkInput = [];



	checkInput.push(document.getElementById("independent").checkValidity());
	checkInput.push(document.getElementById("contour").checkValidity());
	checkInput.push(document.getElementById("fixed").checkValidity());
	if ($.inArray(false, checkInput) >= 0) {
		$("#status-bar").css("visibility", "visible");
		$("#status-bar")
				.html(
						"Invalid input array.  Enter a valid array of floating point values.");
		return;
	}


	$("#status-bar").text("");
	if (rulesViolationMsg.length > 0) {
		$("#status-bar").html(rulesViolationMsg);
		$("#status-bar").css("visibility", "visible");
	} else {
		$("#status-bar").css("visibility", "hidden");
	}

	var fixedArray = "";
	var contourArray = "";
	var independentArray = "";

	independentArray = $("#independent").val();

	independentArray = independentArray.replace(/[^\d,.-]/g, '');
	var independentval = $("#independent_dropdown").val();
	independentArraySplit = independentArray.split(",");
	var independentMin = Math.min.apply(Math, independentArraySplit);
	var independentMax = Math.max.apply(Math, independentArraySplit);
	contourArray = $("#contour").val();

	contourArray = contourArray.replace(/[^\d,.-]/g, '');
	var contourval = $("#contour_dropdown").val();
	var columnHeadings = contourArray.split(",");
	fixedArray = $("#fixed").val();

	fixedArray = fixedArray.replace(/[^\d,.-]/g, '');
	var fixedval = $("#fixed_dropdown").val();
	var fixedArraySplit = fixedArray.split(",");
	var fixedArraySize = fixedArraySplit.length;

	var fixed_dropdown = $("#fixed_dropdown").val();

	uniqueKey = (new Date()).getTime();

	var tabkey = [ "Prevalence_Odds_Length" ];


	var titlekeys = [
			"Sensitivity required to achieve specified PPV given prevalence and specificity",
			"Delta required to achieve specified PPV given prevalence and specificity" ];

	var abbreviatedkeys = [ "Sensitivity", "Delta" ];
	var numberOfKeysForCurrentFunction = 0;

	var keyvalueIndex = getKeyValueIndex(independentval, fixedval, contourval);
	if (keyvalueIndex >= 0) {
		var keyvalueShort = keyShort[keyvalueIndex];
		var keyvalueLong = keyLong[keyvalueIndex];
		for ( var key in keyvalueShort) {
			numberOfKeysForCurrentFunction++;
		}
		var eIndependent = document.getElementById("independent_dropdown");
		var selectedIndependentValue = eIndependent.options[eIndependent.selectedIndex].text;

		var eContour = document.getElementById("contour_dropdown");
		var selectedContourValue = eContour.options[eContour.selectedIndex].text;

	
	
		tableFirstRowLabel = selectedIndependentValue;
		tableFirstColLabel = selectedContourValue;
		open_threads = numberOfKeysForCurrentFunction.length;
		error_count = 0;

		$("#output").empty();

	

		tabs = $("<div id='tabs'> </div>");
		$("#output").append(tabs);
		tab_names = $("<UL> </UL>");
		tabs.append(tab_names);
		var spacing = "<p></p><p></p><p></p>";

		for (var i = 0; i < fixedArraySplit.length; i++) {
			tab_names.append("<LI><a  style='padding:3px;' href='#fixed-" +
                             (i + 1) + "'>" + fixed_dropdown + "<br>&nbsp&nbsp&nbsp " +
                             fixedArraySplit[i] + "</a></LI>");
			tab_pane = $("<div class='tab-pane' id='fixed-" + (i + 1) + 
                         "' >  </div>");
			tabs.append(tab_pane);
		
		
		
		
		
			for (key in keyvalueShort) {
			
			
			
			
				table_graph_div = $("<div class='set-" +
                                    keyvalueShort[key] + 
                                    (i + 1) + 
                                    "' style='width: 950px; float: left; clear:left;'><p></p></div>");
				tab_pane.append(table_graph_div);
				graphic_side = ("<div class='graphic-side' id='graphic-" +
                                keyvalueShort[key] + (i + 1) + 
                                "'><div style='clear:right;padding-top:10px;'> </div></div>");
				table_graph_div.append(graphic_side);
				table_side = $("<div class='table-side' id='table-" + keyvalueShort[key] + (i + 1) +
                               "'><br><div class='table-title'>" + keyvalueLong[key] +
                               "</div></div><br><br>");
				table_graph_div.append(table_side);
			
			
			
			}
		}
	
		tabs.tabs();

		for (var fixedValue = 0; fixedValue < fixedArraySplit.length; fixedValue++) {
			tabindex = fixedValue + 1;
		
			for ( var shortkey in keyvalueShort) {
				getData({
					key : keyvalueShort[shortkey],
					keyindex : shortkey,
					independentval : independentval,
					fixedval : fixedval,
					contourval : contourval,
					independent : independentArray,
					fixed : fixedArray,
					Contour : contourArray,
					Specmin : independentMin,
					Specmax : independentMax,
					uniqueId : uniqueKey,
					tab : tabindex,
					tabvalue : fixedArraySplit[fixedValue],
					abreviatedkey : keyvalueShort[shortkey]
				}, keyvalueShort[shortkey], tabindex,
						fixedArraySplit[fixedValue], uniqueKey,
						keyvalueShort[shortkey], columnHeadings);
			}
		}
	}
	else {
		$("#output").empty();
	}
}

function getKeyValueIndex(independentvalue, fixedvalue, contourvalue) {

	rfunctionname = getFunctionName(independentvalue, fixedvalue, contourvalue);


	for (var functions = 0; functions < rfunctions.length; functions++) {
		if (rfunctions[functions] == rfunctionname)
			return functions;
	}
	alert("no function mapping available");
	return -1;
}

function getFunctionName(independent, fixed, contour) {
	rFileName = "";
	var inputnames = [];
	inputnames[0] = independent;
	inputnames[1] = fixed;
	inputnames[2] = contour;
	for (var name = 0; name < functionnames.length; name++) {
		for (var variablename = 0; variablename < inputnames.length; variablename++) {
			if (functionnames[name] == inputnames[variablename]) {
				rFileName = rFileName.concat(keysforfunctionnames[name]);
			}
		}
	}
	return (rFileName);
}

function getData(data, tableTitle, tabnumber, tabValue, uniqueKey,
		abbreviatedKey, columnHeadings) {
	hostname = window.location.hostname;
	$.ajax({
		type : "POST",
		url : "http://" + hostname + "/riskStratAdvRest/cal",
		data : data,
		dataType : "json",
		success : function(data) {
			fillTable(data, columnHeadings, tabnumber, abbreviatedKey);
		},
		error : function(request, status, error) {
			handleError(error, status, request);
		},
		complete : function(data) {
		
			open_threads--;
			if (open_threads === 0) {
			
				if (error_count > 0) {
					alert("There were " + error_count + " errors with your request");
					error_count = 0;
				}
			}
			loadImage(tabnumber, tabValue.trim(), uniqueKey, abbreviatedKey);
		
		}
	});
}

function handleError(error, status, request) {



	$("#status-bar").text("");
	$("#status-bar").html("<div>" + error + "</div>");
	$("#status-bar").css("visibility", "visible");
	if (typeof console == "object") {
		console.info("Server AJAX Return Error");
		console.info("Type: " + error);
		console.info("Status: " + status);
		console.info("request object:");
		console.log(request.responseText);
	}
}

function fillTable(jsonTableData, columnHeadings, tabnumber, abbreviatedKey) {
	var independentArray = $("#independent").val();
	independentArraySplit = independentArray.split(",");

	var arr = [];
	var tableData = jsonTableData[0].data;
	var tableError = jsonTableData[0].table_error;
	var graphError = jsonTableData[0].graph_error;
	var tableErrorValue = tableError[0].errortrue;
	var graphErrorValue = graphError[0].errortrue;
	if (tableErrorValue != 1) {
		rows = tableData.length;
		for (i = 0; i < tableData.length; i++) {
			var values = [];
			row_entries = tableData[i];
			for ( var key in row_entries) {
				values.push(row_entries[key]);
			}
			arr.push(values);
		}

		var headings = [];
		for (i = 0; i < columnHeadings.length; i++) {
			headings.push({
				"sTitle" : columnHeadings[i]
			});
		}

		var tableId = "example-" + abbreviatedKey + tabnumber;
		var table = $("<table cellpadding='0' cellspacing='0' class='cell-border' id='" + tableId + "'></table>");
		$("#table-" + abbreviatedKey + tabnumber).append(table);

		table.dataTable({
			"aaData" : arr,
			"aoColumns" : headings,
			"bJQueryUI" : true,
			"bAutoWidth" : false,
			"bFilter" : false,
			"bSearchable" : false,
			"bInfo" : false,
			"bSort" : false,
			"bPaginate" : false,
			"bDestroy" : true,
			"aaSorting" : [ [ 0, "asc" ] ]
		});
	
		$("#" + tableId + " tr:first")
            .prepend("<th class='ui-state-default' colspan='2'></th>");
		var i = 0;
		$("#" + tableId + " tr:not(:first)")
            .each(
				function() {
					$(this).prepend(
							"<th class='ui-state-default sorting_disabled'>" + independentArraySplit[i] + "</th>");
					i++;
                });

	
		$("#" + tableId + " tr:eq(1)").prepend(
				"<th class='header' rowspan='" + independentArraySplit.length + "'><div class='vertical-text'>" + tableFirstRowLabel + "</div></th>");

	
		$("#" + tableId + " thead").prepend(
				"<tr><th class='header' colspan='2'></th><th class='header' colspan='5'>" + tableFirstColLabel + "</th></tr>");
	} else {
		$("#status-bar").css("visibility", "visible");
		$("#status-bar").addClass("status-error");
		$("#status-bar").append("<div>" + tableError[1].message + "</div>");
		if (graphErrorValue != 1) {
			$("#status-bar").append("<div>" + graphError[1].message + "</div>");
		}
	
	
	}
}

function getColumnHeaderData(columnHeadings) {
	var columnHeaderData2d = [];
	for ( var key in columnHeadings) {
		var tempObject = {};
		tempObject.mDataProp = columnHeadings[key];
		tempObject.sTitle = columnHeadings[key];
		tempObject.sWidth = "25%";
		columnHeaderData2d.push(tempObject);
	}
	return columnHeaderData2d;
}

function loadImage(tabNumber, tabValue, uniqueId, graphNamePreFix) {
	$('#graphic-' + graphNamePreFix + tabNumber).append(
			"<img style='height: 400px; text-align: right;' class='center' src='./tmp/" + graphNamePreFix +
        uniqueId + "-" + tabValue + ".png' alt='output image'>");
}

function isNumberBetweenZeroAndOne(n) {
	if (isNaN(parseFloat(n)))
		return false;
	if (n > 1)
		return false;
	if (n < 0)
		return false;
	return true;
}

function refreshGraph(drawgraph) {
	if (drawgraph == 1)
		graph_file = "./tmp/" + uniqueKey + "SensSpecLR.jpg?";
	else
		graph_file = "./images/fail-message.jpg?";

	d = new Date();
	$("#graph").attr("src", graph_file + d.getTime());
}

function ajax_error(jqXHR, exception) {
	refreshGraph(1);
	alert("ajax problem");
}

function makeSelectionsUnique(originalOptions, elementId) {

	var selectedValues = [];
	var disabledValues = [];

	$("#calculate").button("option", "disabled", true);

	if (activeSelectionChange === true)
		return;

	activeSelectionChange = true;


	var ids = $("select").map(function() {
		return this.id;
	}).get();


	$.each(ids, function(key, elementId) {
		selectedValues.push($('#' + elementId + ' option:selected').val());
	});


	for (var key = 0; key < ids.length; key++) {
		disabledValues = [];
		for (var i = 0; i < selectedValues.length; i++) {
			if (i != key && selectedValues[i] !== "") {
				disabledValues.push(selectedValues[i]);
			}
		}

		dropdownBoxId = ids[key];
		removeAllOptions(dropdownBoxId);
		addAllOptions(dropdownBoxId, originalOptions, disabledValues);

	
		$('#' + dropdownBoxId).val(selectedValues[key]).change();
	}



	setInitialValue(elementId);
	checkForInvalidVariableCombo(elementId);
	activeSelectionChange = false;

}

function removeAllOptions(eid) {
	element = document.getElementById(eid);
	var i;
	for (i = element.options.length - 1; i >= 0; i--) {
		element.remove(i);
	}
}

function addAllOptions(dropdownBoxId, originalOptions, disabledOptions) {
	for (var optionKey = 0; optionKey < originalOptions.length; optionKey++) {
		if ($.inArray(originalOptions[optionKey], disabledOptions) > -1) {
			attribute = $('#' + dropdownBoxId).append(
					$("<option></option>").attr("value",
							originalOptions[optionKey]).attr('disabled',
							'disabled').text(originalOptions[optionKey]));
		} else {
			attribute = $('#' + dropdownBoxId).append(
					$("<option></option>").attr("value",
							originalOptions[optionKey]).text(
							originalOptions[optionKey]));
		}
	}
}

function checkForValidRange() {


}

function setInitialValue(textboxId) {

	selectedOption = $("#" + textboxId + " option:selected").val();
	key = $.inArray(selectedOption, functionnames);

	eSelect = document.getElementById(textboxId);

	eSelect2 = $(eSelect).parent().parent()[0];



	$(eSelect2).find(":input").val("");
	$(eSelect2).find("span").text(initialData[key]);


	$('#' + textboxId).val(selectedOption).change();
	addPopupDefinition();

}

function checkForInvalidVariableCombo() {



	var selectedValues = [];
	var ids = $("select").map(function() {
		return this.id;
	}).get();


	$.each(ids, function(key, elementId) {
		selectedValues.push($('#' + elementId + ' option:selected').val());
	});


	blankCount = $.inArray("", selectedValues);
	if ($.inArray("", selectedValues) == -1) {
	
		selectedValuesSorted = selectedValues.sort();
		selectedValuesSortedString = selectedValues.join("-");

		if ($.inArray(selectedValuesSortedString, invalidCombos) >= 0) {
		
			userSelectedVariables = selectedValues[0].toString() + ", " + selectedValues[1].toString() + ",  and " + selectedValues[2].toString();
			message = "The variables " + userSelectedVariables + " do not form a valid variable combination for this calculation.  " + "Please select a vaild variable combination.";
			$("#status-bar").css("visibility", "visible");
			$("#status-bar").addClass("status-error");
			$("#status-bar").removeClass("status-info");
			$("#status-bar").text(message);
			validCombo = false;
		} else {
		
			$("#status-bar").css("visibility", "hidden");
			$("#status-bar").addClass("status-error");
			$("#status-bar").removeClass("status-info");
			$("#status-bar").text("");
			validCombo = true;
		}
	} else {
	
		$("#status-bar").css("visibility", "hidden");
		$("#status-bar").addClass("status-info");
		$("#status-bar").removeClass("status-error");
		$("#status-bar").text("");
		validCombo = false;

		return;

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

										

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

												

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

										

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

														

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

										

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

												

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

										

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

																

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

										

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

												

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

										

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

														

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

										

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

												

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

										

		

				

		

						

		

				

		

								

		

				

		

						

		

				

		

	}

}

$(function(){
	
	random_gen();
	disable_calculate();

       
        $('.post').click(function(){
	  $("#spinner").show(); 
          $("#message").hide(); 
          $.ajax({
            type: 'POST',
           
            contentType: 'application/json',
           
           
            data: JSON.stringify({
              k: $("#independent").val(),
              sens: trim_spaces($("#sensitivity_val").text()),
	      spec: trim_spaces($("#specificity_val").text()),
              prev: $("#prevalence").val(),
              N: $("#n_value").val(),
              unique_id: $("#randomnumber").text(),
	      fixed_flag:$("#fixed_flag").text() 
            }),
           
            dataType: 'json',
            url: '/sampleSizeRest/',
            success: function (ret) {
	      $("#spinner").hide();
	      $("#output_graph").empty();
          	generate_tabs($("#fixed").val(),$("#randomnumber").text());
	  	generate_tables(ret);
                random_gen();
      },
	    error: function(jqXHR, textStatus, errorThrown) {
		$("#spinner").hide();
		console.log("header: " + jqXHR + "\n" + "Status: " + textStatus + "\n\nThe server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.");
		message = 'Service Unavailable: ' + textStatus + "<br>";
		message += "The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.<br>";
		$("#message-content").empty().append(message);	   
		$("#message").show();    
	    },
          });

	return false;
        });
});

$(function(){
	$('.reset').click(function(){
		$('#ss')[0].reset();
	});

	$("#add-test-data").click(function() {
		example_code();
	});	

	$("#contour").keyup(function(){
		change_hidden('contour');
	});

	$("#fixed").keyup(function(){
		change_hidden('fixed');
	});

});


function generate_tables(jsonrtn){
for(var i in jsonrtn) {
    console.log(i);
    var tablesvar = "<TABLE class='table_data'><TBODY>";
    tablesvar += "<TR><TH class='table_data header'>Sensitivity</TH><TH class='table_data header'>Optimal K</TH><TH class='table_data header'>Relative efficiency gain or <br>loss compared to k = 0.5</TH></TR>";
    ppvtabledata = tablesvar;
    cnpvtabledata = tablesvar;
    for (n=0; n<jsonrtn[i].PPVData.length; n++) {
    	console.log("PPVData");
    	ppvtabledata += "<TR><TD>"+jsonrtn[i].PPVData[n].Sensitivity+"</TD>";
    	ppvtabledata += "<TD>"+jsonrtn[i].PPVData[n]["Optimal k"]+"</TD>";
    	ppvtabledata += "<TD>"+jsonrtn[i].PPVData[n]['Relative efficiency gain or loss compared to k = 0.5']+"</TD>";
    	console.log("cNPVData");
    	cnpvtabledata += "<TD>"+jsonrtn[i].cNPVData[n].Sensitivity+"</TD>";
    	cnpvtabledata += "<TD>"+jsonrtn[i].cNPVData[n]["Optimal k"]+"</TD>";
    	cnpvtabledata += "<TD>"+jsonrtn[i].cNPVData[n]['Relative efficiency gain or loss compared to k = 0.5']+"</TD></TR>";
    }
    ppvtabledata += "</TBODY></TABLE>";
    cnpvtabledata += "</TBODY></TABLE>";
    $("#"+i+"ppvdata").append(ppvtabledata);
    $("#"+i+"cnpvdata").append(cnpvtabledata);
}
}

function disable_calculate(){
	$('.post').prop("disabled", true);
}

function enable_calculate(){
	$('.post').removeAttr("disabled");
}

function generate_tabs(iterate,randomnumber){
      var fixed_flag = $("#fixed_flag").text();
      var fixedvals=iterate.split(',');
      var arrayLength = fixedvals.length;
      $("#output_graph").empty();
      var tabheaders = "<ul>";
      var tabcontent="";
      var pimagename="PPVkSensSpec-";
      var cimagename="cNPVkSensSpec-";

      var fixedtype=$("#fixed_flag").text();
      console.log("Fixed flag is "+fixedtype);
      if (fixedtype === "Sensitivity"){
          pimagename="PPVkSpecSens-";
          cimagename="cNPVkSpecSens-";
      }
	
      for (var i = 0; i < arrayLength; i++) {
           console.log(fixedvals[i]);
	   tabheaders += '<li><a href="#tab'+(i+1)+'">'+fixed_flag+'<br />'+fixedvals[i]+'</a></li>';
          
           tabcontent += '<div id="tab'+(i+1)+'"> <TABLE><TR><TD> <TABLE><TR><TD><IMG SRC="/sampleSize/tmp/'+pimagename+randomnumber+'-'+(i+1)+'.png"></TD></TR> <TR><TD><div id="tab'+(i+1)+'ppvdata"><div></TD></TR></TABLE> </TD><TD> <TABLE><TR><TD><IMG SRC="/sampleSize/tmp/'+cimagename+randomnumber+'-'+(i+1)+'.png"></TD></TR> <TR><TD><div id="tab'+(i+1)+'cnpvdata"></div></TD></TR></TABLE> </TD></TR></TABLE> </div>';	  
 
   
      }    
      tabheaders += "</ul>";
     

      tabs = $("<div id='tabs'> </div>");
      $("#output_graph").append(tabs);
      $("#tabs").append(tabheaders);
      $("#tabs").append(tabcontent);

      $("#tabs").tabs();

}

function change_ff(){
	$("#fixed_flag").text($("#fixed_dropdown option:selected").text());
}

function lock_fixed_options(){
	var contour = $("#contour_dropdown option:selected").text();
        $("#fixed_dropdown").empty();
	if (contour === "Specificity"){
                $("#fixed_dropdown").append('<option value="specificity" disabled="disabled">Specificity</a>');
		$("#fixed_dropdown").append('<option value="sensitivity" selected>Sensitivity</a>');
		$("#specificity_val").text($("#contour").val());
                $("#sensitivity_val").text($("#fixed").val());
	}
        if (contour === "Sensitivity"){
                $("#fixed_dropdown").append('<option value="specificity" selected>Specificity</a>');
                $("#fixed_dropdown").append('<option value="sensitivity" disabled="disabled">Sensitivity</a>');
		$("#sensitivity_val").text($("#contour").val());
		$("#specificity_val").text($("#fixed").val());
        }
	change_ff();
}




function change_hidden(callingbox){
		if (((callingbox == "contour")) && ($("#contour_dropdown option:selected").text() == "Specificity")) {   
             	  $("#specificity_val").text(trim_spaces($("#contour").val()));
		}else if (((callingbox == "contour")) && ($("#contour_dropdown option:selected").text() == "Sensitivity")){
		  $("#sensitivity_val").text(trim_spaces($("#contour").val()));
                }else if (((callingbox == "fixed")) && ($("#fixed_dropdown option:selected").text() == "Sensitivity")){
                  $("#sensitivity_val").text(trim_spaces($("#fixed").val()));
                }else if (((callingbox == "fixed")) && ($("#fixed_dropdown option:selected").text() == "Specificity")){
                  $("#specificity_val").text(trim_spaces($("#fixed").val()));
	        }else{
		  return 0;
		}
}

function trim_spaces(varstring){
		return varstring.replace(/\s/g, '');	
}

function example_code(){
                $("#message").hide();
		$("#independent").val("0,1");
		$("#contour").val("0.8,0.9,0.95,0.995");
		$("#contour_dropdown").val("sensitivity");
		$("#fixed").val("0.7,0.8,0.9");
		$("#fixed_dropdown").val("specificity");
		$("#prevalence").val("0.001");
		$("#n_value").val("1");
		$("#fixed_flag").text("Specificity");
		change_hidden("contour");
		change_hidden("fixed");
		enable_calculate();
}

function reset_code(){
                $("#independent").val("0,1");
                $("#contour").val("");
                $("#contour_dropdown").val("");
                $("#fixed").val("");
                $("#fixed_dropdown").val("");
                $("#prevalence").val("");
                $("#n_value").val("");
                $("#fixed_flag").text("");
		$("#output_graph").empty();
		$("#message").empty();
          	$("#message-content").empty();
          	$("#message").hide();
		disable_calculate();
       
       
}



function random_gen(){
          var randomno = Math.floor((Math.random() * 1000) + 1);
          $("#randomnumber").text(randomno);
}



var currentMarkers = 1;

$(document).ready(function () {
    $(".loader,#results,#errors, .bm_1, .bm_2, .bm_3").hide();
    controls_visibility(currentMarkers);
    bind_control_events();
    create_popover();

    $('.termToDefine, .dd.termToDefine').on('click', display_definition);
});

function bind_control_events() {
    $("#errors").alert();
   
    $('a#test1,a#test2').on('click', test);

    $('#reset').on('click', reset);
    $('#add-marker').on('click', new_marker);
    $('#delete-marker').on('click', delete_marker);
    $('#calculate').on('click', calculate);

    bind_accordion_action($('#markers').children().first());
}

function bind_accordion_action(el) {
   
   
   
   
   
}

function controls_visibility(numElements) {
   
    if (numElements == 2) {
        $('#delete-marker').show();
        $('#add-marker').show();
    }
    if (numElements > 2) {
        $('#delete-marker').show();
        $('#add-marker').hide();
    }
    if (numElements < 2) {
        $('#delete-marker').hide();
        $('#add-marker').show();
    }
}

function new_marker() {
    var counter = currentMarkers + 1;
    if (currentMarkers <= 3) {
        var markerTemplate = $('#markers').find('.marker').first();

       
        var newElement = markerTemplate.clone();

       
        newElement.removeClass('marker-1').addClass("marker-" + counter);

       
        newElement.find('.input,input').each(function () {
            if ($(this).is("input")) {
                $(this).val("");
            }
            if ($(this).is("select")) {
               
                $(this)[0].selectedIndex = 0;
            }
        });

       
        newElement.find(".panel-heading").each(function (index) {
            var panel_id = '#marker-' + counter + '-option-' + (index + 1);

            $(this).attr('data-target', panel_id);
            $(this).attr('data-parent', '.marker-' + counter);
        });

       
        newElement.find(".panel-collapse").each(function (index) {
            var newPanelContentId = 'marker-' + counter + '-option-' + (index + 1);
            $(this).attr("id", newPanelContentId);
            bind_accordion_action(this);
        });

       
        newElement.find('.marker-title').text("Biomarker #" + counter);
        newElement.find('.termToDefine, .dd.termToDefine')
            .on('click', display_definition);

        currentMarkers++;
       
       
        controls_visibility(currentMarkers);

       
       
        $(newElement[0]).insertAfter($('#markers').children().last());
    }
}

function delete_marker() {
    if (currentMarkers > 1) {
       
        $('#markers').children().last().empty();
        $('#markers').children().last().remove();
        $('.bm_'+currentMarkers).hide();
        currentMarkers--;
    }
    controls_visibility(currentMarkers);
    scrollTop();
}

function calculate() {
    var service;
    var valuesObj = extract_values(false);
    var valid = valuesObj[1];
    if (valid) {
        var input = JSON.stringify(valuesObj[0]);

        var host = window.location.hostname;
        if (host == 'localhost') {
           
            service = 'output_example.json';
        } else {
            service = "http://" + host + "/mrsRest/";
        }

        var to_value = 10 * 1000;

        $('#loader').show();

       
        var promise = $.ajax({
            dataType: 'json',
            method: 'POST',
            contentType: 'application/json',
            url: service,
            data: input,
            timeout: to_value
        });

        promise.then(clean_data, function (error) {
            $("#results, .bm_1, .bm_2, .bm_3").hide();
            display_errors("The service call has failed with the following status: " + error.statusText);
        });

        promise.done(return_data);
        scrollTop();
    }
}

function scrollTop() {
    $('html, body').animate({
        scrollTop: 0
    });
}

function clean_data(data) {
   
    return JSON.parse(JSON.stringify(data));
}

function return_data(data) {
    i = 0;

   
    $("#results, .bm_1, .bm_2, .bm_3").hide();

    do {
        i++;
       
        $('.bm_' + i).show();
    } while (i != currentMarkers);

    $.each(data, function (propName, paramGroup) {
        var ci_lb, ci_ub, params, calc, marker_id;
        append_name();

        params = paramGroup.parameters;
        calc = paramGroup.calculations;
        marker_id = propName;

       
        $.each(params, function (name) {

            var lookup_id = lookup[name];
            var data_item = params[name];
            var formattedText = data_item.Value;
            if (lookup_id != 'rr' && lookup_id != 'nnr' && lookup_id != 'nns') {
                formattedText += "%  ";
                if (data_item["Confidence Interval (lower bound)"] !== null &&
                    data_item["Confidence Interval (upper bound)"] !== null) {
                    ci_lb = data_item["Confidence Interval (lower bound)"];
                    ci_ub = data_item["Confidence Interval (upper bound)"];
                    formattedText += " (" + ci_lb + "%, " + ci_ub + "%)";
                }
            }
            else {
                if (data_item["Confidence Interval (lower bound)"] !== null &&
                    data_item["Confidence Interval (upper bound)"] !== null) {
                    ci_lb = data_item["Confidence Interval (lower bound)"];
                    ci_ub = data_item["Confidence Interval (upper bound)"];
                    formattedText += " (" + ci_lb + ", " + ci_ub + ")";
                }
            }
           
            cell = $('#' + lookup_id + '_result.' + marker_id + '.output');
            cell.attr('title', lookup_id + " " + formattedText);
            cell.text(formattedText);
        });
       
        $.each(calc, function (name) {
            var lookup_id = lookup[name];
            var data_item = calc[name];
            var formattedText = data_item.Value;

            if (lookup_id != 'rr' && lookup_id != 'nnr' && lookup_id != 'nns') {
                formattedText += "%  ";
                if (data_item["Confidence Interval (lower bound)"] !== null &&
                    data_item["Confidence Interval (upper bound)"] !== null) {
                    ci_lb = data_item["Confidence Interval (lower bound)"];
                    ci_ub = data_item["Confidence Interval (upper bound)"];
                    formattedText += " (" + ci_lb + "%, " + ci_ub + "%)";
                }
            }
            else {
                if (data_item["Confidence Interval (lower bound)"] !== null &&
                    data_item["Confidence Interval (upper bound)"] !== null) {
                    ci_lb = data_item["Confidence Interval (lower bound)"];
                    ci_ub = data_item["Confidence Interval (upper bound)"];
                    formattedText += " (" + ci_lb + ", " + ci_ub + ")";
                }
            }

            cell = $('#' + lookup_id + '_result.' + marker_id + '.output');
            cell.attr('title', lookup_id + " " + formattedText);
            cell.text(formattedText);
        });
    });

    $("#results").show();
    $("#loader").hide();
}

function append_name() {
    var i = 0;
    var name;
    do {
        i++;
        var thisNameInputElement = $('.marker-' + i + ' .name-input');
       
        if ((thisNameInputElement.val()).length > 0)
            name = thisNameInputElement.val() + " (CI Low, CI High)";
        else
            name = "Biomarker " + i + " (CI Low, CI High)";

       
        $('#results').find('table thead tr .bm_' + i).attr('title', name).text(name);
    } while (i != currentMarkers);
}

function extract_values(valid) {
    var values = {};

   
    i = 0;
    do {
        i++;

        values["bm_" + i] = {};
        var thisMarker = $('.marker-' + i);

       
        var option_1_controls = thisMarker.find('#marker-' + i + '-option-1 .input').serializeArray();
        var option_2_controls = thisMarker.find('#marker-' + i + '-option-2 .input').serializeArray();
        
        var append_values = function (element) {
           
            if (element.value.length > 0) {
                values["bm_" + i].option = 1;
                values["bm_" + i][element.name] = element.value;
            }
        };
        
        option_1_controls.forEach(append_values);

       
        if (!values["bm_" + i].option) {

           
            values["bm_" + i].option = 2;

            var param_1 = [];
            var param_2 = [];
            var param_3 = [];
            var param_4 = [];
            var mapping_pairs = function (obj) {
               
                if (obj.name == "param_1" && obj.value.length > 0) {
                    param_1.push(obj);
                }
                if (obj.name == "param_2" && obj.value.length > 0) {
                    param_2.push(obj);
                }
                if (obj.name == "param_3" && obj.value.length > 0) {
                    param_3.push(obj);
                }
                if (obj.name == "sampsize" && obj.value.length > 0) {
                    param_4.push(obj);
                }
            };
            
            option_2_controls.filter(mapping_pairs);
            
            if (param_1.length > 1 && param_2.length > 1 && param_3.length > 1 && param_4.length > 0) {
               
                values["bm_" + i][param_4[0].name] = param_4[0].value;

                var value_length = [param_1[1].value.length, param_2[1].value.length, param_3[1].value.length];

                value_length.forEach(function (el) {
                    if (el > 0) {
                        valid = false;
                       
                        joinObjects(values["bm_" + i], param_1[0], param_1[1]);
                        joinObjects(values["bm_" + i], param_2[0], param_2[1]);
                        joinObjects(values["bm_" + i], param_3[0], param_3[1]);
                    }
                });
            }
           
           
           
        }
    } while (i != currentMarkers);

    valid = validate(values);
    return [values, valid];
}

function joinObjects(parentObj, obj1, obj2) {
   
   
    parentObj[obj1.value] = obj2.value;
    return parentObj;
}

function reset() {
   
    var markerChildren = $('#markers').children();

   
    $('select').find('option:first').attr('selected', 'selected');
    $('input').val('');

   
    $('.output').text('');
    $("#results, .bm_1, .bm_2, .bm_3").hide();

   
    $("#errors").fadeOut();

   
    markerChildren.not(':first').each(function () {
        $(this).empty();
        $(this).remove();
    });
    currentMarkers = 1;
    controls_visibility(currentMarkers);
}
function create_popover() {
    var term_element = $('.termToDefine');
    term_element.attr('data-toggle', 'popover');
    term_element.attr('role', 'button');
    term_element.attr('tabindex', '');
}

function display_definition() {
   
   
    var $self = $(this);
    var id;
   
    if (!$self.hasClass('dd')) {
        if (!$self.hasClass('header') && $self.prop('tagName') != 'TD')
            id = ($self.attr('class')).replace('termToDefine', '').trim();
        if ($self.prop('tagName') == 'TD')
            id = ($self.attr('class')).replace('termToDefine', '').trim();
        else
            id = $self.attr('id');
    }
    else {
       
        id = $self.prev().val();
    }

    var definition = definitionObj[id].definition;
    var term = definitionObj[id].term;

    if (definition || term) {
        $self.popover(
            {container: 'body',
                trigger: 'manual',
                placement: 'top',
                title: term,
                content: definition}
        ).on('mouseout', function () {
                $self.popover('hide');
                $self.popover('destroy');
            });

        $self.popover();
        $self.popover('show');
    }
}


var definitionObj = {
    prob_m: {
        term: "Marker Positivity (M+)",
        definition: "Marker positivity, or probability of positive test result for biomarker"
    },
    m_neg: {
        term: "Marker Negativity (M-)",
        definition: "Negative test result for biomarker test"
    },
    prob_d: {
        term: "Disease Positive (D+)",
        definition: "Disease prevalence, or probability of disease"
    },
    d_neg: {
        term: "Disease Negative (D-)",
        definition: "Does not have disease"
    },
    concern: {
        term: "Concern",
        definition: "Increase in disease risk from testing positive. Formula: Concern = PPV-P(D+)"
    },
    reassurance: {
        term: "Reassurance",
        definition: "Reduction in disease risk from testing negative. Formula: Reassurance = P(D+)-cNPV"
    },
    pbs: {
        term: "Population Burden Stratification (PBS)",
        definition: "Extra disease detection in positive group than negative group. " +
        "Formula: PBS = a-b"
    },
    nns: {
        term: "Number Needed to Screen",
        definition: "Definition for number needed to screen. Formula: Usual NNS = 1/RD"
    },
    nnr: {
        term: "Number Needed to Recruit",
        definition: "To detect 1 more disease case in positive group than negative group. Formula: NNR = 1/PBS"
    },
    max_mrs: {
        term: "Maximum possible MRS for a disease with this prevalence",
        definition: "Maximum possible MRS for a disease with this prevalence. Formula: max risk strat=2q(1-q)"
    },
    q_spec: {
        term: "Quality of the specificity",
        definition: "Increase in specificity versus a random test, fixing test positivity"
    },
    q_sens: {
        term: "Quality of the sensitivity",
        definition: "Increase in sensitivity versus a random test, fixing test positivity. Formula: Danger*=ybar=sens-p"
    },
    spec: {
        term: "Specificity",
        definition: "Specificity is the proportion whose biomarker test is negative (below the threshold) among" +
        " those without disease. Formula: Reassurance*=xbar=spec-(1-p)"
    },
    sens: {
        term: "Sensitivity",
        definition: "Sensitivity is the proportion whose biomarker test is positive (above the threshold) among " +
        "those who are positive for disease."
    },
    ppv: {
        term: "Positive Predictive Value (PPV)",
        definition: "Probability of disease, given a positive test result from biomarker.  Unlike sensitivity " +
        "and specificity, PPV's reflect disease prevalence and is useful for risk stratification."
    },
    npv: {
        term: "Negative Predictive Value (NPV)",
        definition: "Definition for NPV"
    },
    mrs: {
        term: "Mean Risk Stratification (MRS)",
        definition: "Average change in pretest-posttest disease risk. Formula: MRS=2tp(1-p)"
    },
    sampsize: {term: "Sample Size", definition: ""},
    test: {term: "Test", definition: "empty"},
    auc: {
        term: "Area under the receiver operator characteristic curve",
        definition: " for a biomarker is the average sensitivity (or, equivalently, the integral of the sensitivity) in " +
        "the interval of cSpecificity from 0 to 1 (specificity from 1 to 0), itself equal to the area between the ROC " +
        "curve and the x-axis."
    },
    cnpv: {
        term: "Complement of Negative Predictive Value (cNPV)",
        definition: "Probability of disease, given a negative test result from biomarker. Unlike sensitivity and " +
        "specificity, cNPV's reflect disease prevalence and is useful for risk stratification."
    },
};
var lookup = {
    "Danger": "concern",
    "Reassurance": "reassurance",
    "Quality of the sensitvity": "q_sens",
    "Quality of the specificity": "q_spec",
    "Mean Risk Stratification": "mrs",
    "Maximum possible MRS": "max_mrs",
    "Population Burden Stratification": "pbs",
    "Number Needed to Recruit": "nnr",
    "Number Needed to Screen": "nns",
    "a": "a",
    "b": "b",
    "c": "c",
    "d": "d",
    "P(D+,M+)": "d_pos",
    "P(D+,M-)": "pos_d_neg_m",
    "P(D-,M+)": "neg_d_pos_m",
    "P(D-,M-)": "m_neg",
    "Marker Positivity": "prob_m",
    "Disease Prevalence": "prob_d",
    "Positive Predictive Value": "ppv",
    "complement of the Negative Predictive Value": "c_npv",
    "Sensitivity": "sens",
    "Specificity": "spec",
    "complement of the Specificity": "c_spec",
    "RR": "rr",
    "Risk Difference": "r_diff",
    "Youden": "youden",
    "Area Under the Curve": "auc",
    "Confidence Interval (lower bound)": "ci_lb",
    "Confidence Interval (upper bound)": "ci_ub",
    "Value":"value",
    "Test":"test"
};
var values_option_1_bm = [
    {"markerName": "HPV", "a": 471, "b": 13, "c": 4680, "d": 25207},
    {"markerName": "Pap", "a": 466, "b": 25, "c": 4484, "d": 25396},
    {"markerName": "VIA", "a": 270, "b": 225, "c": 2967, "d": 26909}
];

var values_option_2_bm = [{
    "markerName": "HPV",
    "ppv": 0.0914,
    "npv": 0.95,
    "prob_m": 0.1696,
    "sampsize": 30371
},
    {
        "markerName": "Pap",
        "ppv": 0.0842,
        "npv": 0.9,
        "prob_m": 0.163,
        "sampsize": 30371
    },
    {
        "markerName": "VIA",
        "ppv": 0.0834,
        "npv": 0.17,
        "prob_m": 0.1066,
        "sampsize": 30371
    }];
function setup_test() {
    $.when(reset).done(function () {
        if ($('#markers').children().length != 1) {
            reset();
        }

       
        new_marker();
        new_marker();
    });
}

function test() {
    setup_test();
   
    var choice = $(this).prop('id');

    $('#markers').children().each(function (key, markerElement) {
        var id;

        if (choice == "test1") {
           
            $(this).find('.collapse:first').addClass('in');
            $(this).find('.collapse:last').removeClass('in');

            id = $(this).find('.collapse.in').prop('id');

           
            $(markerElement).find('[name="name-input"]').val(values_option_1_bm[key].markerName);
            $('#' + id).find('#a').val(values_option_1_bm[key].a);
            $('#' + id).find('#b').val(values_option_1_bm[key].b);
            $('#' + id).find('#c').val(values_option_1_bm[key].c);
            $('#' + id).find('#d').val(values_option_1_bm[key].d);
        }

        if (choice == "test2") {
           
            $(this).find('.collapse:last').addClass('in');
            $(this).find('.collapse:first').removeClass('in');

            id = $(this).find('.collapse.in').prop('id');

            var data = [
                values_option_2_bm[0],
                values_option_2_bm[1],
                values_option_2_bm[2]
            ];
           
            $(markerElement).find('input[name="name-input"]').val(data[key].markerName);
           
            $(markerElement).find('input[name="sampsize"]').val(data[key].sampsize);

            var dataItem = data[key];

           
            $(markerElement).find('input[name="param_1"]').val(dataItem.ppv);

           
            $(markerElement).find('input[name="param_2"]').val(dataItem.npv);

           
            $(markerElement).find('input[name="param_3"]').val(dataItem.prob_m);
        }
    });
}
function validate(values) {
    var valid = true;
    var messages = [];

    $("#errors").empty();

    var $this = document.getElementsByTagName('form').markers;
    var invalidElements = $($this).find(':invalid');

    for (var item in values) {
        var marker_value_keys = Object.keys(values[item]);
       
        if (marker_value_keys.length < 2) {
            valid = false;
            messages.push('You must enter values for either option 1 or 2 in each biomarker.');
        }
    }

    for (var i = 0; i != invalidElements.length; i++) {
        var text;
        valid = invalidElements[i].valid;
        var validityObj = invalidElements[i].validity;
        if (validityObj.badInput) {
            text = "The value you entered contains an invalid character. " +
                invalidElements[i].validationMessage;
        }
        if (validityObj.patternMismatch) {
            text = "The value you entered '" + invalidElements[i].value + "' contains an invalid character. " +
                invalidElements[i].validationMessage;
        }
        if (validityObj.rangeOverflow || validityObj.rangeUnderflow) {
            if (invalidElements[i].min && invalidElements[i].max) {
                text = "The value you entered '" + invalidElements[i].value + "' must be decimal value between " +
                    invalidElements[i].min + " and " + invalidElements[i].max;
            }
            else if (invalidElements[i].min && !invalidElements[i].max) {
                text = "The value you entered '" + invalidElements[i].value + "' must be decimal value greater than " +
                    invalidElements[i].min;
            }
            else {
                text = "The value you entered '" + invalidElements[i].value + "' must be decimal value less than " +
                    invalidElements[i].max;
            }
        }
       
        if ($.inArray(text, messages) == -1) messages.push(text);
    }

    if (messages.length > 0) {
        valid = false;
        display_errors(messages);
    }
    else $("#errors").fadeOut();

    return valid;
}

function display_errors(message) {
    var text = "";

    if ($.isArray(message) && message.length > 0) {
        $(message).each(function (i, v) {
            text += "<li>" + v + "</li>";
        });
    }
    if (typeof message == "string") {
        text = message;
    }
    if($('#errors').length > 0){
        $("#errors").empty();
        $("#errors").remove();
    }

    $(".title.text-center").after("<div id='errors' class='alert alert-danger fade in'><a href='#' data-dismiss='alert' class='close'>&times;</a>" +
        "<ul class='list-unstyled'>" + text + "</ul></div>");

    $('#errors').fadeIn();
    scrollTop();
}