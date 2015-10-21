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
var validation_rules = [
  'Specificity, Sensitivity, PPV, cNPV, and Prevalence can only be 0 to 1',
  'Delta can be 0 to 5',
  'cNPV < Prevalence',
  'For arrays: max(cNPV) < min(Prevalence)',
  'Prevalence < PPV',
  'For arrays: max(prev) < min(PPV)',
  'Sensitivity+Specificity-1 > 0'
];
var keysforfunctionnames = [ "", "Sens", "Spec", "PPV", "cNPV", "Prev", "Delta" ];
var functionnames = [ "", "sensitivity", "specificity", "ppv", "cnpv", "prevalence", "delta" ];
var invalidCombos = [ "delta-sensitivity-specificity", "cnpv-delta-ppv", "cnpv-ppv-prevalence", "cnpv-ppv-sensitivity", "cnpv-ppv-specificity", "delta-ppv-prevalence", "cnpv-delta-prevalence" ];
var initialData = [ "", "0.8, 0.85,0.9, 0.95, 0.995", "0.6, 0.75, 0.8, 0.86, 0.92", "0.6, 0.7, 0.8, 0.9, 0.95", "0.39, 0.48, 0.59, 0.62, 0.78", "0.01, 0.05, 0.1", "1, 1.5, 2, 3" ];

var validCombo = false;
var rulesViolationMsg = [];

var rfunctions = [ "SensPPVDelta", "SensPPVPrev", "SensSpecPPV", "SensPrevDelta", "SenscNPVDelta", "SenscNPVPrev", "SensSpeccNPV", "SensSpecPrev", "SpecPPVDelta", "SpecPPVPrev", "SpecPrevDelta", "SpeccNPVDelta", "SpeccNPVPrev" ];

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

var thisTool;
var columnHeadings;

$("a[href='#riskStratAdvanced']").on("shown.bs.tab",function(e){
  thisTool = $("#riskStratAdvanced");
});

$(document).ready(function(){
  thisTool = $("#riskStratAdvanced");

  thisTool.find("select").on('change',function() {
    makeSelectionsUnique(this.id);
  });

  thisTool.find("#reset").on("click", resetPage);
  thisTool.find("input").keyup(checkInputFields);
  thisTool.find("input").change(checkInputFields);
  thisTool.find("#add-test-data").click(addTestData);
  thisTool.find("#download").on("click", retrieve_excel);
  thisTool.find("#calculate").on("click", function(e) {
    e.preventDefault();
    $("#errors, #download").fadeOut().addClass("hide");
    if (checkRules() == "Fail") {
      display_errors(validation_rules);
      return false;
    } else {
      calculate_riskStrat();
    }
  });
});

function addTestData() {
  thisTool.find("#independent_dropdown_rs").val("specificity");
  thisTool.find("#contour_dropdown_rs").val("prevalence");
  thisTool.find("#fixed_dropdown_rs").val("delta");

  makeSelectionsUnique("independent_dropdown_rs");

  thisTool.find("#independent_rs").val("0.6, 0.75, 0.8, 0.86, 0.92");
  thisTool.find("#contour_rs").val("0.01, 0.05, 0.1");
  thisTool.find("#fixed_rs").val("1, 1.5, 2, 3");

  thisTool.find(".variable-example").text("");
  addPopupDefinition();
}

