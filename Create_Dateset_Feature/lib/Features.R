library("RRNA")
library("R6")
library("sjmisc")
library(RNAstructureModuleMiner)
FeaturesSS <- R6Class("FeaturesSS", 
                      private = list(
                        getStValue=function(startPos,weight,nucleotides,seqLength){
                          (startPos/seqLength)+weight+length(nucleotides)/seqLength
                        }
                      ),
                      public=list(
                        getSSFeatures = function(dotBracketNotation, rnaSeq, pStemV,pIntLoopV,pMBLoopV,pHairPinV) {
                          #features<- c(HP_num,HP_avg,HP_val,ST_num,ST_avg,ST_val,IL_num,IL_avg,IL_val,MBL_num,MBL_avg,MBL_val) 
                            features<-NULL
                          pStem<-pStemV
                          pHairPin<-pHairPinV
                          pIntLoop<-pIntLoopV
                          pMBLoop<-pMBLoopV
                          dotBracketNotation<-dotBracketNotation
                          N<-nchar(dotBracketNotation)
                          ct=makeCt(dotBracketNotation,"")
                          c1<-ct$pos
                          c2<-ct$seq
                          c3<-ct$before
                          c4<-ct$after
                          c5<-ct$bound
                          c6<-ct$pos
                          data <- matrix(c(c1,c2,c3,c4,c5,c6),byrow=FALSE,ncol =6)
                          
                          #HAIRPIN LOOP
                          hrairpin_tolal_lenght<-0
                          hrairpin_tolal_averange<-0
                          hairpin_loop_LIST=hairpin_loop(data)
                          hairpin_value<-0
                          hairpin_number<-0
                          if(length(hairpin_loop_LIST)>0){
                            for(i in hairpin_loop_LIST) {
                              hrairpin_tolal_lenght<-hrairpin_tolal_lenght+length(i)
                              pos<-i[1]
                              hairpin_value<-hairpin_value + private$getStValue(pos, pHairPin,i, N)
                            }
                            hairpin_number<-length(hairpin_loop_LIST )
                            hrairpin_tolal_averange<-hrairpin_tolal_lenght/length(hairpin_loop_LIST)
                          }
                          HP_num<-c(HP_num=hairpin_number)
                          HP_avg<-c(HP_avg=hrairpin_tolal_averange)
                          HP_val<-c(HP_val=hairpin_value)
                          features<-c(features,HP_num)
                          features<-c(features,HP_avg)
                          features<-c(features,HP_val)
                          #STEAM 
                          stem_tolal_lenght<-0
                          stem_tolal_averange<-0
                          stem_number<-0
                          stem_value<-0
                          stem_LIST=stem(data)
                          if(length(stem_LIST)>0){
                            for(i in stem_LIST) {
                              pos<-i[1]
                              stem_value<-stem_value + private$getStValue(pos, pStem,i, N)
                              stem_tolal_lenght<-stem_tolal_averange+length(i)
                              
                            }
                            stem_number<-length(stem_LIST)
                            stem_tolal_averange<-stem_tolal_lenght/stem_number
                          }
                          ST_num<-c(ST_num=stem_number)
                          ST_avg<-c(ST_avg=stem_tolal_averange)
                          ST_val<-c(ST_val=stem_value)
                          features<-c(features,ST_num)
                          features<-c(features,ST_avg)
                          features<-c(features,ST_val)
                          #INTERNAL LOOP
                          internal_loop_tolal_lenght<-0
                          internal_loop_tolal_averange<-0
                          internal_loop_tolal_number<-0
                          internal_loop_tolal_value<-0
                          internal_loop_LIST<-internal_loop(data)
                          if(length(internal_loop_LIST)>0){
                            internal_loop_LIST=internal_loop(data)
                            for(i in internal_loop_LIST) {
                              pos<-i[1]
                              internal_loop_tolal_value<-internal_loop_tolal_value + private$getStValue(pos, pIntLoop,i, N)
                              internal_loop_tolal_lenght<-internal_loop_tolal_lenght+length(i)
                            }
                            internal_loop_tolal_number<-length(internal_loop_LIST)
                            internal_loop_tolal_averange<-internal_loop_tolal_lenght/internal_loop_tolal_number
                          }
                          IL_num<-c(IL_num=internal_loop_tolal_number)
                          IL_avg<-c(IL_avg=internal_loop_tolal_averange)
                          IL_val<-c(IL_val=internal_loop_tolal_value)
                          features<-c(features,IL_num)
                          features<-c(features,IL_avg)
                          features<-c(features,IL_val)
                          #INTERNAL LOOP
                          multi_branch_tolal_lenght<-0
                          multi_branch_tolal_averange<-0
                          multi_branch_loop_value<-0
                          multi_branch_loop_number<-0
                         if(str_contains(dotBracketNotation, c(".", "(",")"), logic = "and")){
                          multi_branch_loop_LIST=multi_branch_loop(data)
                          if(length(multi_branch_loop_LIST)>0){
                            for(i in multi_branch_loop_LIST) {
                               pos<-i[1]
                              multi_branch_loop_value<-multi_branch_loop_value + private$getStValue(pos, pMBLoop,i, N)
                              multi_branch_tolal_lenght<-multi_branch_tolal_lenght+length(i)
                            }
                            multi_branch_loop_number<-length(multi_branch_loop_LIST)
                            multi_branch_tolal_averange<-multi_branch_tolal_lenght/multi_branch_loop_number
                          }
                          }
                            MBL_num<-c(MBL_num=multi_branch_loop_number)
                            MBL_avg<-c(MBL_avg=multi_branch_tolal_averange)
                            MBL_val<-c(MBL_val=multi_branch_loop_value)
                            features<-c(features,MBL_num)
                            features<-c(features,MBL_avg)
                            features<-c(features,MBL_val) 
                          return(features)
                        }
                      )
)


