library('xlsx');

excelDirectory <- "./tmp/";

writeResultsToExcel <- function (tabs, allData, imgList) {
  outwb <- createWorkbook();
  
  
  bottomBorder <-  Border(color="black", position=c("BOTTOM"), pen=c("BORDER_THIN"));
  rightBorder <-   Border(color="black", position=c("RIGHT"), pen=c("BORDER_THIN"));
  
  cellStyleLav <- CellStyle(outwb) +  Font(outwb, heightInPoints=11, isBold=TRUE, name="Calibri", color="black") + 
                  Fill(backgroundColor="lavender", foregroundColor="lavender", pattern="SOLID_FOREGROUND") +
                  bottomBorder +
                  Alignment(h="ALIGN_CENTER");
  
  # cellStyleBlue <-  CellStyle(outwb) +  Font(outwb, heightInPoints=11, isBold=TRUE, name="Calibri", color="black") + 
  #                   Fill(backgroundColor="cornflowerblue", foregroundColor="cornflowerblue", pattern="SOLID_FOREGROUND") +
  #                   bottomBorder +
  #                   Alignment(h="ALIGN_CENTER");
  
  # cellStyleOrange <-  CellStyle(outwb) +  Font(outwb, heightInPoints=11, isBold=TRUE, name="Calibri", color="black") + 
  #                     Fill(backgroundColor="orange", foregroundColor="orange", pattern="SOLID_FOREGROUND") +
  #                     bottomBorder +
  #                     Alignment(h="ALIGN_CENTER");
  
  # cellStylePink <-  CellStyle(outwb) +  Font(outwb, heightInPoints=11, isBold=TRUE, name="Calibri", color="black") + 
  #                   Fill(backgroundColor="pink", foregroundColor="pink", pattern="SOLID_FOREGROUND") +
  #                   bottomBorder +
  #                   Alignment(h="ALIGN_CENTER");
  
  cellStyleGray <- CellStyle(outwb) +  Font(outwb, heightInPoints=11, isBold=TRUE, name="Calibri", color="black") + 
                    Fill(backgroundColor="#525252", foregroundColor="gray", pattern="SOLID_FOREGROUND") +
                    Alignment(h="ALIGN_CENTER");
  
  cellStyleGrayBorder <- CellStyle(outwb) +  Font(outwb, heightInPoints=11, isBold=TRUE, name="Calibri", color="black") + 
                          Fill(backgroundColor="#525252", foregroundColor="gray", pattern="SOLID_FOREGROUND") +
                          bottomBorder +
                          Alignment(h="ALIGN_CENTER");
  
  cellStyleGrayRightBorder  <-CellStyle(outwb) +  Font(outwb, heightInPoints=11, isBold=TRUE, name="Calibri", color="black") + 
                              Fill(backgroundColor="#525252", foregroundColor="gray", pattern="SOLID_FOREGROUND") +
                              rightBorder +
                              Alignment(h="ALIGN_CENTER");
  
  cellStyleRightBorder  <-CellStyle(outwb) + rightBorder;
  
  startingRow <- 17;
  for (n in 1:length(tabs)) {
    PPVTableData <- allData[[n]]$PPVData
    cNPVTableData <- allData[[n]]$cNPVData
    
    startcol = ncol(PPVTableData) + ncol(cNPVTableData)
    
    curSheet <- createSheet(outwb, sheetName = tabs[[n]])
    
    leftImage <- imgList[[2 * n - 1]]
    rightImage <- imgList[[2 * n]]
    
    addDataFrame(x = as.data.frame.matrix(PPVTableData), sheet = curSheet, startRow = startingRow, row.names = F)
    addDataFrame(x = as.data.frame.matrix(cNPVTableData), sheet = curSheet, startRow = startingRow, startColumn = startcol, row.names = F )
    
    autoSizeColumn(curSheet, 1:ncol(x = as.data.frame.matrix(PPVTableData)))
    autoSizeColumn(curSheet, 1:ncol(x = as.data.frame.matrix(cNPVTableData)))
    
    addPicture(leftImage, curSheet, scale = .6, startRow = 1, startColumn = 1)
    addPicture(rightImage, curSheet, scale = .6, startRow = 1, startColumn = startcol)
    
    setColumnWidth(curSheet, 1, 20)
    setColumnWidth(curSheet, startcol, 20)
    
  }

  #fileName <- paste(excelDirectory, "sample-size-", time, '.xlsx',sep='');
  
  fileName <- "./tmp/sample.xlsx"
  saveWorkbook(outwb, fileName);

  fileName;
  
}