function addPopupDefinition() {

  var termLookup = {
    ppv : "PPV",
    cnpv : "cNPV",
    sensitivity : "Sens",
    specificity : "Spec",
    delta : "Delta",
    prevalence : "DP"
  };
  var independent = thisTool.find("#independent_dropdown_rs").val();
  var contour = thisTool.find("#contour_dropdown_rs").val();
  var fixedValue = thisTool.find("#fixed_dropdown_rs").val();
  if (!!independent) {
    var independentTerm = termLookup[independent];
    createPopupDefinitionElement("indDef", independentTerm, independentTerm);
  }
  else {
    thisTool.find("#indDef").html("");
  }
  if (!!contour) {
    var contourTerm = termLookup[contour];
    createPopupDefinitionElement("contourDef", contourTerm, contourTerm);
  }
  else {
    thisTool.find("#contourDef").html("");
  }
  if (!!fixedValue) {
    var fixedValueTerm = termLookup[fixedValue];
    createPopupDefinitionElement("fvDef", fixedValueTerm, fixedValueTerm);
  }
  else {
    thisTool.find("#fvDef").html("");
  }
  thisTool.find(".define").on("click", termDisplay);
}

function createPopupDefinitionElement(elementId, termId, dataTerm) {
  thisTool.find("#" + elementId)
    .html("<div class='define' id='" +
        termId +
        "' data-term='" +
        dataTerm +
        "'><img src='/common/images/info.png' height='20', width='20', alt='pop up definition for " + dataTerm + "'></div>").find(".define").on("click", termDisplay);

}

function resetPopupDefinition() {

  thisTool.find("#indDef").html("");
  thisTool.find("#contourDef").html("");
  thisTool.find("#fvDef").html("");

}

function resetPage() {
  thisTool.find("#calculate").removeAttr("disabled").text("Calculate");
  makeSelectionsUnique("independent_dropdown_rs");
  thisTool.find("span.variable-example").text("");
  thisTool.find("option").removeAttr("disabled");
  thisTool.find("#errors, #spinner, #download").addClass("hide");
  thisTool.find("select").val("");
  thisTool.find("input").val("");
  thisTool.find(".output").empty();
  resetPopupDefinition();
}

