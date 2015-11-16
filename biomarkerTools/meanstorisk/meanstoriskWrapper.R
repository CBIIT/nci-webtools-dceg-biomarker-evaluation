library('RJSONIO')
library('stringr')
source ('./RiskFromROC.R',local=environment())
source ('./writeToExcel.R',local=environment())

#urlEncodedString <- "option=2&spec=0.8%2c0.9%2c0.95%2c0.99%2c0.995&prev=0.5%2c0.6%2c0.7%2c0.8%2c0.9&cases=4%2c0.1%2c100&controls=1%2c0.1%2c200&uniqueid=TEST&graphkey=input";

#urlEncodedString<- "option=1&spec=0.8%2c0.9%2c0.95%2c0.99%2c0.995&prev=0.5%2c0.6%2c0.7%2c0.8%2c0.9&cases=4%2c0.1%2c100&controls=1%2c0.1%2c200"
#urlEncodedString<- "option=2&spec=0&prev=0&datarowcount=9&colcount=2&dataCSV=p16_ELISA%2cHGCIN%2c0.00%2c0%2c0.00%2c0%2c0.00%2c0%2c6.06%2c0%2c6.16%2c0%2c6.3398%2c0%2c6.47%2c0%2c6.81%2c0"
#getExcel(urlEncodedString);
#urlEncodedString<- "spec=0.8%2c0.9%2c0.95%2c0.99%2c0.995&prev=0.5%2c0.6%2c0.7%2c0.8%2c0.9&datarowcount=9&colcount=2&dataCSV=0.00%2c0%2c0.00%2c0%2c0.00%2c0%2c6.06%2c0%2c6.16%2c0%2c6.3398%2c0%2c6.47%2c0%2c6.81%2c0"

urlEncodedString <- "option=1&spec=0.8%2C+0.9%2C+0.95%2C+0.99%2C+0.999&prev=0.1%2C+0.05%2C+0.01%2C+0.005%2C+0.001&datarowcount=76&colcount=2&unique_key=1443709839065&graphkey=CSV&dataCSV=0.00%2C0%0D%2C0.00%2C0%0D%2C0.00%2C0%0D%2C6.06%2C0%0D%2C6.16%2C0%0D%2C6.3398%2C0%0D%2C6.47%2C0%0D%2C6.81%2C0%0D%2C7.9873%2C0%0D%2C8.18%2C0%0D%2C8.71%2C0%0D%2C10.41%2C0%0D%2C10.69%2C0%0D%2C11.12%2C0%0D%2C11.21%2C0%0D%2C11.38%2C0%0D%2C11.63%2C0%0D%2C12.69%2C0%0D%2C15.30%2C0%0D%2C23.88%2C0%0D%2C29.39%2C0%0D%2C2.088%2C0%0D%2C37.15%2C0%0D%2C11.885%2C0%0D%2C59.49%2C0%0D%2C3.1852%2C0%0D%2C6.03%2C0%0D%2C0.00%2C0%0D%2C0.00%2C0%0D%2C15.72%2C0%0D%2C12.34%2C0%0D%2C160.00%2C1%0D%2C72.03%2C1%0D%2C49.99%2C1%0D%2C70.89%2C1%0D%2C9.08%2C1%0D%2C9.59%2C1%0D%2C12.83%2C1%0D%2C0.00%2C1%0D%2C30.19%2C1%0D%2C54.89%2C1%0D%2C56.00%2C1%0D%2C48.47%2C1%0D%2C38.89%2C1%0D%2C22.904%2C1%0D%2C52.68%2C1%0D%2C16.72%2C1%0D%2C7.01%2C1%0D%2C19.05%2C1%0D%2C51.96%2C1%0D%2C116.33%2C1%0D%2C49.69%2C1%0D%2C68.34%2C1%0D%2C36.25%2C1%0D%2C32.09%2C1%0D%2C88.79%2C1%0D%2C19.94%2C1%0D%2C32.55%2C1%0D%2C36.34%2C1%0D%2C160.00%2C1%0D%2C112.87%2C1%0D%2C8.96%2C1%0D%2C86.79%2C1%0D%2C160.00%2C1%0D%2C138.42%2C1%0D%2C21.744%2C1%0D%2C62.13%2C1%0D%2C48.38%2C1%0D%2C46.84%2C1%0D%2C119.44%2C1%0D%2C104.96%2C1%0D%2C9.51%2C1%0D%2C66.21%2C1%0D%2C22.37%2C1%0D%2C160.00%2C1%0D%2C51.31%2C1%0D"

