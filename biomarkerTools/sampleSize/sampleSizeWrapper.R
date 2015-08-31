library('RJSONIO')
source ('./DrawCompRecVark.R', local=environment())
source ('./writeToExcel.R',local=environment())

imageDirectory="./tmp/" 

#example input values
k=c(0,1)
sens=c(0.8, 0.9, 0.95, 0.995)
spec=c(0.7,0.8,0.9)
prev=0.001
N=100
excel=TRUE

saveAllSensGraphs <- function(k, sens, spec, prev, N, uniqueId, exporting) {
  specTabs=1:length(spec)
  allSensData= list()
  tabsList= list()
  
  for (i in specTabs) {
    data=saveSensContours(k, sens, spec[i], prev, N, uniqueId, i)
    tab=paste('tab', i, sep='')
    allSensData[[tab]]=data
    tabsList[[i]] <- tab
  }
  
  if(exporting == TRUE) {
    
    for(i in specTabs) {
      tab=paste('tab', i, sep='')
      prepareSaveGraph(imageDirectory, "PPVkSensSpec-", uniqueId, i)
      prepareSaveGraph(imageDirectory, "cNPVkSensSpec-", uniqueId, i)
      writeResultsToExcel(tab, allSensData)
    }
    
    jsonString <- toJSON(excelFileName, method="C");
  }

    return (toJSON(allSensData, .escapeEscape=TRUE))
}

saveAllSpecGraphs <- function(k, sens, spec, prev, N, uniqueId, exporting) {
  sensTabs=1:length(sens)
  allSpecData= list()
  
  for (i in sensTabs) {
    tab=paste('tab', i, sep='')
    data=saveSpecContours(k, sens[i], spec, prev, N, uniqueId, i)
    allSpecData[[tab]]=data
  }
  
  if(exporting == TRUE) {
    
    for(i in sensTabs) {
      tab=paste('tab', i, sep='')
      prepareSaveGraph(imageDirectory, "PPVkSpecSens-", uniqueId, i)
      prepareSaveGraph(imageDirectory, "cNPVkSpecSens-", uniqueId, i)
      imageFileName <- prepareSaveGraph(specmin, specmax, allSpecData[[i]], uniqueId, graphname);
      writeResultsToExcel(tab, allSpecData)
    }
  }
    return (toJSON(allSpecData, .escapeEscape=TRUE))
}

saveSensContours <- function(k, sens, spec, prev, N, uniqueId, tabvalue)
{
  #k=c(0,1)
  #sens=c(0.8, 0.9, 0.95, 0.995)
  #spec=0.8
  #prev=0.001
  #N=1
  #uniqueId=1
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

#example input values
#k=c(0,1)
#spec=c(0.8, 0.9, 0.95, 0.995)
#sens=0.1
#prev=0.001
#N=1

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
