
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
var rulesViolationMsg = [];

var keysforfunction = [{
    1 : "Sens"
},
                       {
                           2 : "Spec"
                       }, 
                       {
                           3 : "PPV"
                       }, 
                       {
                           4 : "cNPV"
                       }, 
                       {
                           5 : "Prev"
                       }, 
                       {
                           6 : "Delta"
                       }
                      ];

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

var thisTool;

function init_riskStrat(){  
    thisTool = $('#riskStratAdvanced');
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
}

$('a[href="#riskStratAdvanced"]').on('shown.bs.tab',function(e){
    init_riskStrat();
});

$(document).ready(function(){
    init_riskStrat();

    thisTool.find("select").change(function() {
        makeSelectionsUnique(functionnames, this.id);
    });

    thisTool.find("#reset").on('click', resetPage);
    thisTool.find("input").keyup(checkInputFields);
    thisTool.find("input").change(checkInputFields);
    thisTool.find("#add-test-data").click(addTestData);

    thisTool.find("#calculate").on('click', function(e) {
        e.preventDefault();
        $("#errors").fadeOut().addClass("hide");
        if (checkRules() == "Fail") {
            display_errors(validation_rules);
           
            return false;
        }
        else {
            calculate_riskStrat();
        }
    });

   
   
   
   
   
   
   
   
   
   
   
   
   
   
});
function checkInputs(ind, el){
    console.log(ind);

}

function randomDecimalValue() {
    return Math.floor((Math.random() * 100) +1)/ 100;
}

function addTestData() {
    var exampleIndependent = [];
    var exampleContour = [];
    var exampleFixed = [];
    var randInterator = Math.round(Math.random() * 10) + 1;

    thisTool.find("#independent_dropdown").val("specificity");
    thisTool.find("#contour_dropdown").val("prevalence");
    thisTool.find("#fixed_dropdown").val("delta");

    makeSelectionsUnique(functionnames, "independent_dropdown");

    for(var i = 0; i != randInterator; i++) {
        exampleIndependent.push(randomDecimalValue());
        exampleContour.push(randomDecimalValue());
        
        var randVal = Math.round(Math.random() * 4) + 1;
        
        if(exampleFixed.indexOf(randVal) == -1) exampleFixed.push(randVal);
    }
    
       
       
       

        thisTool.find("#independent").val("0.6, 0.75, 0.8, 0.86, 0.92");
        thisTool.find("#contour").val("0.01, 0.05, 0.1");
        thisTool.find("#fixed").val("1, 1.5, 2, 3");

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
    var independent = thisTool.find('#independent_dropdown').val();
    var contour = thisTool.find('#contour_dropdown').val();
    var fixedValue = thisTool.find('#fixed_dropdown').val();
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
    thisTool.find('.define').on('click', termDisplay);
}

function createPopupDefinitionElement(elementId, termId, dataTerm) {
    thisTool.find("#" + elementId)
        .html("<div class='define' id='" + 
              termId + 
              "' data-term='" + 
              dataTerm + 
              "'><img src='/common/images/info.png' alt='pop up definition'></div>").find('.define').on('click', termDisplay);

}

function resetPopupDefinition() {

    thisTool.find("#indDef").html("");
    thisTool.find("#contourDef").html("");
    thisTool.find("#fvDef").html("");

}

function resetPage() {
    thisTool.find("#calculate").removeAttr("disabled").text("Calculate");
    makeSelectionsUnique(functionnames, "independent_dropdown");
    thisTool.find("span.variable-example").text("");
    thisTool.find("option").removeAttr('disabled');
    thisTool.find("#errors, #spinner").addClass('hide');
    thisTool.find("select").val("");
    thisTool.find("input").val("");
    thisTool.find("#output").empty();
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
        selectedVars.push(thisTool.find('#' + elementId).val());
    });

    ids = thisTool.find("input").map(function() {
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
        selectedValues.push(thisTool.find('#' + elementId).val().length);
    });

    if ($.inArray(0, selectedValues) == -1 && validCombo) {
        thisTool.find("#errors").addClass("hide");
    }
    else{
        display_errors(["One of the fields contains invalid input."]);
    }
}