urlEncodedStringX <- "option=3&spec=0.8%2C+0.9%2C+0.95%2C+0.99%2C+0.999&prev=0.1%2C+0.05%2C+0.01%2C+0.005%2C+0.001&datarowcount=76&colcount=2&unique_key=1443709839065&graphkey=CSV&dataCSV=0.00%2C0%0D%2C0.00%2C0%0D%2C0.00%2C0%0D%2C6.06%2C0%0D%2C6.16%2C0%0D%2C6.3398%2C0%0D%2C6.47%2C0%0D%2C6.81%2C0%0D%2C7.9873%2C0%0D%2C8.18%2C0%0D%2C8.71%2C0%0D%2C10.41%2C0%0D%2C10.69%2C0%0D%2C11.12%2C0%0D%2C11.21%2C0%0D%2C11.38%2C0%0D%2C11.63%2C0%0D%2C12.69%2C0%0D%2C15.30%2C0%0D%2C23.88%2C0%0D%2C29.39%2C0%0D%2C2.088%2C0%0D%2C37.15%2C0%0D%2C11.885%2C0%0D%2C59.49%2C0%0D%2C3.1852%2C0%0D%2C6.03%2C0%0D%2C0.00%2C0%0D%2C0.00%2C0%0D%2C15.72%2C0%0D%2C12.34%2C0%0D%2C160.00%2C1%0D%2C72.03%2C1%0D%2C49.99%2C1%0D%2C70.89%2C1%0D%2C9.08%2C1%0D%2C9.59%2C1%0D%2C12.83%2C1%0D%2C0.00%2C1%0D%2C30.19%2C1%0D%2C54.89%2C1%0D%2C56.00%2C1%0D%2C48.47%2C1%0D%2C38.89%2C1%0D%2C22.904%2C1%0D%2C52.68%2C1%0D%2C16.72%2C1%0D%2C7.01%2C1%0D%2C19.05%2C1%0D%2C51.96%2C1%0D%2C116.33%2C1%0D%2C49.69%2C1%0D%2C68.34%2C1%0D%2C36.25%2C1%0D%2C32.09%2C1%0D%2C88.79%2C1%0D%2C19.94%2C1%0D%2C32.55%2C1%0D%2C36.34%2C1%0D%2C160.00%2C1%0D%2C112.87%2C1%0D%2C8.96%2C1%0D%2C86.79%2C1%0D%2C160.00%2C1%0D%2C138.42%2C1%0D%2C21.744%2C1%0D%2C62.13%2C1%0D%2C48.38%2C1%0D%2C46.84%2C1%0D%2C119.44%2C1%0D%2C104.96%2C1%0D%2C9.51%2C1%0D%2C66.21%2C1%0D%2C22.37%2C1%0D%2C160.00%2C1%0D%2C51.31%2C1%0D"

imageDirectory <- "./tmp/";
excelFileName = ""