function createRulesDialog() {
  $(function() {
    thisTool.find("#dialog-confirm").dialog({
      resizable : false,
      height : 375,
      width : 400,
      autoOpen : false,
      buttons : {
        Yes : function() {
          $(this).dialog("close");
          calculate_riskStrat();
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
  rulesViolationMsg = [];


  var ids = thisTool.find("select").map(function() {
    return this.id;
  }).get();

  $.each(ids, function(key, elementId) {
    selectedVars.push(thisTool.find("#" + elementId).val());
  });

  ids = thisTool.find("input").map(function() {
    return this.id;
  }).get();

  $.each(ids, function(key, elementId) {

    userInput = $("#" + elementId).val();
    temp = userInput.split(",");
    for (var i; i < temp.length; i++) {
      values[key].push(parseFloat(temp[i]));
    }

    values[key] = temp;
    sorted = values[key].sort(sortFloat);
    min[key] = sorted[0];
    max[key] = sorted[sorted.length - 1];
  });

  thisTool.find(".rule").removeAttr("style");
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
  var prevalencePostion;
  var cnpvPosition;
  switch (ruleId) {
    case 1:
      minValue = 0;
      maxValue = 1;
      $.each(
        vars,
        function(key, selectedVar) {
          if (selectedVar != "delta") {
            if (min[key] < minValue || max[key] > maxValue) {
              status = "Fail";
              rulesViolationMsg.push( "Rule: Specificity, Sensitivity, PPV, cNPV, Prevalence can only be 0 to 1");
            }
          }
        });
      break;
    case 2:
      minValue = 0;
      maxValue = 5;
      $.each(vars, function(key, selectedVar) {
        if (selectedVar == "delta") {
          if (min[key] < minValue || max[key] > maxValue) {
            status = "Fail";
            rulesViolationMsg.push( "Rule: Delta can be 0 to 5");
          }
        }
      });
      break;
    case 3:
      cnpvPostion = $.inArray("cnpv", vars);
      prevalencePostion = $.inArray("prevalence", vars);
      if (cnpvPostion >= 0 && prevalencePostion >= 0) {
        if (max[cnpvPostion] >= min[prevalencePostion]) {
          status = "Fail";
          rulesViolationMsg.push("Rule: max(cNPV) < min(Prevalence)");
        }
      }
      break;
    case 4:
      prevalencePostion = $.inArray("prevalence", vars);
      ppvPostion = $.inArray("ppv", vars);
      if (prevalencePostion >= 0 && ppvPostion >= 0) {
        if (max[prevalencePostion] >= min[ppvPostion]) {
          status = "Fail";
          rulesViolationMsg.push("<div>Rule: max(prev) < min(PPV)</div>");
        }
      }

      break;
    case 5:
      sensitivityPosition = $.inArray("sensitivity", vars);
      specificityPosition = $.inArray("specificity", vars);
      if (sensitivityPosition >= 0 && specificityPosition >= 0) {


        if (max[sensitivityPosition] + max[specificityPosition] <= 1) {
          status = "Fail";
          rulesViolationMsg.push("<div>Rule: max(sensitivity) + max(specificity) > 1</div>");
        }
      }
      break;
  }
  return status;
}

function checkInputFields() {
  var selectedValues = [];
  var ids = thisTool.find("input").map(function() {
    return this.id;
  }).get();

  $.each(ids, function(key, elementId) {
    selectedValues.push(thisTool.find("#" + elementId).val().length);
  });

  if ($.inArray(0, selectedValues) == -1 && validCombo) {
    thisTool.find("#errors").addClass("hide");
  }
  else{
    display_errors(["One of the fields contains invalid input."]);
  }
}

function validate_inputs() {
 
  var checkInput = [];
  thisTool.find("input, select").each(function(){
    checkInput.push($(this)[0].checkValidity());

    var control = $(this)[0];
    var controlIds = ["independent_rs","contour_rs"];

    if($.inArray(this.id, controlIds) >= 0) {
      this.value.split(",").forEach(function(val, ind, arr) {
        if(!isNumberBetweenZeroAndOne(val.trim())) {
          rulesViolationMsg.push("'" + val.trim() + "' is an invalid value. Enter a valid array of floating point values for " + control.labels[0].textContent);
        }
      });
    }
  });

  thisTool.find(".output").empty();

  if ($.inArray(false, checkInput) >= 0) {
    rulesViolationMsg.push("Invalid input array. Enter a valid array of floating point values.");
    display_errors(rulesViolationMsg);
    return false;
  }

  if (rulesViolationMsg.length > 0) {
    display_errors(rulesViolationMsg);
    thisTool.find("#calculate").removeAttr("disabled").text("Calculate");
    thisTool.find("#spinner").addClass("hide");
    enableAll();
    return false;
  }
  else {
    thisTool.find("#errors").fadeOut().addClass("hide");
    thisTool.find("#calculate").attr("disabled","").text("Please Wait....");
    thisTool.find("#spinner").removeClass("hide");
    disableAll();
    return true;
  }
}

function calculate_riskStrat(){
 
  var validated = validate_inputs();

  if(validated){
   
    var independent_type = thisTool.find("#independent_dropdown_rs").val();
    var independent_values = thisTool.find("#independent_rs").val().replace(/[^\d,.-]/g, '');
    var indSplit = independent_values.split(",");
    var indMin = Array.min(indSplit);
    var indMax = Array.max(indSplit);

    var contour_type = thisTool.find("#contour_dropdown_rs").val();
    var contour_values = thisTool.find("#contour_rs").val().replace(/[^\d,.-]/g, '');
    var columnHeadings = contour_values.split(",");

    var fixed_type = thisTool.find("#fixed_dropdown_rs").val();
    var fixed_values = thisTool.find("#fixed_rs").val().replace(/[^\d,.-]/g, '');
    var fixedSplit = fixed_values.split(",");
    var uniqueKey = (new Date()).getTime();

    var abbreviatedkeys = [ "Sensitivity", "Delta" ];
    var numberOfKeysForCurrentFunction = 0;

    var keyvalueIndex = getKeyValueIndex(independent_type, fixed_type, contour_type);

    var keyvalueShort = keyShort[keyvalueIndex];
    var keyvalueLong = keyLong[keyvalueIndex];

    for ( var key in keyvalueShort) {
      numberOfKeysForCurrentFunction++;
    }
    var eIndependent = thisTool.find("#independent_dropdown_rs")[0];
    var selectedIndependentValue = eIndependent.options[eIndependent.selectedIndex].text;

    var eContour = thisTool.find("#contour_dropdown_rs")[0];
    var selectedContourValue = eContour.options[eContour.selectedIndex].text;

    tableFirstRowLabel = selectedIndependentValue;
    tableFirstColLabel = selectedContourValue;

    open_threads = numberOfKeysForCurrentFunction.length;
    error_count = 0;

    var request_data = [];
    var tableTitle = "";

   
   
   

    thisTool.find(".output").addClass("hide").empty();
    tabs = $("<div id='tabs'> </div>");
    thisTool.find(".output").append(tabs);
    tab_names = $("<UL> </UL>");
    tabs.append(tab_names);

    for (var fixedIndex = 0; fixedIndex < fixed_values.split(",").length; fixedIndex++) {
      var thisFixedValue = fixedSplit[fixedIndex];
      for ( var shortkey in keyvalueShort) {
        request_data.push({
          keyIndex : shortkey,
          independentType : independent_type,
          independent : independent_values,
          independentMin : indMin,
          independentMax : indMax,
          contourType : contour_type,
          contour : contour_values,
          fixed : fixed_values,
          fixedType : fixed_type,
          uniqueId : uniqueKey,
          abreviatedKey : keyvalueShort[shortkey],
          tabValue : thisFixedValue,
          export: false
        });
      }

      tab_names.append("<LI><a  class='extra-padding' href='#fixed-" + (fixedIndex + 1) +
               "'>" + fixed_type + " "+ thisFixedValue +
               "</a></LI>");

      tab_pane = $("<div class='tab-pane' id='fixed-" + (fixedIndex + 1) +
             "' >  </div>");
      tabs.append(tab_pane);
      var tabId = "#fixed-" + (fixedIndex + 1);
      createTab(thisFixedValue, fixedIndex, fixed_type, independent_type, contour_type, tabId);
    }

    getData(request_data).done(function(data_array) {
     

      if (data_array.length > 0){

       
        for (var i = 0; i < data_array.length; i++) {
          for (var j = 0; j < fixedSplit.length; j++) {
            fillTable(data_array[i], columnHeadings, j);
          }
        }

      }
      tabs.tabs();

      thisTool.find("#download").removeClass("hide");
      return data_array;
    }).fail(function(request, status, error){
      default_ajax_error(request, status, error);
      thisTool.find(".output").addClass("hide").empty().html("");
    }).always(function(){
      if($.active <= 1) after_requests();
    });

  }

}

function after_requests(){
  if($.active == 1){
    thisTool.find(".output").removeClass("hide");
    thisTool.find("#calculate").removeAttr("disabled").text("Calculate");
    enableAll();
    thisTool.find("#spinner").addClass("hide");
  }
}
function getKeyValueIndex(independentvalue, fixedvalue, contourvalue) {

  rfunctionname = getFunctionName(independentvalue, fixedvalue, contourvalue);

  for (var functions = 0; functions < rfunctions.length; functions++) {
    if (rfunctions[functions] == rfunctionname)
      return functions;
  }
  display_errors("no function mapping available");
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


function getData(data) {
  var service = "http://" + window.location.hostname + "/" + rest + "/riskStratAdvanced/";

  if(window.location.host == "localhost") {
    service = "http://" + window.location.hostname + window.location.pathname + "riskStratAdvanced/test_result.json";
  }

  return $.ajax({
    type : "POST",
    url : service,
    data : JSON.stringify(data),
    dataType : "json",
    contentType: "application/json"
  }).then(function(data_array) {
    thisTool.find("#download").removeClass("hide");
    return JSON.parse(JSON.stringify(data_array));
  });
}

function retrieve_excel(e) {
  var service = "http://" + window.location.hostname + "/" + rest + "/riskStratAdvanced/";

  $.ajax({
    type : "POST",
    url : service,
    data : JSON.stringify([{ export: true }]),
    dataType : "json",
    contentType: "application/json",
    success: function(excel_file) {
      if(excel_file.length <= 1)
        display_errors(["There was a problem generating the excel file."]);
      else
        window.location = excel_file;
    },
    error: default_ajax_error
  });
  e.preventDefault();
}

function createTab(singleFixed, fixedIndex, fixedType,independentType, contourType, tabElement ){

  var keyvalueIndex = getKeyValueIndex(independentType, fixedType, contourType);

  var keyvalueShort = keyShort[keyvalueIndex];
  var keyvalueLong = keyLong[keyvalueIndex];

  for (var key in keyvalueShort) {

    $("#graphic-" + keyvalueShort[key] + (fixedIndex + 1) +", #table-" +
      keyvalueShort[key] + (fixedIndex + 1)).empty();

    table_graph_div = $("<div class='row set-" +
              keyvalueShort[key] +
              (fixedIndex + 1) +
              "' class='pull-left'></div>");
    thisTool.find(tabElement).append(table_graph_div);
    graphic_side = ("<div class='graphic-side pull-right' id='graphic-" +
            keyvalueShort[key] + (fixedIndex + 1) + "'><div class='pull-right vertical-padding'> </div></div>");
    table_graph_div.append(graphic_side);
    table_side = $("<div class='table-side pull-left' id='table-" +
             keyvalueShort[key] + (fixedIndex + 1) +
             "'><div class='table-title extra-padding'>" + keyvalueLong[key] +
             "</div></div>");
    table_graph_div.append(table_side);
  }

}

function fillTable(resultObject, columnHeadings, index) {

  var singleDataObject = resultObject[index];

  var independentArray = thisTool.find("#independent_rs").val();
  independentArraySplit = independentArray.split(",");

  if(singleDataObject.length === 0) return false;
  else {
    var abbreviatedKey = singleDataObject.prefix;
    var tabnumber = singleDataObject.tabId;

    var tableId = "example-" + abbreviatedKey + tabnumber;
    var tabElement = "#fixed-" +tabnumber;

    var tableElement = thisTool.find(tabElement + " #" + tableId);

    if( tableElement[0] ) {
      if($.fn.DataTable.isDataTable(tableElement)){
        tableElement.dataTable().fnDestroy();
        tableElement.empty();
      }
    }

    thisTool.find(tabElement+" #table-" + abbreviatedKey + tabnumber + " #" + tableId).html("");

    var arr = [];
    var tableData = singleDataObject.data;
    var tableError = singleDataObject.table_error;
    var graphError = singleDataObject.graph_error;


    if (tableError != 1) {
      var rows = tableData.length;
      for (var i = 0; i < rows; i++) {
        var values = [];
        row_entries = tableData[i];
       
       
        for ( var key in columnHeadings) {
          var columnInd = columnHeadings[key];
          values.push(row_entries[columnInd]);
        }
        arr.push(values);
      }

      var headings = [];
      for (i = 0; i < columnHeadings.length; i++) {
        headings.push({
          "sTitle" : columnHeadings[i]
        });
      }

      var table = $("<table cellpadding='0' cellspacing='0' class='cell-border' id='" +
              tableId + "'></table>");

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

      $(tabElement + " #table-" + abbreviatedKey + tabnumber).append(table);

      thisTool.find(tabElement + " #" + tableId + " tr:first").prepend(
        "<td class='ui-state-default' colspan='2'></td>");

      i = 0;
      thisTool.find(tabElement + " #" + tableId + " tr:not(:first)").each(
        function() {
          $(this).prepend(
            "<th class='ui-state-default sorting_disabled'>" +
            independentArraySplit[i] + "</th>");
          i++;
        });

     
      thisTool.find(tabElement + " #" + tableId + " tr:eq(1)").prepend(
        "<th class='header' rowspan='" + independentArraySplit.length +
        "'><div class='vertical-text'>" + tableFirstRowLabel +
        "</div></th>");

     
      thisTool.find(tabElement + " #" + tableId + " thead").prepend(
        "<tr><td class='header' colspan='2'></td><th class='header' colspan='5'>" +
        tableFirstColLabel + "</th></tr>");
      if(graphError != 1)
        loadImage(tabnumber, abbreviatedKey, singleDataObject.imagePath);
    }
    else {
      display_errors([ singleDataObject.message ]);
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

function loadImage(tabNumber, graphNamePreFix, graphFilename) {
  var imageContainer = thisTool.find("#graphic-" + graphNamePreFix + tabNumber);
  imageContainer.empty();

  imageContainer.append(
    "<img class='img-responsive' src='" + graphFilename + "' alt='output " + graphNamePreFix + " image for tab " + tabNumber + "'>");
}

function refreshGraph(drawgraph) {
  var graph_file;

  if (drawgraph == 1)
    graph_file = "tmp/" + uniqueKey + "SensSpecLR.jpg?";
  else
    graph_file = "./images/fail-message.jpg?";

  var d = new Date();
  thisTool.find("#graph").attr("src", graph_file + d.getTime());
}

function makeSelectionsUnique(elementId) {
  var selectedValues = [];
  var disabledValues;

  var dropdowns = thisTool.find("select");

  $.each(dropdowns, function(key, dropdown) {
    if ($(dropdown).val() !== "")
      selectedValues.push($(dropdown).val());
  });

  $.each(dropdowns, function(key, dropdown) {
    $(dropdown).find('option:not(:selected)').each(function() {
      $(this).removeAttr('disabled');
      if ($.inArray($(this).val(),selectedValues) > -1) {
        $(this).attr('disabled','disabled');
      }
    });
  });

  setInitialValue(elementId);
  checkForInvalidVariableCombo(elementId);
}

function setInitialValue(textboxId) {
  var thisSelect = thisTool.find('#'+textboxId);
  var thisInput = thisTool.find('#'+textboxId.replace('_dropdown','')).attr('placeholder',initialData[$.inArray(thisSelect.val(), functionnames)]).val("");
 

  addPopupDefinition();
}

function checkForInvalidVariableCombo() {

  var selectedValues = [];
  var ids = thisTool.find("select").map(function() {
    return this.id;
  }).get();

  $.each(ids, function(key, elementId) {
    selectedValues.push(thisTool.find("#" + elementId + " option:selected").val());
  });

  var blankCount = $.inArray("", selectedValues);
  if ($.inArray("", selectedValues) == -1) {

    var selectedValuesSorted = selectedValues.sort();
    var selectedValuesSortedString = selectedValues.join("-");

    if ($.inArray(selectedValuesSortedString, invalidCombos) >= 0) {

      var userSelectedVariables = selectedValues[0].toString() + ", "+
        selectedValues[1].toString() + ",  and " +
        selectedValues[2].toString();
      var message = "The variables " +
        userSelectedVariables +
        " do not form a valid variable combination for this calculation.  " +
        "Please select a vaild variable combination.";
      display_errors([message]);
      validCombo = false;
    } else {
      validCombo = true;
      thisTool.find("#errors").addClass("hide");
    }
  } else {
    thisTool.find("#errors").addClass("hide");
    validCombo = false;

    return;
  }
}


Array.max = function( array ){
  array = array.map(Number);
  return Math.max.apply( Math, array );
};

Array.min = function( array ){
  array = array.map(Number);
  return Math.min.apply( Math, array );
};
