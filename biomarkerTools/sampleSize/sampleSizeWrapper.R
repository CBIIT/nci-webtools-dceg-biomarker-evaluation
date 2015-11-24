library(RJSONIO)
source ('./DrawCompRecVark.R', local=environment())
source ('./writeToExcel.R',local=environment())

imageDirectory="./tmp/" 
imgList = list()
excelFileName = ""

saveAllSensGraphs <- function(jsoninput) {
  jsoninput <- fromJSON(jsoninput)
  k <- as.numeric(jsoninput$k)
  sens <- as.numeric(jsoninput$sens)
  spec <- as.numeric(jsoninput$spec)
  prev <- as.numeric(jsoninput$prev)
  N <- as.numeric(jsoninput$N)
  uniqueId <- jsoninput$uniqueId
  exporting <- jsoninput$exporting
  specTabs=1:length(spec)
  allSensData= list()
  tabsList= list()
  tabs = list()
  
  for (i in specTabs) {
    data=saveSensContours(k, sens, spec[i], prev, N, uniqueId, i)
    tab=paste('tab', i, sep='')
    allSensData[[tab]]=data
    tabsList[[i]] <- tab
    
    tabs[[i]] = paste('Specificity', spec[[i]])
  }
  excelFileName <<- writeResultsToExcel(tabs, allSensData, imgList, "sens")
  imgList <<- list()

    return (toJSON(allSensData, .escapeEscape=TRUE))
}

getExcel <- function() {
    return (toJSON(excelFileName, method="C"))
}

saveAllSpecGraphs <- function(jsoninput) {
  jsoninput <- fromJSON(jsoninput)
  k <- as.numeric(jsoninput$k)
  sens <- as.numeric(jsoninput$sens)
  spec <- as.numeric(jsoninput$spec)
  prev <- as.numeric(jsoninput$prev)
  N <- as.numeric(jsoninput$N)
  uniqueId <- jsoninput$uniqueId
  exporting <- jsoninput$exporting
  sensTabs=1:length(sens)
  allSpecData= list()
  tabsList= list()
  tabs = list()
  
  for (i in sensTabs) {
    data=saveSpecContours(k, sens[i], spec, prev, N, uniqueId, i)
    tab=paste('tab', i, sep='')
    allSpecData[[tab]]=data
    tabsList[[i]] <- tab
    tabs[[i]] = paste('Sensitivity', sens[[i]])
  }
  
  excelFileName <<- writeResultsToExcel(tabs, allSpecData, imgList, "spec")
  imgList <<- list()

    return (toJSON(allSpecData, .escapeEscape=TRUE))
}

saveSensContours <- function(k, sens, spec, prev, N, uniqueId, tabvalue)
{
  #save the PPV graph
  prepareSaveGraph(imageDirectory, "PPVkSensSpec-", uniqueId, tabvalue)
  DrawCompRecVarkSensSpec(k, sens, spec, prev, N)
  dev.off()
  
  ppvData=CompRecVarkSensSpec(sens, spec, prev, N)
  
  #save the cNPV graph
  prepareSaveGraph(imageDirectory, "cNPVkSensSpec-", uniqueId, tabvalue)
  DrawCompRecVarcNPVkSensSpec(k, sens, spec, prev, N)
  dev.off()
  
  cnpvData=CompRecVarcNPVkSensSpec(sens, spec, prev, N)

  data=list(PPVData=ppvData, cNPVData=cnpvData)
  
  return (data)
}

saveSpecContours <- function(k, sens, spec, prev, N, uniqueId, tabvalue)
{
  #save the PPV graph
  prepareSaveGraph(imageDirectory, "PPVkSpecSens-", uniqueId, tabvalue)
  DrawCompRecVarkSpecSens(k, spec, sens, prev, N)
  dev.off()
  
  ppvData=CompRecVarkSpecSens(spec, sens, prev, N)
    
  #save the cNPV graph
  prepareSaveGraph(imageDirectory, "cNPVkSpecSens-", uniqueId, tabvalue)
  DrawCompRecVarcNPVkSpecSens(k, spec, sens, prev, N)
  dev.off();
  
  cnpvData=CompRecVarcNPVkSpecSens(spec, sens, prev, N)
  
  data=list(PPVData=ppvData, cNPVData=cnpvData)
  
  return (data)
}

#preparation needed to save a graph as a file
prepareSaveGraph <- function(imgDir, graphPrefix, uniqueId, tabvalue) {
  if (!file.exists(imgDir)) {
    dir.create(imgDir)  
  }
  graph=paste(imgDir, graphPrefix, uniqueId, "-", as.numeric(tabvalue),".png", sep='')
  imgList <<- c(imgList, graph)
  png(file=graph)
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
