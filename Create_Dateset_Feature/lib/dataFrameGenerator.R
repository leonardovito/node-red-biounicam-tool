library("stringr")
library("seqinr")
library("entropy")
library("Biostrings")
library('nonlinearTseries')
library("TSEntropies")
library("R6")
library("rDNAse")
library("writexl")
library("LncFinder")
library("openxlsx") # Load on each new session
library("RRNA")
library("RNAstructureModuleMiner")

#source("/Users/leonardovito/Documents/PhD/code/IntroDetection/Features.R")
source("Features.R")

#source("/Users/leonardovito/Documents/PhD/code/IntroDetection/dotnotation.R")
#source("/Users/leonardovito/Documents/PhD/code/IntroDetection/Features.R")
source("dotnotation.R")

#  Read Fasta file
#dna <- readDNAStringSet("/Users/leonardovito/Desktop/ESPERIMENTOINTRONI/File/exon-limit/intornsPlusMinus.fasta")
#dna <- readDNAStringSet("/Users/leonardovito/Desktop/Repository/annotatedIntron.fasta")
#dna <- readDNAStringSet("/Users/leonardovito/Desktop/Repository/annotatedIntronNostro.fasta")
# Cuff
#dnaR <- readDNAStringSet("/Users/leonardovito/Desktop/Step2/cuffDatasetIR.fasta")
args <- commandArgs(trailingOnly = TRUE)
if (length(args)==0) {
  stop("{\"process\":\"no imput parmas\"}")
} else if (length(args)>1) {
  # default output file
  #print("ENTRA")
  #print(args[1])
  rintronFasta = args[1]
  nintronFasta = args[2]
  tintronDot = args[3]
  nintronDot = args[4]
  path =args[5]
}

#dnaR <- readDNAStringSet("/Users/leonardovito/Documents/ESPERIMENTOFINALE/FASTAINTRONI/RintronPM.fasta")
#dnaN <- readDNAStringSet("/Users/leonardovito/Documents/ESPERIMENTOFINALE/FASTAINTRONI/NintronPM.fasta")
dnaR <- readDNAStringSet(rintronFasta)
dnaN <- readDNAStringSet(nintronFasta)


# Cuff
#dnaR <- readDNAStringSet("/Users/leonardovito/Desktop/Bioscience-Uncam-tools/result/CuffdatasetIR.fasta")
#dnaN <- readDNAStringSet("/Users/leonardovito/Desktop/Bioscience-Uncam-tools/result/CuffdatasetNR.fasta")

contig = names(dnaR)
sequence = paste(dnaR)
dnaR<-NULL

dfDnaR <- data.frame(contig, sequence)
#dfDnaR[,"dotnotation"] <- NA
#print(sum(is.na(dfDnaR$sequence)))
#source("/Users/leonardovito/Documents/Documenti\ Univerità/IntroDetection/dotnotation.R")
nR<-nrow(dfDnaR)

dfDnaR<-getDotNotaion(tintronDot,dfDnaR, nR)



contig = names(dnaN)
sequence = paste(dnaN)
dnaN<-NULL
dfDnaN <- data.frame(contig, sequence)
#dfDnaN[,"dotnotation"] <- NA

#dfDnaN<-getDotNotaion("/Users/leonardovito/Desktop/Step3/cuffDataSetNr.doc",dfDnaN)

dfName <- c("conting", "type", "start", "stop","strand","s_p_NCF", "ML","MM","laplace",
            "ApEn","Lev","SL","SsLev","SSfeatures")

q <- Features$new()
df<-NULL
#dnar<-subset(dna, grepl("r", dna$conting))
#dnan<-subset(dna, grepl("n", dna$conting))
dnans<-getDotNotaion(nintronDot,dfDnaN,nR )
#dnansV<-dnans[sample(nrow(dnans), nR), ]

#dfDnaN<-NULL

dnaSample<-rbind(dfDnaR, dnans) 
dnans<-NULL
dfDnaR<-NULL
dnaSample$sequence<-as.character(dnaSample$sequence)
k<-c(2,3,4,5)
q$setKmer(k,FALSE)

print(nrow(dnaSample))
half<-nrow(dnaSample) %/% 2
#print(half)
minIntronLength<-min(nchar(dnaSample$sequence))
dnaSample1<-dnaSample[1:half,]
source("/Users/leonardovito/Documents/PhD/code/IntroDetection/Features.R")

df1<-q$getFeatures(dfName,dnaSample1,minIntronLength)
fileOut1 <- paste0(path,"/dateset_1-xlsx", sep="")
print(paste0("frist file ",fileOut1,sep=""))
write.xlsx(df1, file = fileOut1)
df1<-NULL



dnaSample2<-dnaSample[half:nrow(dnaSample),]
q<-NULL
q <- Features$new()
k<-c(2,3,4,5)
q$setKmer(k,FALSE)
print(length(dnaSample2))

df2<-q$getFeatures(dfName,dnaSample2)
fileOut2 <- paste0(path,"/dateset_2-xlsx",sep="")
print(paste("second file ",fileOut2))

write.xlsx(df2, file = fileOut2)
print("end Process")