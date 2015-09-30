library('xlsx');

excelDirectory <- "./tmp/";

loadJSON <- function(string) {
    string = str_replace_all(str_replace_all(string, "u'","'"), "\n","")
    string = str_replace_all(string, "'", "\\\"")
    return (fromJSON(string))
}

writeResultsToExcel <- function (JSONstring) {
  outwb <- createWorkbook();
  
  excelData <- loadJSON(JSONstring)
  startingRow <- 20;
  tabs <- list()
  
  for(n in 1:length(excelData)) {
        tabId = excelData[[n]][[1]]$tabId
        PPVTableData = c(excelData[[n]][[1]]$data)
        cNPVTableData = c(tabs,excelData[[n+1]][[1]]$data)
        startcol <- ncol(PPVTableData) + ncol(cNPVTableData)
        
        ppvImg = excelData[[n]][[1]]$imagePath
        cnpvImg = excelData[[n]][[1]]$imagePath
        
        curSheet <- createSheet(outwb, sheetName = paste("Delta ", tabId))
        
        addDataFrame(x = as.data.frame.matrix(PPVTableData), sheet = curSheet, startRow = startingRow, row.names = F)
        addDataFrame(x = as.data.frame.matrix(cNPVTableData), sheet = curSheet, startRow = startingRow, startColumn = startcol, row.names = F )
        
        addPicture(ppvImg, curSheet, scale = .75, startRow = 1, startColumn = 1)
        addPicture(cnpvImg, curSheet, scale = .75, startRow = 1, startColumn = startcol)
        
  }
  
  
 # for (n in 1:length(tabs)) {
        #       PPVTableData <- allData[[n]]$PPVData
        #       cNPVTableData <- allData[[n]]$cNPVData
        #       
        #       startcol <- ncol(PPVTableData) + ncol(cNPVTableData)
        #       
        #       curSheet <- createSheet(outwb, sheetName = excelData[[n]])
        #       
        #       leftImage <- imgList[[2 * n - 1]]
        #       rightImage <- imgList[[2 * n]]
        #       
        #       addDataFrame(x = as.data.frame.matrix(PPVTableData), sheet = curSheet, startRow = startingRow, row.names = F)
        #       addDataFrame(x = as.data.frame.matrix(cNPVTableData), sheet = curSheet, startRow = startingRow, startColumn = startcol, row.names = F )
        #       
        #       #     row <- getRows(curSheet, rowIndex = startingRow)
        #       #     cells <- getCells(row)
        #       #     
        #       #     setCellStyle(cells, cellStyle = cellStyleGray)
        #       
        #       #     setColumnWidth(curSheet, 1, startingRow)
        #       #     setColumnWidth(curSheet, startcol, startingRow)
        #       
        #       autoSizeColumn(curSheet, 1:ncol(x = as.data.frame.matrix(PPVTableData)))
        #       autoSizeColumn(curSheet, startcol:startcol + ncol(x = as.data.frame.matrix(cNPVTableData)))
        #       
        #       addPicture(leftImage, curSheet, scale = .75, startRow = 1, startColumn = 1)
        #       addPicture(rightImage, curSheet, scale = .75, startRow = 1, startColumn = startcol)
  # }
  
  # formatting time to use in filename
  time <- gsub(":","",gsub("-","",gsub(" ","", Sys.time() , fixed=TRUE)));
  
  fileName <- toString(paste(excelDirectory, "risk_stratification_analysis_", time, '.xlsx',sep=''));
  
  saveWorkbook(outwb, fileName);

  fileName;
}

testString= "[[{\"tabId\": 1, \"data\": [{\"0.1\": 0.177, \"0.01\": 0.0191, \"0.05\": 0.0923}, {\"0.1\": 0.218, \"0.01\": 0.0247, \"0.05\": 0.117}, {\"0.1\": 0.238, \"0.01\": 0.0276, \"0.05\": 0.129}, {\"0.1\": 0.271, \"0.01\": 0.0327, \"0.05\": 0.15}, {\"0.1\": 0.322, \"0.01\": 0.0415, \"0.05\": 0.184}], \"graph_error\": 0, \"prefix\": \"PPV\", \"imagePath\": \"./tmp/PPV1443636441006-1.png\", \"message\": \"success\", \"table_error\": 0}], [{\"tabId\": 1, \"data\": [{\"0.1\": 0.0404, \"0.01\": 0.00382, \"0.05\": 0.0196}, {\"0.1\": 0.0523, \"0.01\": 0.00499, \"0.05\": 0.0255}, {\"0.1\": 0.0572, \"0.01\": 0.00549, \"0.05\": 0.028}, {\"0.1\": 0.0643, \"0.01\": 0.00621, \"0.05\": 0.0315}, {\"0.1\": 0.0735, \"0.01\": 0.00716, \"0.05\": 0.0362}], \"graph_error\": 0, \"prefix\": \"cNPV\", \"imagePath\": \"./tmp/cNPV1443636441006-1.png\", \"message\": \"success\", \"table_error\": 0}]]"