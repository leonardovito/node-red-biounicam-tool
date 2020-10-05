############## DOT NOTATION#######
getDotNotaion<-function(path, df, max){
  n<-nrow(df)
  # codice struttura secondaria
  #path <- "/Users/leonardovito/Desktop/Repository/sc.dot"
  dfs <- data.frame(matrix(ncol = 3, nrow = 0))
  names <- c("contig","dotnotation","energy")
  colnames(dfs) <- names
  conn <- file(path,open="r")
  lines <- readLines(conn)
  j<-0
  dotnotation<-""
  J<-0
  k=0
  for (i in 1:length(lines)){
    if(k>=max)  
    {
      m2 <- merge(df, dfs, by.x = "contig", by.y = "contig")
      close(conn)
      return(m2)
    }
    if(j==1000)
    {
      j<-0
      
    }
    j<-j+1
    if(startsWith(lines[i],">")){
      k<-k+1
      
      ct<-gsub(">", "", lines[i])
     # ct_short <-substr(0,length(ct)-1)
    #  ct_plus <- paste(ct_short,"+")
     # ct_menus <-paste(ct_short,"-")
      if(trim(ct) %in% trim(df$contig)){
        contig<-ct
      }else{
        contig<-NULL
      }
      
    }
    else if((startsWith(lines[i],".") || startsWith(lines[i],"(")) && !is.null(contig)){
      if(grepl("\\s",lines[i])){
        dbn<-unlist(strsplit(lines[i], " "))
        dotnotation<-NULL
        dotnotation<-dbn[1]
        energy<-substr(dbn[3],1,5)
        dfs[nrow(dfs) + 1,] <- c(contig, dotnotation,energy)
       # print(dfs[nrow(dfs),])
        }else{
        dotnotation<-paste0(dotnotation,lines[i])
      }
    } 
  }
  
  # for(i in 1:nrow(df)) {
  #     contig<-df[i,1]
  #     #contig<-substr(contigL, 1, nchar(contigL)-1)
  #     #print(contig)
  #     
  #     #print(dfs$contig)
  #     
  #     index<-which(startsWith(str_trim(dfs$contig),str_trim(contig)))
  #   # print( str_trim(dfs$contig))
  #   # print( str_trim(contig))
  #     
  #   #  print(index)
  #     if(length(index)>0){
  #   #  print(paste("IDEZ ",dfs$dotnotation[index]))
  #     dbn<-dfs$dotnotation[index]
  #     #print(dbn)
  #     df$dotnotation[i]<-dbn
  #     }else print(contig) 
  #   }
    # do stuff with row
  close(conn)
  
  m2 <- merge(df, dfs, by.x = "contig", by.y = "contig")
  return(m2)
}
  #######################

