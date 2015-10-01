library('xlsx');

excelDirectory <- "./tmp/";

loadJSON <- function(string) {
    string = str_replace_all(str_replace_all(string, "u'","'"), "\n","")
    string = str_replace_all(string, "'", "\\\"")
    return (fromJSON(content =string,depth = 4))
}

writeResultsToExcel <- function (JSONstring, tabHeaders) {
    
  outwb <- createWorkbook();
  
  excelData <- loadJSON(JSONstring)
  startingRow <- 22;
  tabs <- list()
  
  columnNames <- names(excelData[[1]][[1]]$data[[1]])
  
  for(n in seq(from = 1, to=length(excelData), by = 2)) {
        tabId = excelData[[n]][[1]]$tabId
        
        PPVTable = excelData[[n]][[1]]$data
        PPVTableData = matrix(unlist(PPVTable), nrow= length(PPVTable), byrow=T)
        
        colnames(PPVTableData) = columnNames
        
        cNPVTable = excelData[[n+1]][[1]]$data
        cNPVTableData = matrix(unlist(cNPVTable), nrow= length(cNPVTable), byrow=T)
        
        colnames(cNPVTableData) = columnNames
        
        startcol <- length(PPVTable) + length(cNPVTable)
        
        ppvImg = excelData[[n]][[1]]$imagePath
        cnpvImg = excelData[[n+1]][[1]]$imagePath
        
        # using fixed category value for the tab titles
        curSheet <- createSheet(outwb, sheetName = paste(tabHeaders$fixedHeader, tabId))
        
        HeaderRow <- createRow(curSheet, rowIndex = startingRow - 1)
        
        cnpvHeaderCells <- createCell(HeaderRow, colIndex = 1:startcol+length(cNPVTable))
        ppvHeaderCells <- createCell(HeaderRow, colIndex = startcol+length(PPVTable):startcol+length(PPVTable) + 2)
        
        setCellValue(cnpvHeaderCells[[1,2]], tabHeaders$cnpv)
        setCellValue(cnpvHeaderCells[[4,6]], tabHeaders$cnpv)
        
        addMergedRegion(curSheet, startingRow-1, startcol, startingRow-1, startingRow+2)
        
        addDataFrame(x = as.data.frame.matrix(PPVTableData), sheet = curSheet, startRow = startingRow, row.names = F, startColumn = 2)
        addDataFrame(x = as.data.frame.matrix(cNPVTableData), sheet = curSheet, startRow = startingRow, startColumn = startcol, row.names = F )
        
       addPicture(ppvImg, curSheet, scale = .75, startRow = 1, startColumn = 2)
       addPicture(cnpvImg, curSheet, scale = .75, startRow = 1, startColumn = startcol)
  }
  
  # formatting time to use in filename
  time <- gsub(":","",gsub("-","",gsub(" ","", Sys.time() , fixed=TRUE)));
  
  fileName <- toString(paste(excelDirectory, "risk_stratification_analysis_", time, '.xlsx',sep=''));
  saveWorkbook(outwb, fileName);

  fileName;
}