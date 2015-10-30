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
  for(n in seq(from = 1, to=length(tabHeaders$fixedValues[[1]]))) {
        tabIndexes = list(excelData[[1]][[n]]$tabId, excelData[[2]][[n]]$tabId )
        tabId = tabHeaders$fixedValues[[1]][ n ]

        # using fixed category value for the tab titles
        Sheet1 <- createSheet(outwb, sheetName = paste(tabHeaders$fixedHeader, tabId))

        HeaderRow1 <- createRow(Sheet1, rowIndex = startingRow - 1)
        
        cNPVTable1 = excelData[[2]][[n]]$data
        cNPVTableData1 = matrix(unlist(cNPVTable1), nrow= length(cNPVTable1), byrow=T)
        cnpvImg1 = excelData[[2]][[n]]$imagePath
        cnpvHeaderCells1 <- createCell(HeaderRow1, colIndex = 2:2)
        setCellValue(cnpvHeaderCells1[[1,1]], tabHeaders$cnpv)
        colnames(cNPVTableData1) = columnNames
        addDataFrame(x = as.data.frame.matrix(cNPVTableData1), sheet = Sheet1, startRow = startingRow, row.names = F, startColumn = 2)
        addPicture(cnpvImg1, Sheet1, scale = .75, startRow = 1, startColumn = 2)
        
        startcol <- max(length(cNPVTable1)+4,8)
        
        
        PPVTable1 = excelData[[1]][[n]]$data
        PPVTableData1 = matrix(unlist(PPVTable1), nrow= length(PPVTable1), byrow=T)
        ppvImg1 = excelData[[1]][[n]]$imagePath
        ppvHeaderCells1 <- createCell(HeaderRow1, colIndex = startcol:startcol)
        setCellValue(ppvHeaderCells1[[1,1]], tabHeaders$ppv)
        colnames(PPVTableData1) = columnNames
        addDataFrame(x = as.data.frame.matrix(PPVTableData1), sheet = Sheet1, startRow = startingRow, row.names = F, startColumn = startcol)
        addPicture(ppvImg1, Sheet1, scale = .75, startRow = 1, startColumn = startcol)
  }
  
  # formatting time to use in filename
  time <- gsub(":","",gsub("-","",gsub(" ","", Sys.time() , fixed=TRUE)));
  
  fileName <- toString(paste(excelDirectory, "risk_stratification_analysis_", time, '.xlsx',sep=''));
  saveWorkbook(outwb, fileName);

  fileName;
}