getDataJSON <-function(urlEncodedString)
{
  #create img directory if it is not there
  dir.create(imageDirectory);
  inputList <- parseURLEncodedString(urlEncodedString);
  #data <- read.csv("p16-ELISA-sample-data.csv")
  option <- getOption(inputList);
  #spec<-c(0.8, 0.9, 0.95, 0.99, 0.995)
  #prev<-c(0.5, 0.6, 0.7, 0.8, 0.9)
  spec <- getVector(getSpec(inputList));
  prev <- getVector(getPrev(inputList));
  jsonString = "";
  if (as.numeric(option)==1)
  {
    #data <- read.csv("p16-ELISA-sample-data.csv")
    data =  matrix(c(as.numeric(strsplit(inputList[[8]][[1]],',')[[1]])), ncol = as.numeric(getcolcount(inputList)), nrow = as.numeric(getrowcount(inputList)), byrow=TRUE);
    risk1<-RiskFromROC(data, spec, prev);
    jsonString=toJSON(risk1, method="C");
    uniqueId <- inputList[[6]][[1]];
    graphname <- inputList[[7]][[1]];
    imageFileName <-getRawROCGraph(data, uniqueId, graphname);
      
    excelFileName <<- writeResultsToExcel(risk1, imageFileName);
  }
  else if (as.numeric(option)==2)
  {
    #cases<-c(4, 0.1, 100)
    #controls<-c(1, 0.1, 200)
    cases <- getVector(inputList[[4]][[1]]);
    controls <- getVector(inputList[[5]][[1]]);
    risk2<-deltaspecppv(cases, controls, spec, prev);
    
    specmin<-min(spec);
    specmax<-max(spec);
    jsonString=toJSON(risk2, method="C");
    uniqueId <- inputList[[6]][[1]];
    graphname <- inputList[[7]][[1]];
    imageFileName <- getROCGraph(specmin, specmax, risk2$Delta[8,3], uniqueId, graphname);
      
    excelFileName <<- writeResultsToExcel(risk2, imageFileName);
    
  } else if (as.numeric(option) == 3) {
  	 #data <- read.csv("p16-ELISA-sample-data.csv")
#    data =  matrix(c(as.numeric(strsplit(inputList[[8]][[1]],',')[[1]])), ncol = as.numeric(getcolcount(inputList)), nrow = as.numeric(getrowcount(inputList)), byrow=TRUE);
#    risk1<-RiskFromROC(data, spec, prev);
#    uniqueId <- inputList[[6]][[1]];
#    graphname <- inputList[[7]][[1]];
#    imageFileName <-getRawROCGraph(data, uniqueId, graphname);
    
    jsonString <- toJSON(excelFileName, method="C");
 
  } else if (as.numeric(option) == 4) {
   	#cases<-c(4, 0.1, 100)
    #controls<-c(1, 0.1, 200)
    #    cases <- getVector(inputList[[4]][[1]]);
    #    controls <- getVector(inputList[[5]][[1]]);
    #    risk2<-deltaspecppv(cases, controls, spec, prev);
    #    
    #    specmin<-min(spec);
    #    specmax<-max(spec);
    #    uniqueId <- inputList[[6]][[1]];
    #    graphname <- inputList[[7]][[1]];
    #    imageFileName <- getROCGraph(specmin, specmax, risk2$Delta[8,3], uniqueId, graphname);
    #    
    #    excelFileName <- writeResultsToExcel(risk2, imageFileName);
    jsonString <- toJSON(excelFileName, method="C");
 
  }

  str_replace_all(jsonString, "[\n]","");
}

