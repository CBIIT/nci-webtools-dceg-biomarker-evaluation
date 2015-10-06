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
  
  #create two sheets at a time
  for(n in seq(from = 1, to=length(tabHeaders$fixedValues[[1]]), by = 2)) {
        tabIndexes = list(excelData[[1]][[n]]$tabId, excelData[[1]][[n+1]]$tabId )
        tabIds = list( tabHeaders$fixedValues[[1]][ tabIndexes[[1]] ], tabHeaders$fixedValues[[1]][ tabIndexes[[2]] ] )

        # using fixed category value for the tab titles
        Sheet1 <- createSheet(outwb, sheetName = paste(tabHeaders$fixedHeader, tabIds[1]))
        Sheet2 <-createSheet(outwb, sheetName = paste(tabHeaders$fixedHeader, tabIds[2]))
        
        PPVTable1 = excelData[[ tabIndexes[[1]] ]][[n]]$data
        PPVTableData1 = matrix(unlist(PPVTable1), nrow= length(PPVTable1), byrow=T)
        
        PPVTable2 = excelData[[ tabIndexes[[1]] ]][[n+1]]$data
        PPVTableData2 = matrix(unlist(PPVTable2), nrow= length(PPVTable2), byrow=T)
        
        cNPVTable1 = excelData[[ tabIndexes[[2]] ]][[n]]$data
        cNPVTableData1 = matrix(unlist(cNPVTable1), nrow= length(cNPVTable1), byrow=T)
        
        cNPVTable2 = excelData[[ tabIndexes[[2]] ]][[n+1]]$data
        cNPVTableData2 = matrix(unlist(cNPVTable2), nrow= length(cNPVTable2), byrow=T)
        
        ppvImg1 = excelData[[ tabIndexes[[1]] ]][[n]]$imagePath
        ppvImg2 = excelData[[ tabIndexes[[1]] ]][[n+1]]$imagePath
        
        cnpvImg1 = excelData[[ tabIndexes[[2]] ]][[n]]$imagePath
        cnpvImg2 = excelData[[ tabIndexes[[2]] ]][[n+1]]$imagePath
        
        colnames(PPVTableData1) = columnNames
        colnames(cNPVTableData1) = columnNames
        colnames(PPVTableData2) = columnNames
        colnames(cNPVTableData2) = columnNames
        
        startcol <- length(PPVTable1) + length(cNPVTable1)
        
        HeaderRow1 <- createRow(Sheet1, rowIndex = startingRow - 1)
        HeaderRow2 <- createRow(Sheet2, rowIndex = startingRow - 1)
        
        cnpvHeaderCells1 <- createCell(HeaderRow1, colIndex = 2:3)
        ppvHeaderCells1 <- createCell(HeaderRow1, colIndex = startcol:startcol+1)
        
        cnpvHeaderCells2 <- createCell(HeaderRow2, colIndex = 2:3)
        ppvHeaderCells2 <- createCell(HeaderRow2, colIndex = startcol:startcol+1)
        
        setCellValue(cnpvHeaderCells1[[1,1]], tabHeaders$cnpv)
        setCellValue(ppvHeaderCells1[[1,1]], tabHeaders$ppv)
        
        setCellValue(cnpvHeaderCells2[[1,1]], tabHeaders$cnpv)
        setCellValue(ppvHeaderCells2[[1,1]], tabHeaders$ppv)
        
        addDataFrame(x = as.data.frame.matrix(cNPVTableData1), sheet = Sheet1, startRow = startingRow, row.names = F, startColumn = 2)
        addDataFrame(x = as.data.frame.matrix(PPVTableData1), sheet = Sheet1, startRow = startingRow, startColumn = startcol+2, 
                     row.names = F)
        
        addDataFrame(x = as.data.frame.matrix(cNPVTableData2), sheet = Sheet2, startRow = startingRow, row.names = F, startColumn = 2)
        addDataFrame(x = as.data.frame.matrix(PPVTableData2), sheet = Sheet2, startRow = startingRow, startColumn = startcol+2, 
                     row.names = F)
        
        addPicture(cnpvImg1, Sheet1, scale = .75, startRow = 1, startColumn = 2)
        addPicture(ppvImg1, Sheet1, scale = .75, startRow = 1, startColumn = startcol+2)
        
        addPicture(cnpvImg2, Sheet2, scale = .75, startRow = 1, startColumn = 2)
        addPicture(ppvImg2, Sheet2, scale = .75, startRow = 1, startColumn = startcol+2)
  }
  
  # formatting time to use in filename
  time <- gsub(":","",gsub("-","",gsub(" ","", Sys.time() , fixed=TRUE)));
  
  fileName <- toString(paste(excelDirectory, "risk_stratification_analysis_", time, '.xlsx',sep=''));
  saveWorkbook(outwb, fileName);

  fileName;
}