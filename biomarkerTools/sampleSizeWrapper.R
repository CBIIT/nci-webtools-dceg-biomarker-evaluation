library('RJSONIO')
source ('./DrawCompRecVark.R')

imageDirectory="./tmp/" 

saveAllSensGraphs <- function(minVal, maxVal, sens, spec, prev, N, uniqueId) {
  specTabs=1:length(spec)
  allSensData= list()
  for (i in specTabs) {
    data=saveSensContours(minVal, maxVal, sens, spec[i], prev, N, uniqueId, i)
    tab=paste('tab', i, sep='')
    allSensData[[tab]]=data
  }
#Remove cat
  return (toJSON(allSensData, .escapeEscape=TRUE))
}


saveAllSpecGraphs <- function(minVal, maxVal, sens, spec, prev, N, uniqueId) {
  sensTabs=1:length(sens)
  allSpecData= list()
  for (i in sensTabs) {
    data=saveSpecContours(minVal, maxVal, sens[i], spec, prev, N, uniqueId, i)
    tab=paste('tab', i, sep='')
    allSpecData[[tab]]=data
  }
#Remove cat
  return (toJSON(allSpecData, .escapeEscape=TRUE))
}


#example input values
#k=c(0,1)
#sens=c(0.8, 0.9, 0.95, 0.995)
#spec=0.8
#prev=0.001
#N=1

#saveSensContours <- function()
saveSensContours <- function(minVal, maxVal, sens, spec, prev, N, uniqueId, tabvalue)
{
  #k=c(0,1)
  #sens=c(0.8, 0.9, 0.95, 0.995)
  #spec=0.8
  #prev=0.001
  #N=1
  #uniqueId=1
  #save the PPV graph
  prepareSaveGraph(imageDirectory, "PPVkSensSpec-", uniqueId, tabvalue)
  DrawCompRecVarkSensSpec(minVal, maxVal, sens, spec, prev, N)
  dev.off()
  
  ppvData=CompRecVarkSensSpec(sens, spec, prev, N)
  
  #save the cNPV graph
  prepareSaveGraph(imageDirectory, "cNPVkSensSpec-", uniqueId, tabvalue)
  DrawCompRecVarcNPVkSensSpec(minVal, maxVal, sens, spec, prev, N)
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

saveSpecContours <- function(minVal, maxVal, sens, spec, prev, N, uniqueId, tabvalue)
{
  #save the PPV graph
  prepareSaveGraph(imageDirectory, "PPVkSpecSens-", uniqueId, tabvalue)
  DrawCompRecVarkSpecSens(minVal, maxVal, spec, sens, prev, N)
  dev.off()
  
  ppvData=CompRecVarkSpecSens(spec, sens, prev, N)
    
  #save the cNPV graph
  prepareSaveGraph(imageDirectory, "cNPVkSpecSens-", uniqueId, tabvalue)
  DrawCompRecVarcNPVkSpecSens(minVal, maxVal, spec, sens, prev, N)
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