function calculate_riskStrat() {

   
    var checkInput = [];
    thisTool.find("input, select").each(function(){
        checkInput.push($(this)[0].checkValidity());
    });

    thisTool.find("#output").empty();

    if ($.inArray(false, checkInput) >= 0) {
        rulesViolationMsg.push("Invalid input array. Enter a valid array of floating point values.");
        display_errors(rulesViolationMsg);
        return;
    }

    if (rulesViolationMsg.length > 0) {
        display_errors(rulesViolationMsg);
        thisTool.find("#calculate").removeAttr('disabled').text('Calculate');
        thisTool.find("#spinner").addClass('hide');
        enableAll();
    }
    else {
        thisTool.find("#errors").fadeOut().addClass("hide");
        thisTool.find("#calculate").attr('disabled','').text('Please Wait....');
        thisTool.find("#spinner").removeClass('hide');
        disableAll();  
    }

    var fixedArray = "";
    var contourArray = "";
    var independentArray = "";

    independentArray = thisTool.find("#independent").val();
   
    independentArray = independentArray.replace(/[^\d,.-]/g, '');
    var independentval = thisTool.find("#independent_dropdown").val();
    independentArraySplit = independentArray.split(",");
    var independentMin = Math.min.apply(Math, independentArraySplit);
    var independentMax = Math.max.apply(Math, independentArraySplit);
    contourArray = thisTool.find("#contour").val();
   
    contourArray = contourArray.replace(/[^\d,.-]/g, '');
    var contourval = thisTool.find("#contour_dropdown").val();
    var columnHeadings = contourArray.split(",");
    fixedArray = thisTool.find("#fixed").val();
   
    fixedArray = fixedArray.replace(/[^\d,.-]/g, '');
    var fixedval = thisTool.find("#fixed_dropdown").val();
    var fixedArraySplit = fixedArray.split(",");
    var fixedArraySize = fixedArraySplit.length;

    var fixed_dropdown = thisTool.find("#fixed_dropdown").val();

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
        var eIndependent = thisTool.find("#independent_dropdown")[0];
        var selectedIndependentValue = eIndependent.options[eIndependent.selectedIndex].text;

        var eContour = thisTool.find("#contour_dropdown")[0];
        var selectedContourValue = eContour.options[eContour.selectedIndex].text;

        tableFirstRowLabel = selectedIndependentValue;
        tableFirstColLabel = selectedContourValue;
        open_threads = numberOfKeysForCurrentFunction.length;
        error_count = 0;
        thisTool.find("#output").addClass("hide");
        thisTool.find("#output").empty();

       

        tabs = $("<div id='tabs'> </div>");
        thisTool.find("#output").append(tabs);
        tab_names = $("<UL> </UL>");
        tabs.append(tab_names);

        for (var i = 0; i < fixedArraySplit.length; i++) {
            tab_names.append("<LI><a  class='extra-padding' href='#fixed-" + (i + 1) +
                             "'>" + fixed_dropdown + " "+ fixedArraySplit[i] +
                             "</a></LI>");
            tab_pane = $("<div class='tab-pane' id='fixed-" + (i + 1)+ 
                         "' >  </div>");
            tabs.append(tab_pane);

            for ( var key in keyvalueShort) {

                $("#graphic-" + keyvalueShort[key] + (i + 1) +", #table-" + 
                  keyvalueShort[key] + (i + 1)).empty();

                table_graph_div = $("<div class='row set-" + 
                                    keyvalueShort[key] + 
                                    (i + 1) + 
                                    "' class='pull-left'></div>");
                tab_pane.append(table_graph_div);
                graphic_side = ("<div class='graphic-side pull-right' id='graphic-" + 
                                keyvalueShort[key] + (i + 1) + "'><div class='pull-right vertical-padding'> </div></div>");
                table_graph_div.append(graphic_side);
                table_side = $("<div class='table-side col-md-6 pull-left' id='table-" + 
                               keyvalueShort[key] + (i + 1) + 
                               "'><div class='table-title extra-padding'>" + keyvalueLong[key] + 
                               "</div></div>");
                table_graph_div.append(table_side);
            }
        }
        tabs.tabs();

        var promises = [];//store promises in an array

        for (var fixedValue = 0; fixedValue < fixedArraySplit.length; fixedValue++) {
            tabindex = fixedValue + 1;

            for ( var shortkey in keyvalueShort) {
                var promise = getData({
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

                promises.push([promise, tabindex, keyvalueShort[shortkey]]);
            }
        }

        $.when.apply($, promises);
    }
    else {
        thisTool.find("#output").empty();
        thisTool.find("#calculate").removeAttr('disabled').text('Calculate');
        thisTool.find("#spinner").addClass('hide');
        enableAll();
    }

}
function after_requests(){
    if($.active == 1){
        thisTool.find("#output").removeClass("hide");
        thisTool.find("#calculate").removeAttr('disabled').text("Calculate");
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

function getData(data, tableTitle, tabnumber, tabValue, uniqueKey,
                  abbreviatedKey, columnHeadings) {

    var service = "http://" + window.location.hostname + "/" + rest + "/riskStratAdvanced/";
    if(local) service = "riskStratAdvanced/test_result.json";

    $.ajax({
        type : "POST",
        url : service,
        data : data,
        dataType : "json",
        contentType: 'application/json',
        success: function(data){
            JSON.parse(JSON.stringify(data));
        },
        error:function(request, status, error) {
            handleError(error, status, request);
        }
    }).done(function(data) {
        fillTable(data, columnHeadings, tabnumber, abbreviatedKey);
        loadImage(tabnumber,tabValue.trim(), uniqueKey, abbreviatedKey);
        after_requests();
        return data;
    });
}

function handleError(error, status, request) {
    display_errors([error, request.responseText]);
    if (typeof console == "object") {
        console.info("Server AJAX Return Error");
        console.info("Type: " + error);
        console.info("Status: " + status);
        console.info("request object:");
    }
}

function fillTable(jsonTableData, columnHeadings, tabnumber, abbreviatedKey) {
    var tableId = "example-" + abbreviatedKey + tabnumber;
    thisTool.find("#table-" + abbreviatedKey + tabnumber + " #"+tableId).html("");

    if( $.fn.DataTable.isDataTable(thisTool.find('#'+tableId)) ){
        thisTool.find('#'+tableId).dataTable().fnDestroy();
        thisTool.find('#'+tableId).empty();
    }


    var independentArray = thisTool.find("#independent").val();
    independentArraySplit = independentArray.split(",");

    var arr = [];
    var tableData = jsonTableData[0].data;
    var tableError = jsonTableData[0].table_error;
    var graphError = jsonTableData[0].graph_error;
    var tableErrorValue = tableError[0].errortrue;
    var graphErrorValue = graphError[0].errortrue;
    if (tableErrorValue != 1) {
        rows = tableData.length;
        for (var i = 0; i < tableData.length; i++) {
            var values = [];
            row_entries = tableData[i];
            for ( var key in row_entries) {
                values.push(row_entries[key]);
            }
            arr.push(values);
        }

        var headings = [];
        for (var i = 0; i < columnHeadings.length; i++) {
            headings.push({
                "sTitle" : columnHeadings[i]
            });
        }

        var table = $("<table cellpadding='0' cellspacing='0' class='cell-border' id='" + 
                      tableId + "'></table>");
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
       
        thisTool.find("#" + tableId + " tr:first").prepend(
            "<th class='ui-state-default' colspan='2'></th>");
        var i = 0;
        thisTool.find("#" + tableId + " tr:not(:first)").each(
            function() {
                $(this).prepend(
                    "<th class='ui-state-default sorting_disabled'>" + 
                    independentArraySplit[i] + "</th>");
                i++;
            });

       
        thisTool.find("#" + tableId + " tr:eq(1)").prepend(
            "<th class='header' rowspan='" + independentArraySplit.length + 
            "'><div class='vertical-text'>" + tableFirstRowLabel + 
            "</div></th>");

       
        thisTool.find("#" + tableId + " thead").prepend(
            "<tr><th class='header' colspan='2'></th><th class='header' colspan='5'>" + 
            tableFirstColLabel + "</th></tr>");
    } else {
        if (graphErrorValue != 1) {
            display_errors([tableError[1].message, graphError[1].message ]);
        }
        else
            display_errors([tableError[1].message]);
    }
}

function getColumnHeaderData(columnHeadings) {
    var columnHeaderData2d = new Array();
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
    var imageContainer = thisTool.find('#graphic-' + graphNamePreFix + tabNumber);
    imageContainer.empty();

    if(!local){
        imageContainer.append(
            "<img class='img-responsive' src='tmp/" + 
            graphNamePreFix + uniqueId + "-" + tabValue + ".png' alt='output image'>");
    }
    else {
        imageContainer.append(
            "<img class='img-responsive' src='images/exampleLRPlot.jpg' alt='output image'>");
    }
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

function ajax_error(jqXHR, exception) {
    refreshGraph(1);
    display_errors("ajax problem");
}

function makeSelectionsUnique(originalOptions, elementId) {

    var selectedValues = [];
    var disabledValues = [];

    if (activeSelectionChange === true)
        return;

    activeSelectionChange = true;


    var ids = thisTool.find("select").map(function() {
        return this.id;
    }).get();


    $.each(ids, function(key, elementId) {
        selectedValues.push(thisTool.find('#' + elementId + ' option:selected').val());
    });

    for (var key = 0; key < ids.length; key++) {
        disabledValues = [];
        for (var i = 0; i < selectedValues.length; i++) {
            if (i != key && selectedValues[i] !== "") {
                disabledValues.push(selectedValues[i]);
            }
        }

        var dropdownBoxId = ids[key];
        removeAllOptions(dropdownBoxId);
        addAllOptions(dropdownBoxId, originalOptions, disabledValues);


        thisTool.find('#' + dropdownBoxId).val(selectedValues[key]).change();
    }

    setInitialValue(elementId);
    checkForInvalidVariableCombo(elementId);
    activeSelectionChange = false;

}

function removeAllOptions(eid) {

    var element = thisTool.find("#"+eid)[0];
    for (var i = element.options.length - 1; i >= 0; i--) {
        element.remove(i);
    }
}

function addAllOptions(dropdownBoxId, originalOptions, disabledOptions) {
    for (var optionKey = 0; optionKey < originalOptions.length; optionKey++) {
        var attribute;
        if ($.inArray(originalOptions[optionKey], disabledOptions) > -1) {
            attribute = thisTool.find('#' + dropdownBoxId).append(
                $("<option></option>").attr("value",
                                            originalOptions[optionKey]).attr('disabled',
                                                                             'disabled').text(originalOptions[optionKey]));
        } else {
            attribute = thisTool.find('#' + dropdownBoxId).append(
                $("<option></option>").attr("value",
                                            originalOptions[optionKey]).text(
                    originalOptions[optionKey]));
        }
    }
}

function setInitialValue(textboxId) {

    var selectedOption = thisTool.find("#" + textboxId + " option:selected").val();
    var key = $.inArray(selectedOption, functionnames);

    var eSelect = thisTool.find("#"+textboxId);

    var eSelect2 = thisTool.find(eSelect).parent().parent()[0];

    thisTool.find(eSelect2).find(":input").val("");
    var dropdownIndex = $(eSelect2).index();
    thisTool.find("#examples .row:eq(" + dropdownIndex + ") span").text(initialData[key]);


    thisTool.find('#' + textboxId).val(selectedOption).change();
    addPopupDefinition();
}

function checkForInvalidVariableCombo() {

    var selectedValues = [];
    var ids = thisTool.find("select").map(function() {
        return this.id;
    }).get();

    $.each(ids, function(key, elementId) {
        selectedValues.push(thisTool.find('#' + elementId + ' option:selected').val());
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