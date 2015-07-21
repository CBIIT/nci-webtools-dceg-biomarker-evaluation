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
                       }];

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

$(document).ready(function() {
    thisTool = $('#riskStratAdvanced');
    thisTool.bind('beforeunload', function() {
       
        alert("We gonna clear some things up.");
    });

   
   

    thisTool.find("select").change(function() {
        makeSelectionsUnique(functionnames, this.id);
    });

    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
    thisTool.find("#reset").button().click(resetPage);

    thisTool.find("input").keyup(checkInputFields);

    thisTool.find("input").change(checkInputFields);

   
    thisTool.find("input").bind("mouseup", function(e) {
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
    thisTool.find("#calculate").button().click(function(e) {
        e.preventDefault();
        if (checkRules() == "Fail") {
            createRulesDialog();

            return false;
        } else {
            calculate();
        }
    });
    thisTool.find("#add-test-data").click(function(e) {
        e.preventDefault();
        addTestData();
    });

    resetPage();
});

function addTestData() {
   
    thisTool.find("#independent_dropdown").val("specificity");
    thisTool.find("#contour_dropdown").val("prevalence");
    thisTool.find("#fixed_dropdown").val("delta");

    makeSelectionsUnique(functionnames, "independent_dropdown");
    thisTool.find("#independent").val("0.6, 0.75, 0.8, 0.86, 0.92");
    thisTool.find("#contour").val("0.01, 0.05, 0.1");
    thisTool.find("#fixed").val("1, 1.5, 2, 3");
    thisTool.find("#calculate").button("option", "disabled", false);
    thisTool.find(".variable-example").text("");
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
        $("#contourDef").html("");
    }
    if (!!fixedValue) {
        var fixedValueTerm = termLookup[fixedValue];
        createPopupDefinitionElement("fvDef", fixedValueTerm, fixedValueTerm);
    }
    else {
        thisTool.find("#fvDef").html("");
    }
    bindTermToDefine();
}

function createPopupDefinitionElement(elementId, termId, dataTerm) {
    $("#" + elementId)
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
    makeSelectionsUnique(functionnames, "independent_dropdown");
    thisTool.find("span.variable-example").text("");
    thisTool.find("option").removeAttr("disabled");
    thisTool.find("#status-bar").addClass('hide');
   
    thisTool.find("select").val("");
    thisTool.find("input").val("");
    thisTool.find("#output").empty();
    resetPopupDefinition();
}

function createRulesDialog() {
    $(function() {
        $("#dialog-confirm").modal({
            resizable : false,
            height : 375,
            width : 400,
            autoOpen : false,
            buttons : {
                Yes : function() {
                    $(this).modal("close");
                    $(this).modal("close");
                   
                    calculate();
                },
                Cancel : function() {
                    $(this).modal("close");
                    $(this).modal("close");
                   
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
    var ids;
    rulesViolationMsg = "";

   
    ids = thisTool.find("select").map(function() {
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
   
    var ids = thisTool.find("input").map(function() {
        return this.id
    }).get();
   
    $.each(ids, function(key, elementId) {
        selectedValues.push(thisTool.find('#' + elementId).val().length);
    });
    if ($.inArray(0, selectedValues) == -1 && validCombo) {
        thisTool.find("#calculate").removeAttr("disabled");
    } else {
        thisTool.find("#calculate").attr("disabled", true);
    };

}

function calculate() {
   

    var checkInput = [];
   
   
   
    checkInput.push(document.getElementById("independent").checkValidity());
    checkInput.push(document.getElementById("contour").checkValidity());
    checkInput.push(document.getElementById("fixed").checkValidity());
    if ($.inArray(false, checkInput) >= 0) {
        thisTool.find("#status-bar").removeClass('hide');
        thisTool.find$thisTool.find("#status-bar")
            .html(
            "Invalid input array.  Enter a valid array of floating point values.");
        return;
    }

   
    $("#status-bar").text("");
    if (rulesViolationMsg.length > 0) {
        thisTool.find("#status-bar").html(rulesViolationMsg);
        thisTool.find("#status-bar").removeClass('hide');
    } else {
        thisTool.find("#status-bar").addClass('hide');
    }

    var fixedArray = "";
    var contourArray = "";
    var independentArray = "";

    independentArray = thisTool.find("#independent").val();
   
    independentArray = independentArray.replace(/[^\d,.-]/g, '');
    var independentval = thisTool.find("#independent_dropdown").val();
    independentArraySplit = independentArray.split(",");
    var independentMin = Math.min.apply(Math, independentArraySplit)
    var independentMax = Math.max.apply(Math, independentArraySplit)
    var contourArray = thisTool.find("#contour").val();
   
    contourArray = contourArray.replace(/[^\d,.-]/g, '');
    var contourval = thisTool.find("#contour_dropdown").val();
    var columnHeadings = contourArray.split(",");
    var fixedArray = thisTool.find("#fixed").val();
   
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
        var eIndependent = document.getElementById("independent_dropdown");
        var selectedIndependentValue = eIndependent.options[eIndependent.selectedIndex].text;

        var eContour = document.getElementById("contour_dropdown");
        var selectedContourValue = eContour.options[eContour.selectedIndex].text;

        tableFirstRowLabel = selectedIndependentValue;
        tableFirstColLabel = selectedContourValue;
        open_threads = numberOfKeysForCurrentFunction.length;
        error_count = 0;

        thisTool.find("#output").empty();

       
        tabs = $("<div id='tabs'> </div>");
        thisTool.find("#output").append(tabs);
        tab_names = $("<UL> </UL>");
        tabs.append(tab_names);
        var spacing = "<p></p><p></p><p></p>";

        for (var i = 0; i < fixedArraySplit.length; i++) {
            tab_names.append("<LI><a  style='padding:3px;' href='#fixed-"+ 
                             (i + 1) + "'>" + fixed_dropdown + "<br>&nbsp&nbsp&nbsp "+ 
                             fixedArraySplit[i] + "</a></LI>");
            tab_pane = $("<div class='tab-pane' id='fixed-" + (i + 1)
                         + "' >  </div>")
            tabs.append(tab_pane);

            for ( var key in keyvalueShort) {

                table_graph_div = $("<div class='set-"
                                    + keyvalueShort[key]
                                    + (i + 1)
                                    + "' style='width: 950px; float: left; clear:left;'><p></p></div>");
                tab_pane.append(table_graph_div);
                graphic_side = ("<div class='graphic-side' id='graphic-"
                                + keyvalueShort[key] + (i + 1) + "'><div style='clear:right;padding-top:10px;'> </div></div>");
                table_graph_div.append(graphic_side);
                table_side = $("<div class='table-side' id='table-"
                               + keyvalueShort[key] + (i + 1)
                               + "'><br><div class='table-title'>" + keyvalueLong[key]
                               + "</div></div><br><br>");
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
        thisTool.find("#output").empty();
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
        url : "http://" + hostname + "/biomarkerToolsRest/riskStratAdvanced",
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
                    alert("There were " + error_count
                          + " errors with your request");
                    error_count = 0;
                }
            }
            loadImage(tabnumber, tabValue.trim(), uniqueKey, abbreviatedKey);
        }
    });
}

function handleError(error, status, request) {
    thisTool.find("#status-bar").text("");
    thisTool.find("#status-bar").html("<div>" + error + "</div>");
    thisTool.find("#status-bar").css("visibility", "visible");
    if (typeof console == "object") {
        console.info("Server AJAX Return Error");
        console.info("Type: " + error);
        console.info("Status: " + status);
        console.info("request object:");
        console.log(request.responseText);
    }
}

function fillTable(jsonTableData, columnHeadings, tabnumber, abbreviatedKey) {
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

        var tableId = "example-" + abbreviatedKey + tabnumber;
        var table = $("<table cellpadding='0' cellspacing='0' class='cell-border' id='"
                      + tableId + "'></table>");
        thisTool.find("#table-" + abbreviatedKey + tabnumber).append(table);

        table.dataTable({
            "aaData" : arr,
            "aoColumns" : headings,
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
                    "<th class='ui-state-default sorting_disabled'>"+ 
                    independentArraySplit[i] + "</th>");
                i++;
            });

       
        thisTool.find("#" + tableId + " tr:eq(1)").prepend(
            "<th class='header' rowspan='" + independentArraySplit.length+ 
            "'><div class='vertical-text'>" + tableFirstRowLabel+ 
            "</div></th>");

       
        thisTool.find("#" + tableId + " thead").prepend(
            "<tr><th class='header' colspan='2'></th><th class='header' colspan='5'>"+ 
            tableFirstColLabel + "</th></tr>");
    } else {
        thisTool.find("#status-bar").addClass("status-error");
        thisTool.find("#status-bar").removeClass('hide');
        thisTool.find("#status-bar").append("<div>" + tableError[1].message + "</div>");
        if (graphErrorValue != 1) {
            thisTool.find("#status-bar").append("<div>" + graphError[1].message + "</div>");
        }
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
    $('#graphic-' + graphNamePreFix + tabNumber).append(
        "<img style='height: 400px; text-align: right;' class='center' src='tmp/"
        + graphNamePreFix + uniqueId + "-" + tabValue + ".png' alt='output image'>");
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
        graph_file = "tmp/" + uniqueKey + "SensSpecLR.jpg?";
    else
        graph_file = "./images/fail-message.jpg?";

    d = new Date();
    thisTool.find("#graph").attr("src", graph_file + d.getTime());
}

function ajax_error(jqXHR, exception) {
    refreshGraph(1);
    alert("ajax problem");
}

function makeSelectionsUnique(originalOptions, elementId) {

    var selectedValues = [];
    var disabledValues = [];

    thisTool.find("#calculate").button("option", "disabled", true);

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

        dropdownBoxId = ids[key];
        removeAllOptions(dropdownBoxId);
        addAllOptions(dropdownBoxId, originalOptions, disabledValues);

       
        thisTool.find('#' + dropdownBoxId).val(selectedValues[key]).change();
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

function setInitialValue(textboxId) {

    selectedOption = thisTool.find("#" + textboxId + " option:selected").val();
    key = $.inArray(selectedOption, functionnames);

    eSelect = document.getElementById(textboxId);
   
    eSelect2 = $(eSelect).parent().parent()[0];

   
   
    thisTool.find(eSelect2).find(":input").val("");
    thisTool.find(eSelect2).find("span").text(initialData[key]);

   
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

   
    blankCount = $.inArray("", selectedValues);
    if ($.inArray("", selectedValues) == -1) {
       
        selectedValuesSorted = selectedValues.sort();
        selectedValuesSortedString = selectedValues.join("-");

        if ($.inArray(selectedValuesSortedString, invalidCombos) >= 0) {
           
            userSelectedVariables = selectedValues[0].toString() + ", "+ 
                selectedValues[1].toString() + ",  and "+ 
                selectedValues[2].toString();
            message = "The variables "+ 
                userSelectedVariables+ 
                " do not form a valid variable combination for this calculation.  "+ 
                "Please select a vaild variable combination.";
            thisTool.find("#status-bar").css("visibility", "visible");
            thisTool.find("#status-bar").addClass("status-error");
            thisTool.find("#status-bar").removeClass("status-info");
            thisTool.find("#status-bar").text(message);
            validCombo = false;
        } else {
           
            thisTool.find("#status-bar").css("visibility", "hidden");
            thisTool.find("#status-bar").addClass("status-error");
            thisTool.find("#status-bar").removeClass("status-info");
            thisTool.find("#status-bar").text("");
            validCombo = true;
        }
    } else {
       
        thisTool.find("#status-bar").addClass('hide');
        thisTool.find("#status-bar").addClass("status-info");
        thisTool.find("#status-bar").removeClass("status-error");
        thisTool.find("#status-bar").text("");
        validCombo = false;

        return
    }
}