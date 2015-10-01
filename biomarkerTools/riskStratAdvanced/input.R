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
JSONstring <-"[[{'tabId': 1, 'data': [{'0.1': 0.177, '0.01': 0.0191, '0.05': 0.0923}, {'0.1': 0.218, '0.01': 0.0247, '0.05': 0.117}, {'0.1': 0.238, '0.01': 0.0276, '0.05': 0.129}, {'0.1': 0.271, '0.01': 0.0327, '0.05': 0.15}, {'0.1': 0.322, '0.01': 0.0415, '0.05': 0.184}], 'graph_error': 0, 'prefix': 'PPV', 'imagePath': './tmp/cNPV123456-1.png', 'message': 'success', 'table_error': 0}], [{'tabId': 1, 'data': [{'0.1': 0.0404, '0.01': 0.00382, '0.05': 0.0196}, {'0.1': 0.0523, '0.01': 0.00499, '0.05': 0.0255}, {'0.1': 0.0572, '0.01': 0.00549, '0.05': 0.028}, {'0.1': 0.0643, '0.01': 0.00621, '0.05': 0.0315}, {'0.1': 0.0735, '0.01': 0.00716, '0.05': 0.0362}], 'graph_error': 0, 'prefix': 'cNPV', 'imagePath': './tmp/cNPV123456-1.png', 'message': 'success', 'table_error': 0}]]"    
getExcelFile <- function(){
    return (excelFilename)
}

createExcel <- function(data,independent,contour,fixed){
    tableHeaders <- list( ppv= paste("Positive Predictive Value given ", independent,",", contour,", ", fixed, sep=""),
                          cnpv=paste("Complement of the Negative Predictive Value ", independent,",", contour,", ", fixed, sep=""), independentHeader=independent,contourHeader=contour, fixedHeader=fixed)
                         
    
    excelFilename <<- writeResultsToExcel(data, tableHeaders)
}

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