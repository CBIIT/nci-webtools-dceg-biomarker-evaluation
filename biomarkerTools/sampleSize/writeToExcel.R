library('xlsx');

excelDirectory <- "./tmp/";

writeResultsToExcel <- function (graphName,sampSizeData) {
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
  
  for(n in 1:length(sampSizeData$Delta)) {
      deltaSheet <- createSheet(outwb, sheetName = "Delta " + x);
      addDataFrame(x = as.data.frame.matrix(sampSizeData$Delta), sheet = deltaSheet, row.names=TRUE, col.name=TRUE);
      autoSizeColumn(ppvSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$Delta)));
  }

#--------------
  rows   <- createRow(ppvSheet, 1:10)
  cells  <- createCell(rows, colIndex=1:10)       
  addMergedRegion(ppvSheet, startRow=1, endRow=1, startColumn=1, endColumn=9);
  setCellValue(cells[[1,1]], "Risk of Disease after a POSITIVE Test");
  setCellStyle(cells[[1,1]], cellStyleGray);
  
  addMergedRegion(ppvSheet, startRow=2, endRow=2, startColumn=1, endColumn=9);
  setCellValue(cells[[2,1]], "Positive Predicted Value (PPV)");
  setCellStyle(cells[[2,1]], cellStyleLav);
  
  addMergedRegion(ppvSheet, startRow=3, endRow=3, startColumn=1, endColumn=4);
  setCellValue(cells[[3,1]], "Sensitivity Given Specificity for Given Delta");
  setCellStyle(cells[[3,1]], cellStyleGrayRightBorder);
    
  addMergedRegion(ppvSheet, startRow=3, endRow=3, startColumn=5, endColumn=9);
  setCellValue(cells[[3,5]], "Disease Prevalence");
  setCellStyle(cells[[3,5]], cellStyleGray);
  
  addDataFrame(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`), sheet = ppvSheet, startRow=4, row.names=FALSE, col.name=TRUE);
  autoSizeColumn(ppvSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`)));
  setCellStyle(cells[[4,1]], cellStyleGray);
  setCellStyle(cells[[4,2]], cellStyleGray);
  setCellStyle(cells[[4,3]], cellStyleGray);
  setCellStyle(cells[[4,4]], cellStyleGrayRightBorder);

  setCellStyle(cells[[5,4]], cellStyleRightBorder);
  setCellStyle(cells[[6,4]], cellStyleRightBorder);
  setCellStyle(cells[[7,4]], cellStyleRightBorder);
  setCellStyle(cells[[8,4]], cellStyleRightBorder);
  setCellStyle(cells[[9,4]], cellStyleRightBorder);
  
  addDataFrame(x = as.data.frame.matrix(sampSizeData$PPV), sheet = ppvSheet, row.names=FALSE, col.name=TRUE, startRow=4, startColumn=5);
  autoSizeColumn(ppvSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$PPV)));
  setCellStyle(cells[[4,5]], cellStyleGray);
  setCellStyle(cells[[4,6]], cellStyleGray);
  setCellStyle(cells[[4,7]], cellStyleGray);
  setCellStyle(cells[[4,8]], cellStyleGray);
  setCellStyle(cells[[4,9]], cellStyleGray);

  #----------------
  
  rows   <- createRow(cNpvSheet, 1:10)              
  cells  <- createCell(rows, colIndex=1:10)       
  addMergedRegion(cNpvSheet, startRow=1, endRow=1, startColumn=1, endColumn=9);
  setCellValue(cells[[1,1]], "Risk of Disease after a NEGATIVE Test");
  setCellStyle(cells[[1,1]], cellStyleGray);
  
  addMergedRegion(cNpvSheet, startRow=2, endRow=2, startColumn=1, endColumn=9);
  setCellValue(cells[[2,1]], "Complement of the Negative Predicted Value (cNPV)");
  setCellStyle(cells[[2,1]], cellStyleBlue);
  
  addMergedRegion(cNpvSheet, startRow=3, endRow=3, startColumn=1, endColumn=4);
  setCellValue(cells[[3,1]], "Sensitivity Given Specificity for Given Delta");
  setCellStyle(cells[[3,1]], cellStyleGrayRightBorder);
  
  addMergedRegion(cNpvSheet, startRow=3, endRow=3, startColumn=5, endColumn=9);
  setCellValue(cells[[3,5]], "Disease Prevalence");
  setCellStyle(cells[[3,5]], cellStyleGray);  

  addDataFrame(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`), sheet = cNpvSheet, startRow=4, row.names=FALSE, col.name=TRUE);
  autoSizeColumn(cNpvSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`)));
  setCellStyle(cells[[4,1]], cellStyleGray);
  setCellStyle(cells[[4,2]], cellStyleGray);
  setCellStyle(cells[[4,3]], cellStyleGray);
  setCellStyle(cells[[4,4]], cellStyleGrayRightBorder);
  
  setCellStyle(cells[[5,4]], cellStyleRightBorder);
  setCellStyle(cells[[6,4]], cellStyleRightBorder);
  setCellStyle(cells[[7,4]], cellStyleRightBorder);
  setCellStyle(cells[[8,4]], cellStyleRightBorder);
  setCellStyle(cells[[9,4]], cellStyleRightBorder);

  addDataFrame(x = as.data.frame.matrix(sampSizeData$cNPV), sheet = cNpvSheet, startRow=4, startColumn=5, row.names=FALSE, col.name=TRUE);
  autoSizeColumn(cNpvSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$cNPV)));
  setCellStyle(cells[[4,5]], cellStyleGray);
  setCellStyle(cells[[4,6]], cellStyleGray);
  setCellStyle(cells[[4,7]], cellStyleGray);
  setCellStyle(cells[[4,8]], cellStyleGray);
  setCellStyle(cells[[4,9]], cellStyleGray);

  #---------------------------------------

  rows   <- createRow(ppvCnpvSheet, 1:10)              
  cells  <- createCell(rows, colIndex=1:10)       
  addMergedRegion(ppvCnpvSheet, startRow=1, endRow=1, startColumn=1, endColumn=9);
  setCellValue(cells[[1,1]], "Range of Risk after Test Results");
  setCellStyle(cells[[1,1]], cellStyleGray);
  
  addMergedRegion(ppvCnpvSheet, startRow=2, endRow=2, startColumn=1, endColumn=9);
  setCellValue(cells[[2,1]], "PPV-cNPV");
  setCellStyle(cells[[2,1]], cellStyleOrange);
  
  addMergedRegion(ppvCnpvSheet, startRow=3, endRow=3, startColumn=1, endColumn=4);
  setCellValue(cells[[3,1]], "Sensitivity Given Specificity for Given Delta");
  setCellStyle(cells[[3,1]], cellStyleGrayRightBorder);
  
  addMergedRegion(ppvCnpvSheet, startRow=3, endRow=3, startColumn=5, endColumn=9);
  setCellValue(cells[[3,5]], "Disease Prevalence");
  setCellStyle(cells[[3,5]], cellStyleGray);

  addDataFrame(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`), sheet = ppvCnpvSheet, startRow=4, row.names=FALSE, col.name=TRUE);
  autoSizeColumn(ppvCnpvSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`)));
  setCellStyle(cells[[4,1]], cellStyleGray);
  setCellStyle(cells[[4,2]], cellStyleGray);
  setCellStyle(cells[[4,3]], cellStyleGray);
  setCellStyle(cells[[4,4]], cellStyleGrayRightBorder);
  
  setCellStyle(cells[[5,4]], cellStyleRightBorder);
  setCellStyle(cells[[6,4]], cellStyleRightBorder);
  setCellStyle(cells[[7,4]], cellStyleRightBorder);
  setCellStyle(cells[[8,4]], cellStyleRightBorder);
  setCellStyle(cells[[9,4]], cellStyleRightBorder);
  
  addDataFrame(x = as.data.frame.matrix(sampSizeData$`PPV-cNPV`), sheet = ppvCnpvSheet, startRow=4, startColumn=5, row.names=FALSE, col.name=TRUE);
  autoSizeColumn(ppvCnpvSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$`PPV-cNPV`)));
  
  setCellStyle(cells[[4,5]], cellStyleGray);
  setCellStyle(cells[[4,6]], cellStyleGray);
  setCellStyle(cells[[4,7]], cellStyleGray);
  setCellStyle(cells[[4,8]], cellStyleGray);
  setCellStyle(cells[[4,9]], cellStyleGray);
  #-------------------------------------------

  rows   <- createRow(programBasedSheet, 1:10)              
  cells  <- createCell(rows, colIndex=1:10)       
  addMergedRegion(programBasedSheet, startRow=1, endRow=1, startColumn=1, endColumn=9);
  setCellValue(cells[[1,1]], "# of Cases per 1000 people screened");
  setCellStyle(cells[[1,1]], cellStyleGray);
  
  addMergedRegion(programBasedSheet, startRow=2, endRow=2, startColumn=1, endColumn=9);
  setCellValue(cells[[2,1]], "Program Based");
  setCellStyle(cells[[2,1]], cellStylePink);
  
  addMergedRegion(programBasedSheet, startRow=3, endRow=3, startColumn=1, endColumn=4);
  setCellValue(cells[[3,1]], "Sensitivity Given Specificity for Given Delta");
  setCellStyle(cells[[3,1]], cellStyleGrayRightBorder);
  
  addMergedRegion(programBasedSheet, startRow=3, endRow=3, startColumn=5, endColumn=9);
  setCellValue(cells[[3,5]], "Disease Prevalence");
  setCellStyle(cells[[3,5]], cellStyleGray);
  
  addDataFrame(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`), sheet = programBasedSheet, startRow=4, row.names=FALSE, col.name=TRUE);
  autoSizeColumn(programBasedSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`)));

  setCellStyle(cells[[4,1]], cellStyleGray);
  setCellStyle(cells[[4,2]], cellStyleGray);
  setCellStyle(cells[[4,3]], cellStyleGray);
  setCellStyle(cells[[4,4]], cellStyleGrayRightBorder);
  
  setCellStyle(cells[[5,4]], cellStyleRightBorder);
  setCellStyle(cells[[6,4]], cellStyleRightBorder);
  setCellStyle(cells[[7,4]], cellStyleRightBorder);
  setCellStyle(cells[[8,4]], cellStyleRightBorder);
  setCellStyle(cells[[9,4]], cellStyleRightBorder);

  addDataFrame(x = as.data.frame.matrix(sampSizeData$`Program-Based`), sheet = programBasedSheet, startRow=4, startColumn=5, row.names=FALSE, col.name=TRUE);
  autoSizeColumn(programBasedSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$`Program-Based`)));

  setCellStyle(cells[[4,5]], cellStyleGray);
  setCellStyle(cells[[4,6]], cellStyleGray);
  setCellStyle(cells[[4,7]], cellStyleGray);
  setCellStyle(cells[[4,8]], cellStyleGray);
  setCellStyle(cells[[4,9]], cellStyleGray);
  #---------------------------------------------

  rows   <- createRow(ppvBasedSheet, 1:10)              
  cells  <- createCell(rows, colIndex=1:10)       
  addMergedRegion(ppvBasedSheet, startRow=1, endRow=1, startColumn=1, endColumn=9);
  setCellValue(cells[[1,1]], "# of Cases Detected per 1000 Who are Screened Positive");
  setCellStyle(cells[[1,1]], cellStyleGray);
  
  addMergedRegion(ppvBasedSheet, startRow=2, endRow=2, startColumn=1, endColumn=9);
  setCellValue(cells[[2,1]], "Program Based");
  setCellStyle(cells[[2,1]], cellStyleGrayBorder);
  
  addMergedRegion(ppvBasedSheet, startRow=3, endRow=3, startColumn=1, endColumn=4);
  setCellValue(cells[[3,1]], "Sensitivity Given Specificity for Given Delta");
  setCellStyle(cells[[3,1]], cellStyleGrayRightBorder);
  
  addMergedRegion(ppvBasedSheet, startRow=3, endRow=3, startColumn=5, endColumn=9);
  setCellValue(cells[[3,5]], "Disease Prevalence");
  setCellStyle(cells[[3,5]], cellStyleGray);
  
  addDataFrame(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`), sheet = ppvBasedSheet, startRow=4, row.names=FALSE, col.name=TRUE);
  autoSizeColumn(ppvBasedSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`)));

  setCellStyle(cells[[4,1]], cellStyleGray);
  setCellStyle(cells[[4,2]], cellStyleGray);
  setCellStyle(cells[[4,3]], cellStyleGray);
  setCellStyle(cells[[4,4]], cellStyleGrayRightBorder);
  
  setCellStyle(cells[[5,4]], cellStyleRightBorder);
  setCellStyle(cells[[6,4]], cellStyleRightBorder);
  setCellStyle(cells[[7,4]], cellStyleRightBorder);
  setCellStyle(cells[[8,4]], cellStyleRightBorder);
  setCellStyle(cells[[9,4]], cellStyleRightBorder);

  addDataFrame(x = as.data.frame.matrix(sampSizeData$`PPV-Based`), sheet = ppvBasedSheet, row.names=FALSE, col.name=TRUE, startRow=4, startColumn=5);
  autoSizeColumn(ppvBasedSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$`PPV-Based`)));
  
  setCellStyle(cells[[4,5]], cellStyleGray);
  setCellStyle(cells[[4,6]], cellStyleGray);
  setCellStyle(cells[[4,7]], cellStyleGray);
  setCellStyle(cells[[4,8]], cellStyleGray);
  setCellStyle(cells[[4,9]], cellStyleGray);
  #---------------------------------------------

  rows   <- createRow(sensitivityBasedSheet, 1:10)              
  cells  <- createCell(rows, colIndex=1:10)       
  addMergedRegion(sensitivityBasedSheet, startRow=1, endRow=1, startColumn=1, endColumn=9);
  setCellValue(cells[[1,1]], "# of Cases Detected per 1000 With Disease");
  setCellStyle(cells[[1,1]], cellStyleGray);
  
  addMergedRegion(sensitivityBasedSheet, startRow=2, endRow=2, startColumn=1, endColumn=9);
  setCellValue(cells[[2,1]], "Sensitivity Based");
  setCellStyle(cells[[2,1]], cellStyleGrayBorder);
  
  addMergedRegion(sensitivityBasedSheet, startRow=3, endRow=3, startColumn=1, endColumn=4);
  setCellValue(cells[[3,1]], "Sensitivity Given Specificity for Given Delta");
  setCellStyle(cells[[3,1]], cellStyleGrayRightBorder);
  
  addMergedRegion(sensitivityBasedSheet, startRow=3, endRow=3, startColumn=5, endColumn=9);
  setCellValue(cells[[3,5]], "Disease Prevalence");
  setCellStyle(cells[[3,5]], cellStyleGray);

  addDataFrame(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`), sheet = sensitivityBasedSheet, startRow=4, row.names=FALSE, col.name=TRUE);
  autoSizeColumn(sensitivityBasedSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`)));

  setCellStyle(cells[[4,1]], cellStyleGray);
  setCellStyle(cells[[4,2]], cellStyleGray);
  setCellStyle(cells[[4,3]], cellStyleGray);
  setCellStyle(cells[[4,4]], cellStyleGrayRightBorder);
  
  setCellStyle(cells[[5,4]], cellStyleRightBorder);
  setCellStyle(cells[[6,4]], cellStyleRightBorder);
  setCellStyle(cells[[7,4]], cellStyleRightBorder);
  setCellStyle(cells[[8,4]], cellStyleRightBorder);
  setCellStyle(cells[[9,4]], cellStyleRightBorder);

  addDataFrame(x = as.data.frame.matrix(sampSizeData$`Sensitivity-Based`), sheet = sensitivityBasedSheet, row.names=FALSE, col.name=TRUE, startRow=4, startColumn=5);
  autoSizeColumn(sensitivityBasedSheet, 1:ncol(x = as.data.frame.matrix(sampSizeData$`Sensitivity-Based`)));

  setCellStyle(cells[[4,5]], cellStyleGray);
  setCellStyle(cells[[4,6]], cellStyleGray);
  setCellStyle(cells[[4,7]], cellStyleGray);
  setCellStyle(cells[[4,8]], cellStyleGray);
  setCellStyle(cells[[4,9]], cellStyleGray);
  
  #--------------------------------------------

  #addDataFrame(x = as.data.frame.matrix(sampSizeData$`Sensitivity Given Specificity`), sheet = dominatedSheet, startRow=4, row.names=FALSE, col.name=TRUE);
  #addDataFrame(x = as.data.frame.matrix(sampSizeData$`Dominated by Specificity for a Rare Disease`), sheet = dominatedSheet, row.names=FALSE, col.name=TRUE, startRow=4, startColumn=5);
  
  addPicture(graphName, deltaSheet, scale = .65, startRow = 1, startColumn = 6);

   time <- gsub(":","",gsub("-","",gsub(" ","", Sys.time() , fixed=TRUE)));

  fileName <- paste(excelDirectory, "means_to_risk_analysis_", time, '.xlsx',sep='');
  
  saveWorkbook(outwb, fileName);

  fileName;
}