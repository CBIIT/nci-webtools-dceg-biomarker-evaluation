library('RJSONIO')
library('stringr')
source ('riskStratAdvancedOptionWrapper.R', local=RSA)

rdirectory <- "";
drawfunctionprefix = "Draw"
keysforfunction = list("Sens"=1, "Spec"=2, "PPV"=3, "cNPV"=4, "Prev"=5, "Delta"=6);
#keysforfunction = list("1"="Sens", "2"="Spec", "3"="PPV", "4"="cNPV", "5"="Prev", "6"="Delta");
functionnames = list("sensitivity"="Sens", "specificity"="Spec", "ppv"="PPV", "cnpv"="cNPV", "prevalence"="Prev", "delta"="Delta");
rfunctionname = ""

inputtransposelist = list();
datatransposed = "";
excelFilename = ""

JSONstring <- "[[{'tabId': 1, 'data': [{'0.1': 0.177, '0.01': 0.0191, '0.05': 0.0923}, {'0.1': 0.218, '0.01': 0.0247, '0.05': 0.117}, {'0.1': 0.238, '0.01': 0.0276, '0.05': 0.129}, {'0.1': 0.271, '0.01': 0.0327, '0.05': 0.15}, {'0.1': 0.322, '0.01': 0.0415, '0.05': 0.184}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-1.png', 'message': 'success', 'table_error': 0}, {'tabId': 2, 'data': [{'0.1': 0.199, '0.01': 0.0221, '0.05': 0.105}, {'0.1': 0.261, '0.01': 0.0311, '0.05': 0.143}, {'0.1': 0.293, '0.01': 0.0363, '0.05': 0.164}, {'0.1': 0.345, '0.01': 0.0456, '0.05': 0.199}, {'0.1': 0.428, '0.01': 0.0636, '0.05': 0.261}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-2.png', 'message': 'success', 'table_error': 0}, {'tabId': 3, 'data': [{'0.1': 0.21, '0.01': 0.0237, '0.05': 0.112}, {'0.1': 0.287, '0.01': 0.0354, '0.05': 0.16}, {'0.1': 0.328, '0.01': 0.0424, '0.05': 0.187}, {'0.1': 0.395, '0.01': 0.0559, '0.05': 0.236}, {'0.1': 0.501, '0.01': 0.0838, '0.05': 0.323}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-3.png', 'message': 'success', 'table_error': 0}, {'tabId': 4, 'data': [{'0.1': 0.217, '0.01': 0.0246, '0.05': 0.116}, {'0.1': 0.306, '0.01': 0.0385, '0.05': 0.172}, {'0.1': 0.354, '0.01': 0.0474, '0.05': 0.206}, {'0.1': 0.436, '0.01': 0.0656, '0.05': 0.268}, {'0.1': 0.567, '0.01': 0.107, '0.05': 0.383}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-4.png', 'message': 'success', 'table_error': 0}], [{'tabId': 1, 'data': [{'0.1': 0.0404, '0.01': 0.00382, '0.05': 0.0196}, {'0.1': 0.0523, '0.01': 0.00499, '0.05': 0.0255}, {'0.1': 0.0572, '0.01': 0.00549, '0.05': 0.028}, {'0.1': 0.0643, '0.01': 0.00621, '0.05': 0.0315}, {'0.1': 0.0735, '0.01': 0.00716, '0.05': 0.0362}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-1.png', 'message': 'success', 'table_error': 0}, {'tabId': 2, 'data': [{'0.1': 0.0193, '0.01': 0.00179, '0.05': 0.00924}, {'0.1': 0.0294, '0.01': 0.00275, '0.05': 0.0142}, {'0.1': 0.0342, '0.01': 0.00321, '0.05': 0.0165}, {'0.1': 0.0418, '0.01': 0.00395, '0.05': 0.0202}, {'0.1': 0.0529, '0.01': 0.00505, '0.05': 0.0258}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-2.png', 'message': 'success', 'table_error': 0}, {'tabId': 3, 'data': [{'0.1': 0.00742, '0.01': 0.000679, '0.05': 0.00353}, {'0.1': 0.0135, '0.01': 0.00124, '0.05': 0.00645}, {'0.1': 0.0168, '0.01': 0.00156, '0.05': 0.00805}, {'0.1': 0.0226, '0.01': 0.0021, '0.05': 0.0108}, {'0.1': 0.0323, '0.01': 0.00302, '0.05': 0.0155}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-3.png', 'message': 'success', 'table_error': 0}, {'tabId': 4, 'data': [{'0.1': 0.000557, '0.01': 5.07e-05, '0.05': 0.000264}, {'0.1': 0.00148, '0.01': 0.000135, '0.05': 0.000703}, {'0.1': 0.00214, '0.01': 0.000195, '0.05': 0.00102}, {'0.1': 0.00353, '0.01': 0.000322, '0.05': 0.00168}, {'0.1': 0.00664, '0.01': 0.000607, '0.05': 0.00316}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-4.png', 'message': 'success', 'table_error': 0}], [{'tabId': 1, 'data': [{'0.1': 0.177, '0.01': 0.0191, '0.05': 0.0923}, {'0.1': 0.218, '0.01': 0.0247, '0.05': 0.117}, {'0.1': 0.238, '0.01': 0.0276, '0.05': 0.129}, {'0.1': 0.271, '0.01': 0.0327, '0.05': 0.15}, {'0.1': 0.322, '0.01': 0.0415, '0.05': 0.184}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-1.png', 'message': 'success', 'table_error': 0}, {'tabId': 2, 'data': [{'0.1': 0.199, '0.01': 0.0221, '0.05': 0.105}, {'0.1': 0.261, '0.01': 0.0311, '0.05': 0.143}, {'0.1': 0.293, '0.01': 0.0363, '0.05': 0.164}, {'0.1': 0.345, '0.01': 0.0456, '0.05': 0.199}, {'0.1': 0.428, '0.01': 0.0636, '0.05': 0.261}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-2.png', 'message': 'success', 'table_error': 0}, {'tabId': 3, 'data': [{'0.1': 0.21, '0.01': 0.0237, '0.05': 0.112}, {'0.1': 0.287, '0.01': 0.0354, '0.05': 0.16}, {'0.1': 0.328, '0.01': 0.0424, '0.05': 0.187}, {'0.1': 0.395, '0.01': 0.0559, '0.05': 0.236}, {'0.1': 0.501, '0.01': 0.0838, '0.05': 0.323}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-3.png', 'message': 'success', 'table_error': 0}, {'tabId': 4, 'data': [{'0.1': 0.217, '0.01': 0.0246, '0.05': 0.116}, {'0.1': 0.306, '0.01': 0.0385, '0.05': 0.172}, {'0.1': 0.354, '0.01': 0.0474, '0.05': 0.206}, {'0.1': 0.436, '0.01': 0.0656, '0.05': 0.268}, {'0.1': 0.567, '0.01': 0.107, '0.05': 0.383}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-4.png', 'message': 'success', 'table_error': 0}], [{'tabId': 1, 'data': [{'0.1': 0.0404, '0.01': 0.00382, '0.05': 0.0196}, {'0.1': 0.0523, '0.01': 0.00499, '0.05': 0.0255}, {'0.1': 0.0572, '0.01': 0.00549, '0.05': 0.028}, {'0.1': 0.0643, '0.01': 0.00621, '0.05': 0.0315}, {'0.1': 0.0735, '0.01': 0.00716, '0.05': 0.0362}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-1.png', 'message': 'success', 'table_error': 0}, {'tabId': 2, 'data': [{'0.1': 0.0193, '0.01': 0.00179, '0.05': 0.00924}, {'0.1': 0.0294, '0.01': 0.00275, '0.05': 0.0142}, {'0.1': 0.0342, '0.01': 0.00321, '0.05': 0.0165}, {'0.1': 0.0418, '0.01': 0.00395, '0.05': 0.0202}, {'0.1': 0.0529, '0.01': 0.00505, '0.05': 0.0258}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-2.png', 'message': 'success', 'table_error': 0}, {'tabId': 3, 'data': [{'0.1': 0.00742, '0.01': 0.000679, '0.05': 0.00353}, {'0.1': 0.0135, '0.01': 0.00124, '0.05': 0.00645}, {'0.1': 0.0168, '0.01': 0.00156, '0.05': 0.00805}, {'0.1': 0.0226, '0.01': 0.0021, '0.05': 0.0108}, {'0.1': 0.0323, '0.01': 0.00302, '0.05': 0.0155}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-3.png', 'message': 'success', 'table_error': 0}, {'tabId': 4, 'data': [{'0.1': 0.000557, '0.01': 5.07e-05, '0.05': 0.000264}, {'0.1': 0.00148, '0.01': 0.000135, '0.05': 0.000703}, {'0.1': 0.00214, '0.01': 0.000195, '0.05': 0.00102}, {'0.1': 0.00353, '0.01': 0.000322, '0.05': 0.00168}, {'0.1': 0.00664, '0.01': 0.000607, '0.05': 0.00316}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-4.png', 'message': 'success', 'table_error': 0}], [{'tabId': 1, 'data': [{'0.1': 0.177, '0.01': 0.0191, '0.05': 0.0923}, {'0.1': 0.218, '0.01': 0.0247, '0.05': 0.117}, {'0.1': 0.238, '0.01': 0.0276, '0.05': 0.129}, {'0.1': 0.271, '0.01': 0.0327, '0.05': 0.15}, {'0.1': 0.322, '0.01': 0.0415, '0.05': 0.184}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-1.png', 'message': 'success', 'table_error': 0}, {'tabId': 2, 'data': [{'0.1': 0.199, '0.01': 0.0221, '0.05': 0.105}, {'0.1': 0.261, '0.01': 0.0311, '0.05': 0.143}, {'0.1': 0.293, '0.01': 0.0363, '0.05': 0.164}, {'0.1': 0.345, '0.01': 0.0456, '0.05': 0.199}, {'0.1': 0.428, '0.01': 0.0636, '0.05': 0.261}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-2.png', 'message': 'success', 'table_error': 0}, {'tabId': 3, 'data': [{'0.1': 0.21, '0.01': 0.0237, '0.05': 0.112}, {'0.1': 0.287, '0.01': 0.0354, '0.05': 0.16}, {'0.1': 0.328, '0.01': 0.0424, '0.05': 0.187}, {'0.1': 0.395, '0.01': 0.0559, '0.05': 0.236}, {'0.1': 0.501, '0.01': 0.0838, '0.05': 0.323}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-3.png', 'message': 'success', 'table_error': 0}, {'tabId': 4, 'data': [{'0.1': 0.217, '0.01': 0.0246, '0.05': 0.116}, {'0.1': 0.306, '0.01': 0.0385, '0.05': 0.172}, {'0.1': 0.354, '0.01': 0.0474, '0.05': 0.206}, {'0.1': 0.436, '0.01': 0.0656, '0.05': 0.268}, {'0.1': 0.567, '0.01': 0.107, '0.05': 0.383}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-4.png', 'message': 'success', 'table_error': 0}], [{'tabId': 1, 'data': [{'0.1': 0.0404, '0.01': 0.00382, '0.05': 0.0196}, {'0.1': 0.0523, '0.01': 0.00499, '0.05': 0.0255}, {'0.1': 0.0572, '0.01': 0.00549, '0.05': 0.028}, {'0.1': 0.0643, '0.01': 0.00621, '0.05': 0.0315}, {'0.1': 0.0735, '0.01': 0.00716, '0.05': 0.0362}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-1.png', 'message': 'success', 'table_error': 0}, {'tabId': 2, 'data': [{'0.1': 0.0193, '0.01': 0.00179, '0.05': 0.00924}, {'0.1': 0.0294, '0.01': 0.00275, '0.05': 0.0142}, {'0.1': 0.0342, '0.01': 0.00321, '0.05': 0.0165}, {'0.1': 0.0418, '0.01': 0.00395, '0.05': 0.0202}, {'0.1': 0.0529, '0.01': 0.00505, '0.05': 0.0258}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-2.png', 'message': 'success', 'table_error': 0}, {'tabId': 3, 'data': [{'0.1': 0.00742, '0.01': 0.000679, '0.05': 0.00353}, {'0.1': 0.0135, '0.01': 0.00124, '0.05': 0.00645}, {'0.1': 0.0168, '0.01': 0.00156, '0.05': 0.00805}, {'0.1': 0.0226, '0.01': 0.0021, '0.05': 0.0108}, {'0.1': 0.0323, '0.01': 0.00302, '0.05': 0.0155}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-3.png', 'message': 'success', 'table_error': 0}, {'tabId': 4, 'data': [{'0.1': 0.000557, '0.01': 5.07e-05, '0.05': 0.000264}, {'0.1': 0.00148, '0.01': 0.000135, '0.05': 0.000703}, {'0.1': 0.00214, '0.01': 0.000195, '0.05': 0.00102}, {'0.1': 0.00353, '0.01': 0.000322, '0.05': 0.00168}, {'0.1': 0.00664, '0.01': 0.000607, '0.05': 0.00316}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-4.png', 'message': 'success', 'table_error': 0}], [{'tabId': 1, 'data': [{'0.1': 0.177, '0.01': 0.0191, '0.05': 0.0923}, {'0.1': 0.218, '0.01': 0.0247, '0.05': 0.117}, {'0.1': 0.238, '0.01': 0.0276, '0.05': 0.129}, {'0.1': 0.271, '0.01': 0.0327, '0.05': 0.15}, {'0.1': 0.322, '0.01': 0.0415, '0.05': 0.184}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-1.png', 'message': 'success', 'table_error': 0}, {'tabId': 2, 'data': [{'0.1': 0.199, '0.01': 0.0221, '0.05': 0.105}, {'0.1': 0.261, '0.01': 0.0311, '0.05': 0.143}, {'0.1': 0.293, '0.01': 0.0363, '0.05': 0.164}, {'0.1': 0.345, '0.01': 0.0456, '0.05': 0.199}, {'0.1': 0.428, '0.01': 0.0636, '0.05': 0.261}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-2.png', 'message': 'success', 'table_error': 0}, {'tabId': 3, 'data': [{'0.1': 0.21, '0.01': 0.0237, '0.05': 0.112}, {'0.1': 0.287, '0.01': 0.0354, '0.05': 0.16}, {'0.1': 0.328, '0.01': 0.0424, '0.05': 0.187}, {'0.1': 0.395, '0.01': 0.0559, '0.05': 0.236}, {'0.1': 0.501, '0.01': 0.0838, '0.05': 0.323}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-3.png', 'message': 'success', 'table_error': 0}, {'tabId': 4, 'data': [{'0.1': 0.217, '0.01': 0.0246, '0.05': 0.116}, {'0.1': 0.306, '0.01': 0.0385, '0.05': 0.172}, {'0.1': 0.354, '0.01': 0.0474, '0.05': 0.206}, {'0.1': 0.436, '0.01': 0.0656, '0.05': 0.268}, {'0.1': 0.567, '0.01': 0.107, '0.05': 0.383}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/PPV123456-4.png', 'message': 'success', 'table_error': 0}], [{'tabId': 1, 'data': [{'0.1': 0.0404, '0.01': 0.00382, '0.05': 0.0196}, {'0.1': 0.0523, '0.01': 0.00499, '0.05': 0.0255}, {'0.1': 0.0572, '0.01': 0.00549, '0.05': 0.028}, {'0.1': 0.0643, '0.01': 0.00621, '0.05': 0.0315}, {'0.1': 0.0735, '0.01': 0.00716, '0.05': 0.0362}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-1.png', 'message': 'success', 'table_error': 0}, {'tabId': 2, 'data': [{'0.1': 0.0193, '0.01': 0.00179, '0.05': 0.00924}, {'0.1': 0.0294, '0.01': 0.00275, '0.05': 0.0142}, {'0.1': 0.0342, '0.01': 0.00321, '0.05': 0.0165}, {'0.1': 0.0418, '0.01': 0.00395, '0.05': 0.0202}, {'0.1': 0.0529, '0.01': 0.00505, '0.05': 0.0258}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-2.png', 'message': 'success', 'table_error': 0}, {'tabId': 3, 'data': [{'0.1': 0.00742, '0.01': 0.000679, '0.05': 0.00353}, {'0.1': 0.0135, '0.01': 0.00124, '0.05': 0.00645}, {'0.1': 0.0168, '0.01': 0.00156, '0.05': 0.00805}, {'0.1': 0.0226, '0.01': 0.0021, '0.05': 0.0108}, {'0.1': 0.0323, '0.01': 0.00302, '0.05': 0.0155}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-3.png', 'message': 'success', 'table_error': 0}, {'tabId': 4, 'data': [{'0.1': 0.000557, '0.01': 5.07e-05, '0.05': 0.000264}, {'0.1': 0.00148, '0.01': 0.000135, '0.05': 0.000703}, {'0.1': 0.00214, '0.01': 0.000195, '0.05': 0.00102}, {'0.1': 0.00353, '0.01': 0.000322, '0.05': 0.00168}, {'0.1': 0.00664, '0.01': 0.000607, '0.05': 0.00316}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-4.png', 'message': 'success', 'table_error': 0}]]"