Features <- R6Class("Features", 
                    public=list(
                      k=NULL,
                      reverse=FALSE,
                      combination=NULL,
                      setKmer = function(k,reverse){
                        self$k<-k
                        self$reverse<-reverse
                      },
                      getFeatures = function(infoColumns,dna, minIntronLength) {
                        #self$headerTable<-headerTable

                        df<-private$calcolaFeatures(infoColumns, dna)
                        #df<-private$cellinFeatures(df)
                        
                        return(df)
                      }
                      
                      )
                    ,
                    private = list(
                      # minIntroLength = function(dna){
                      #   minIntronLength<-min(nchar(dna$sequence))
                      # },
                      # maxIntroLength = function(dna){
                      #   maxIntroLength<-max(nchar(dna$sequence))
                      # },
                      avgIntroLength = function(dna){
                        avgIntroLength<-mean(nchar(dna$sequence))
                      },
                      
                      seg_probalistc = function(seq,nc1,nc2,minIntronLength){
                         startLast = (ceiling(nchar(seq)/minIntronLength)-1)*minIntronLength
                         m<-ceiling(nchar(seq)/minIntronLength)
                        last<-substr(seq, startLast+1, nchar(seq))
                        section<-regmatches(seq, gregexpr(paste0(".{",minIntronLength,"}"), seq))[[1]]
                        section<-c(section,c(last))
                        n1<-str_count(section, nc1)
                        n2<-str_count(section, nc2)
                        p1<- n1/minIntronLength
                        p2<-n2/minIntronLength
                        diff_p1_p2<-abs(p1-p2)
                        return(1/m*sum(diff_p1_p2))
                      },
                      seq2Numeric = function(sequence){
                        seq1<-str_replace_all(sequence,"T","1")
                        seq2<-str_replace_all(seq1,"G","2")
                        seq3<-str_replace_all(seq2,"A","3")
                        seq4<-str_replace_all(seq3,"C","4")
                        seq5<-str_replace_all(seq4,"N","5")
                        return(seq5)
                      },
                     
                     
                       
                       
                       

                      lempel.ziv2=function(str, str.alphabet) {
                        s2=strsplit(str,"")
                        alphabet=strsplit(str.alphabet,"")
                        if (length(alphabet) ==1) { 
                          inc.alphabet = 1 
                        }
                        else { 
                          if (length(alphabet) != length(s2)) 
                          { 
                            stop("Number of Strings and alphabets aren't the same.") 
                          }
                          else 
                          { 
                            inc.alphabet=0 
                          }
                        }
                        index.alphabet = 1 
                        lzs=c()
                        for (s in s2) {        
                          lzs=c(lzs, private$lempel.ziv(s, alphabet[[1]])[length(s)])
                          index.alphabet=index.alphabet+inc.alphabet
                        }
                        return(lzs)
                      },
                      lempel.ziv=function(s, alphabet) {
                        n=sum(!is.na(s))
                        s=s[!is.na(s)]
                        if (sum(s %in% alphabet)!= n) { stop("Alphabet error!") }
                        voc=s[1]; 
                        cmpl=1
                        r=1; 
                        i=1; 
                        while (r+i<=n) {
                          Q="";
                          repeat {
                            Q=paste(Q,s[r+i], sep="")
                            if (Q %in% voc) {
                              cmpl[r+i]=cmpl[r+i-1]; i=i+1; }
                            if(!(Q %in% voc) | !(r+i<=n)) { break }
                          } # repeat
                          if (r+i > n) break;
                          voc=c(voc, Q); 
                          cmpl[r+i]=cmpl[r+i-1]+1;
                          r=r+i; i=1; 
                        }
                        cmpl=cmpl/(1:n/log(1:n,length(alphabet)))
                        return(cmpl)
                      },
                      calcolaFeatures = function(infoColumns, dna){
                        d<-0
                        step<-0
                        fristKmer<-TRUE
                        if('s_p_NCF' %in% infoColumns){
                         # minIntronLength <- private$minIntroLength(dna)
                         # maxIntroLength <- private$maxIntroLength(dna)
                          avgIntroLength <- private$avgIntroLength(dna)
          # print(paste("Min Intron l ", minIntronLength))
          # print(paste("Min Intron l ", maxIntroLength))
           
          # print(paste("Mean Intron l ", avgIntroLength))
                        }
                        j<-1
                        step<-0
                        #for(i in 1:2) { 
                        for(i in 1:nrow(dna)) { 
                          if(j==100){
                            step<-step+j
                            j<-0
                            
                          }
                          j<-j+1
                          conting<-dna[i,1]
                          conting<-paste(dna[i,1],"")
                          l<-strsplit(conting, " ")
                          a<-unlist(l)
                          Id<-c(id=a[1])
                          Type<-c(type=a[2])
                          Start<-c(start=a[3])
                          Stop<-c(stop=a[4])
                          Strand<-c(strand=a[5])
                          #seqDna<-dna[i,2]
                          features <-c(Id,Type,Start,Stop,Strand) 
                          #row<-append(row,seqDna,length(row))
                          # Calcolo ML
                          seqDna<-dna[i,2]
                          if('s_p_NCF' %in% infoColumns){
                            pPhiAG<-private$seg_probalistc(seqDna,"A","G",minIntronLength)
                            PhiAG<-c(PhiAG=pPhiAG)
                            features<-c(features,PhiAG)
                            pPhiAC<-private$seg_probalistc(seqDna,"A","C",minIntronLength)
                            PhiAC<-c(PhiAC=pPhiAC)
                            features<-c(features,PhiAC)
                            pPhiAT<-private$seg_probalistc(seqDna,"A","T",minIntronLength)
                            PhiAT<-c(PhiAT=pPhiAT)
                            features<-c(features,PhiAT)
                            pPhiGC<-private$seg_probalistc(seqDna,"G","C",minIntronLength)
                            PhiGC<-c(PhiGC=pPhiGC)
                            features<-c(features,PhiGC)
                            pPhiGT<-private$seg_probalistc(seqDna,"G","T",minIntronLength)
                            PhiGT<-c(PhiGT=pPhiGT)
                            features<-c(features,PhiGT)
                            pPhiCT<-private$seg_probalistc(seqDna,"C","T",minIntronLength)
                            PhiCT<-c(PhiCT=pPhiCT)
                            features<-c(features,PhiCT)
                          }
                          seqNumber <-private$seq2Numeric(seqDna)
                          seqVector<-s2c(seqNumber)
                          seq<-as.numeric(seqVector)
                          if('ML' %in% infoColumns){
                            ml<-entropy(seq, method="ML")
                            ML<-c(ML=ml)
                            features<-c(features,ML)
                          }
                          if('MM' %in% infoColumns){
                            mm<-entropy(seq, method="MM")
                            MM<-c(MM=mm)
                            features<-c(features,MM)
                          }
                          if('laplace' %in% infoColumns){
                            lapl<-entropy(seq, method="Laplace")
                            laplace<-c(laplace=lapl)
                            features<-c(features,laplace)
                          }
                          
                          # if('sampEn' %in% infoColumns ||'ApEn' %in% infoColumns){
                          #   tau.ami<-tryCatch({
                          #   timeLag(seq, technique = "ami", 
                          #           lag.max = 100, do.plot = F)
                          # },
                          # error=function(cond) {
                          # },
                          # warning=function(cond) {
                          # }
                          # )
                          
                          # if(!is.null(tau.ami)){
                          #   emb.dim = tryCatch({
                          #     estimateEmbeddingDim(seq, time.lag = tau.ami,
                          #                          max.embedding.dim = 15, do.plot = F)
                          #   },
                          #   error=function(cond) {
                          #   },
                          #   warning=function(cond) {
                          #     return(NULL)
                          #   }
                          #   )
                          # }
                          # if(!is.null(emb.dim)){
                          #     if(emb.dim==0) 
                          #       emb.dim=2
                          #     if('sampEn' %in% infoColumns){
                          #       sampen<-SampEn_R(seq, dim = emb.dim, lag = tau.ami, r = 0.2 * sd(seq))
                          #       sampEn<-c(sampEn=sampen)
                          #       features<-c(features,sampEn)
                          #     }
                          #     if('ApEp' %in% infoColumns){
                          #       apen<-ApEn_R(seq, dim = 2, lag = 1, r = 0.2 * sd(seq))
                          #       apen<-c(ApEp=apen)
                          #       features<-c(features,apen)
                          #     }
                          # }
                          # }
                              if('Lev' %in% infoColumns){
                                alfabet<-"ACGT"
                                levComplexity<-private$lempel.ziv2(seqDna,alfabet)
                                lev<-c(Lev=levComplexity)
                                features<-c(features, lev)
                              }
                              if('SsLev' %in% infoColumns){
                                dotNot<-dna[i,3]
                                
                                alfabet<-".()"
                                levComplexity<-private$lempel.ziv2(dotNot,alfabet)
                                lev<-c(SsLev=levComplexity)
                                features<-c(features, lev)
                              }
                          if('SSfeatures' %in% infoColumns){
                            dotNot<-dna[i,3]
                            f <- FeaturesSS$new()
                            featuresS<-f$getSSFeatures(dotNot,"",5,7,13,11)
                            features<-c(features, featuresS)
                          }
                          
                              if('SL' %in% infoColumns){
                                  l<-length(seq)
                                  l<-c(SL=l)
                                  features<-c(features,l)
                              }
                              if(length(self$k)>0){
                                for(l in 1:length(self$k)){

                                if(i == 1){
                                  s<-as.character(seqDna)
                                  #s<- strsplit(seqDna, "")[[1]]
                                   kmerResult<-kmer(s, k = self$k[l])
                                   features<-c(features,kmerResult)
                                }else
                                {
                                  s<- strsplit(seqDna, "")[[1]]
                                  kmerResult<-kmer(seqDna, k = self$k[l])
                                  features<-c(features,kmerResult)
                                }
                              }
                              
                              if(i==1){
                                df <- data.frame(matrix(ncol = length(features), nrow = 0))
                                colnames(df)<-names(features)
                                df<-rbind(df,as.data.frame(t(features)))
                              }else{
                                df<-rbind(df, as.data.frame(t(features)))
                              }
                            }
                          
                          
                          
                         
                          }
                          #break
                        
                        return(df)
                      }
                    )
)


