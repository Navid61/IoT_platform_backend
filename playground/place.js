await Account.find({username:req.user.username},async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result.length!==0){

   
        
        if(result[0].role!=='owner'){

         
            await Users.find({username:req.user.username},async(err,result)=>{

                if(err){
                    throw new Error(err)
                }
        
                if(result.length!==0){
        
           
        
                    for (let i=0;i<result.length;i++){
        
                        serviceList.push(result[i].service_id)
                        
                    }
                  
                 
                    
                 
                    

        
                    
        
                }
        
        
            
        
            }).clone()
                .catch(function (err) {
                  console.log(err)
                })

               


                for (let j=0;j<serviceList.length;j++){
                      

                      
                    await Service.find({service_id:serviceList[j]},async(err,result)=>{
                        if(err){
                            throw new Error(err)
                        }
    
                        if(result.length!==0){

                            console.log('result---> ', result)

                          if(result[j]){
                            console.log('result in pacename ', result[j].place)
                          }
                            
                                // placeName.push({name:result[j].place,service_id:serviceList[j]})
                            
                          
                           
                        }
    
                    }).clone()
            .catch(function (err) {
              console.log(err)
            })

                
          
            }

            console.log('  placeName ',   placeName)


        

         

           
                res.status(200).json({
                    status:200,
                    place:placeName
    
                })

        }else {


            await Users.find({username:req.user.username},async(err,result)=>{

                if(err){
                    throw new Error(err)
                }
        
                if(result.length!==0){

                    console.log('result ', result)

                    for(let i=0;i<result.length;i++){
                        notOwnerServices.push(result[i].service_id)
                    }

                    if(notOwnerServices){

                        console.log(' notOwnerServices ',  notOwnerServices)
                        for(let i=0;i<notOwnerServices.length;i++){
                            await Service.find({service_id:notOwnerServices[i]},async(err,result)=>{
                                if(err){
                                    throw new Error(err)
                                }

                                if(result.length!==0){

                                    for(let i=0;i<result.length;i++){
                                        notOwnerServicesList.push({name:result[i].place,service_id:result[i].service_id})
                                    }

                                   

                                   

                                    

                                }

                            }).clone()
                .catch(function (err) {
                  console.log(err)
                })
                        }

                        console.log('notOwnerServicesList ', notOwnerServicesList)

                        if(notOwnerServicesList){

                           
                            await Service.find({owner:req.user.username},async(err,result)=>{
                                if(err){
                                    throw new Error(err)
                                }
                
                                if(result.length!==0){
            
                                   
                                 
                
                                    for(let m=0;m<result.length;m++){
                                        ownerPlaceList.push({name:result[m].place,service_id:result[m].service_id})
                
                                    }
                                    console.log('ownerPlaceList===> ', ownerPlaceList)
              
                                    console.log('notOwnerServicesList ', notOwnerServicesList)

                                    const entireServices = ownerPlaceList.concat(notOwnerServicesList)
                                    
                                        res.status(200).json({
                                            status:200,
                                            place:entireServices
                            
                                        })
                         
                
                
                
                
                
                                }
                
                            }).clone()
                    .catch(function (err) {
                      console.log(err)
                    })
                           
                        }
                    }

                    
                    
                }else{

                    await Service.find({owner:req.user.username},async(err,result)=>{
                        if(err){
                            throw new Error(err)
                        }
        
                        if(result.length!==0){
    
                           
                         
        
                            for(let m=0;m<result.length;m++){
                                ownerPlaceList.push({name:result[m].place,service_id:result[m].service_id})
        
                            }
                            console.log('ownerPlaceList ', ownerPlaceList)
      
        
                            if(result.length===ownerPlaceList.length){
                                res.status(200).json({
                                    status:200,
                                    place:ownerPlaceList
                    
                                })
                            }
        
        
        
        
        
                        }
        
                    }).clone()
            .catch(function (err) {
              console.log(err)
            })

                }

             

           

            }).clone()
            .catch(function (err) {
              console.log(err)
            })

      
           
        }
    }

}).clone().catch(function (err) {console.log(err)})

