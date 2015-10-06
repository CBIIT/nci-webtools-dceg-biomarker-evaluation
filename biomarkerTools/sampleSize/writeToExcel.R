library('xlsx');

excelDirectory <- "./tmp/";

writeResultsToExcel <- function (tabs, allData, imgList, calcType) {
  outwb <- createWorkbook();
  
  bottomBorder <-  Border(color="black", position=c("BOTTOM"), pen=c("BORDER_THIN"));
  rightBorder <-   Border(color="black", position=c("RIGHT"), pen=c("BORDER_THIN"));
  
  # cellStyleBlue <-  CellStyle(outwb) +  Font(outwb, heightInPoints=11, isBold=TRUE, name="Calibri", color="black") + 
  #                   Fill(backgroundColor="cornflowerblue", foregroundColor="cornflowerblue", pattern="SOLID_FOREGROUND") +
  #                   bottomBorder +
  #                   Alignment(h="ALIGN_CENTER");
  
  cellStyleGray <- CellStyle(outwb) +  Font(outwb, heightInPoints=11, isBold=TRUE, name="Calibri", color="black") + 
                    Fill(backgroundColor="#525252", foregroundColor="gray", pattern="SOLID_FOREGROUND") +
                    Alignment(h="ALIGN_CENTER");
  
  cellStyleGrayBorder <- CellStyle(outwb) +  Font(outwb, heightInPoints=11, isBold=TRUE, name="Calibri", color="black") + 
                          Fill(backgroundColor="#525252", foregroundColor="gray", pattern="SOLID_FOREGROUND") +
                          bottomBorder + Alignment(h="ALIGN_CENTER");
  
  cellStyleGrayRightBorder  <-CellStyle(outwb) +  Font(outwb, heightInPoints=11, isBold=TRUE, name="Calibri", color="black") + 
                              Fill(backgroundColor="#525252", foregroundColor="gray", pattern="SOLID_FOREGROUND") +
                              rightBorder + Alignment(h="ALIGN_CENTER");
  
  cellStyleRightBorder  <-CellStyle(outwb) + rightBorder;
  
  startingRow <- 20;
  
  for(n in 1:length(tabs)) {
    PPVTableData <- allData[[n]]$PPVData
    cNPVTableData <- allData[[n]]$cNPVData
    
    startcol <- ncol(PPVTableData) + ncol(cNPVTableData)
    
    curSheet <- createSheet(outwb, sheetName = tabs[[n]])
    
    leftImage <- imgList[[2 * n - 1]]
    rightImage <- imgList[[2 * n]]
    
    addDataFrame(x = as.data.frame.matrix(PPVTableData), sheet = curSheet, startRow = startingRow, row.names = F)
    addDataFrame(x = as.data.frame.matrix(cNPVTableData), sheet = curSheet, startRow = startingRow, startColumn = startcol, row.names = F )
    
#     row <- getRows(curSheet, rowIndex = startingRow)
#     cells <- getCells(row)
#     
#     setCellStyle(cells, cellStyle = cellStyleGray)
    
#     setColumnWidth(curSheet, 1, startingRow)
#     setColumnWidth(curSheet, startcol, startingRow)
    
    autoSizeColumn(curSheet, 1:ncol(x = as.data.frame.matrix(PPVTableData)))
    autoSizeColumn(curSheet, startcol:startcol + ncol(x = as.data.frame.matrix(cNPVTableData)))
    
    addPicture(leftImage, curSheet, scale = .75, startRow = 1, startColumn = 1)
    addPicture(rightImage, curSheet, scale = .75, startRow = 1, startColumn = startcol)
    
  }
  
  # formatting time to use in filename
  time <- gsub(":","",gsub("-","",gsub(" ","", Sys.time() , fixed=TRUE)));
  
  fileName <- toString(paste(excelDirectory, "sample_size_calculation_",calcType,"_", time, '.xlsx',sep=''));
  
  saveWorkbook(outwb, fileName);

  fileName;
}