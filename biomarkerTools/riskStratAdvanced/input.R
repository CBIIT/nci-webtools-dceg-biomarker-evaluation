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

getDataJSON <-function(urlEncodedString)
{
  try(dev.off(), silent=TRUE);
  inputList <- parseURLEncodedString(urlEncodedString);
  independent<-getindependent(inputList);   #PPV -2
  independentvalue<-getindependentValue(inputList);
  independentVector<-getVector(getindependentValue(inputList));
  fixed<-getfixed(inputList);   #PREV -3
  fixedvalue<-getfixedValue(inputList);
  fixedVector<-getVector(getfixedValue(inputList));
  contour<- getcontour(inputList);   #SPEC -1
  contourvalue<-getcontourValue(inputList);
  contourVector<-getVector(getcontourValue(inputList));
  key<-getKey(inputList);
  keyNumber<-getkeyNumber(inputList);
  specmin<-getSpecMin(inputList);
  specmax<-getSpecMax(inputList);
  uniqueId <- getUniqueId(inputList);
  tab <- gettab(inputList);
  tabValue <- gettabValue(inputList);
  keyGraphName <- getgraphname(inputList);
  jsonString = "";
  json_string = "";
  errorString = "";
  assign("last.warning", NULL, envir = baseenv());
  result<-getTable(independentvalue, fixedvalue, contourvalue, independent, fixed, contour, gsub("\n","",keyGraphName), keyNumber, tabValue, uniqueId, tab);

  print(result);
  return (result);
}

getCalculatedData <-
  function(independentStringValue, fixedStringValue, contourStringValue, independent, fixed, contour, keyGraphName, keyNumber, tabValue, uniqueId) {
    # we want to return an array of data objects to front end. Each data object has the table data and the graph image path
    
    try(dev.off(), silent=TRUE);
    
    resultsString = ""

    # separate comma delimited string into lists
    fixedList = as.list(strsplit(fixedStringValue, ",")[[1]]);
    contourList = as.list(strsplit(contourStringValue, ",")[[1]]);
    indList = as.list(strsplit(independentStringValue,",")[[1]]);
    
    # use length of fixedList to know how many tabs to create
    for (index in 1:length(fixedList)) {
      returnedDataGraph = getTable(independentStringValue, fixedStringValue, contourStringValue, independent, fixed, contour, keyGraphName, keyNumber,index , uniqueId, list(index))
      
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
  
  print(rDrawFileName)
  print(rfunctionname)
  return(rDrawFileName)
}

getKey <- function (inputList) {
  inputList[[1]][[1]];
}

getkeyNumber <- function (inputList){
  inputList[[2]][[1]];
  
}

getindependent <- function (inputList) {
  inputList[[3]][[1]];
}

getfixed <- function (inputList) {
  inputList[[4]][[1]];
}

getcontour <- function (inputList) {
  inputList[[5]][[1]];
}

getindependentValue <- function (inputList) {
  inputList[[6]][[1]];
}

getfixedValue <- function (inputList) {
  inputList[[7]][[1]];
}

getcontourValue <- function (inputList) {
  inputList[[8]][[1]];
}

getSpecMin <- function (inputList) {
  inputList[[9]][[1]];
}

getSpecMax <- function (inputList) {
  inputList[[10]][[1]];
}

getUniqueId <- function (inputList) {
  inputList[[11]][[1]];
}

gettab <- function (inputList) {
  inputList[12][[1]];
}

gettabValue <- function (inputList) {
  inputList[[13]][[1]];
}

getgraphname <- function (inputList) {
  inputList[[14]][[1]];
}

JsonWrapper <- function(dppv,prev,spec)
{
  data<- PPVPrevSpec(dppv,prev,spec);
  jsonString = "";
  jsonString=toJSON(round(data,3), method="C");
  str_replace_all(jsonString, "[\n]","");
}

parseURLEncodedString <- function (urlEncodedString) {
  #print (urlEncodedString);
  string <- URLdecode(urlEncodedString);
  inputList <- lapply(strsplit(string, "&")[[1]], function(x){
    tmp <- strsplit(x, "=")
    val <- tmp[[1]][[2]]
    names(val) <- tmp[[1]][[1]]
    as.list(val)
  });
}
