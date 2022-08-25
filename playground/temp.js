if(result){
    if(result.length!==0){
      console.log('result ', result[0])
    }else{

      if(result[0].rule.length===0){
        (async()=>{
          await filterBoardDB.collection("filterrules").insertOne({service_id:service_id,rule:[rule]})
        })()

      }else{
        (async()=>{
          await FilterRule.find({service_id:service_id,{$elemMatch:{rule:{sensors:rule.sensors,users:rule.users}}}})

        })()
        (async()=>{
          await filterBoardDB.collection("filterrules").updateOne({service_id:service_id},{$push:{rule:rule}})
        })()

      }

     
     
      

    }

  }




  rule:{$elemMatch:{sensors:rule.sensors,users:rule.users}}