getExcelFile <- function(){
    return (excelFilename)
}

createExcel <- function(data, independentType, contourType, fixedType, fixedValues) {
    tableHeaders <- list( 
        ppv = paste("Positive Predictive Value given the ", independentType,", ", contourType," and ", fixedType, sep=""),
        cnpv = paste("Complement of the Negative Predictive Value given the ", independentType,", ", contourType," and ", fixedType, sep=""), 
        independentHeader=independentType,
        contourHeader=contourType, 
        fixedHeader=fixedType,
        fixedValues=strsplit(fixedValues,","))
                         
    
    excelFilename <<- writeResultsToExcel(data, tableHeaders)
}

#getCalculatedData("0.6,0.75,0.8,0.86,0.92","1,1.5,2,3","0.01,0.05,0.1","specificity","delta","prevalence","cNPV","1","3",123456)

getCalculatedData <-
  function(independentStringValue, fixedStringValue, contourStringValue, independentType, fixedType, contourType, keyGraphName, keyNumber, tabValue, uniqueId) {
    # we want to return an array of data objects to front end. Each data object has the table data and the graph image path
    
    try(dev.off(), silent=TRUE);
    
    resultsString = ""

    # separate comma delimited string into lists
    fixedList = as.list(strsplit(fixedStringValue, ",")[[1]]);
    contourList = as.list(strsplit(contourStringValue, ",")[[1]]);
    indList = as.list(strsplit(independentStringValue,",")[[1]]);
    
    # use length of fixedList to know how many tabs to create
    for (tabIndex in 1:length(fixedList)) {
      returnedDataGraph = getTable(independentStringValue, fixedStringValue, contourStringValue, independentType, fixedType, contourType, keyGraphName, keyNumber,tabIndex , uniqueId, list(fixedList[tabIndex]))
      
      resultsString = c(resultsString, returnedDataGraph)
    }
    resultsString[1] <- NULL
    resultsString = gsub("\n","",toJSON(resultsString))
    return (resultsString);
}

getVector <- function (vectorstring) {
  returnvector<-numeric();
  splitString<-strsplit(vectorstring, ",");
  for (i in splitString) {
    returnvector<-append(returnvector, as.numeric(i));
  };
  return(returnvector);
}

getDrawFunctionName <- function (drawfunctionprefix, key, rfunctionname) {
  rDrawFileName = paste(rdirectory);
  rDrawFileName = paste(rDrawFileName, drawfunctionprefix, functionnames[[tolower(c(key))]], rfunctionname, sep = "")
  
  #print(rDrawFileName)
  #print(rfunctionname)
  return(rDrawFileName)
}

JsonWrapper <- function(dppv,prev,spec)
{
  data<- PPVPrevSpec(dppv,prev,spec);
  jsonString = "";
  jsonString=toJSON(round(data,3), method="C");
  str_replace_all(jsonString, "[\n]","");
}

parseURLEncodedString <- function (urlEncodedString) {
  ##print (urlEncodedString);
  string <- URLdecode(urlEncodedString);
  inputList <- lapply(strsplit(string, "&")[[1]], function(x){
    tmp <- strsplit(x, "=")
    val <- tmp[[1]][[2]]
    names(val) <- tmp[[1]][[1]]
    as.list(val)
  });
}