getExcel <-function(urlEncodedString)
{
  #create img directory if it is not there
  dir.create(imageDirectory);
  inputList <- parseURLEncodedString(urlEncodedString);
  #data <- read.csv("p16-ELISA-sample-data.csv")
  option <- getOption(inputList);
  #spec<-c(0.8, 0.9, 0.95, 0.99, 0.995)
  #prev<-c(0.5, 0.6, 0.7, 0.8, 0.9)
  spec <- getVector(getSpec(inputList));
  prev <- getVector(getPrev(inputList));
  jsonString = "";
  if (as.numeric(option)==1)
  {
    data <- read.csv("p16-ELISA-sample-data.csv")
    # data =  matrix(c(as.numeric(strsplit(inputList[[8]][[1]],',')[[1]])), ncol = as.numeric(getcolcount(inputList)), nrow = as.numeric(getrowcount(inputList)), byrow=TRUE);
    risk1<-RiskFromROC(data, spec, prev);
    uniqueId <- inputList[[6]][[1]];
    graphname <- inputList[[7]][[1]];
    imageFileName <-getRawROCGraph(data, uniqueId, graphname);
    
    excelFileName <- writeResultsToExcel(risk1, imageFileName);
    jsonString <- toJSON(excelFileName, method="C");
  }
  else if (as.numeric(option)==2)
  {
    #cases<-c(4, 0.1, 100)
    #controls<-c(1, 0.1, 200)
    cases <- getVector(inputList[[4]][[1]]);
    controls <- getVector(inputList[[5]][[1]]);
    risk2<-deltaspecppv(cases, controls, spec, prev);
    
    specmin<-min(spec);
    specmax<-max(spec);
    uniqueId <- inputList[[6]][[1]];
    graphname <- inputList[[7]][[1]];
    imageFileName <- getROCGraph(specmin, specmax, risk2$Delta[8,3], uniqueId, graphname);
    
    excelFileName <<- writeResultsToExcel(risk2, imageFileName);
    jsonString <- toJSON(excelFileName, method="C");
  }
  
  str_replace_all(jsonString, "[\n]","");
}

getData <-function(urlEncodedString)
{
  inputList <- parseURLEncodedString(urlEncodedString);
  data <- read.csv("p16-ELISA-sample-data.csv");
#  data <- read.csv("/home/brent/development/nci-analysis-tools-web-presence/src/meanstorisk/p16-ELISA-sample-data.csv");
  spec<-c(0.8, 0.9, 0.95, 0.99, 0.995)
  prev<-c(0.5, 0.6, 0.7, 0.8, 0.9)

  risk1<-RiskFromROC(data, spec, prev)
  DrawRawROC(data)
}

getVector <- function (vectorstring) {
  returnvector<-numeric();
  splitString<-strsplit(vectorstring, ",");
  for (i in splitString) {
    returnvector<-append(returnvector, as.numeric(i));
  };
  return(returnvector);
}

parseURLEncodedString <- function (urlEncodedString) {
  #print (urlEncodedString);
  string <- URLdecode(urlEncodedString);
  inputList <- lapply(strsplit(string, "&")[[1]], function(x){
    tmp <- strsplit(x, "=")
    if (length(tmp[[1]]) == 1 && tmp[[1]][[1]] == "dataCSV") {
      stop("FileNotFound")
    }
    val <- tmp[[1]][[2]]
    names(val) <- tmp[[1]][[1]]
    as.list(val)
  });
}

getRawROCGraph <- function (data, uniqueId, keyGraphName) {
  imageFileName = paste(imageDirectory, keyGraphName, uniqueId, ".png", sep = '');
  png(file = imageFileName , units="in", width=10, height=8, res=150);
  DrawRawROC(data);
  dev.off();
  imageFileName;
}

getROCGraph <- function (specmin, specmax, delta, uniqueId, keyGraphName) {
  imageFileName = paste(imageDirectory, keyGraphName, uniqueId, ".png", sep = '');
  png(file = imageFileName , units="in", width=10, height=8, res=150);
  DrawROC(specmin, specmax, delta);
  dev.off();
  imageFileName;
}

getOption <- function (inputList) {
  inputList[[1]][[1]];
}

getSpec <- function (inputList) {
  inputList[[2]][[1]];
}

getPrev <- function (inputList) {
  inputList[[3]][[1]];
}

getrowcount <- function (inputList) {
  inputList[[4]][[1]];
}

getcolcount <- function (inputList) {
  inputList[[5]][[1]];
}

getdata <- function (inputList) {
  inputList[[6]][[1]];
}
