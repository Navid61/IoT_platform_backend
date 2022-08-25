async function defineNewRule(){
    let view =(req.body.rule.view ==="true")
    let action=(req.body.rule.action==="true")
  
    const sensor_rule ={
      sensor_id:req.body.rule.sensor_id,
      view:view,
      action:action
    }
  
  
  
  // console.log('sensor_rule ', sensor_rule)
  const sensorIDList=[];
  
   const sensorInfo = await UserFilter.find({username:`${req.body.rule.email}`},async function(err,result){
      if(result.length > 0){
        
     return result[0]
  
        
        
      }
  
    }).clone().catch(function(err){ console.log(err)});
  
    if(sensorInfo){
      console.log('sensorInfo' ,sensorInfo)
     if(sensorInfo[0].sensor){
      for(let i=0;i<sensorInfo[0].sensor.length;i++){
       
        sensorIDList.push(sensorInfo[0].sensor[i].sensor_id)
        
          }
  
     }
    
    }
  
   console.log('sensorIDList ', sensorIDList)
   
   
  
    if(sensorIDList.includes(req.body.rule.sensor_id)){
  
      filterBoardDB.collection("userfilters").findOneAndUpdate({username:`${req.body.rule.email}`,sensor:{$elemMatch:{sensor_id:`${req.body.rule.sensor_id}`}}},{$set:{"sensor.$.view":view}})
      filterBoardDB.collection("userfilters").findOneAndUpdate({username:`${req.body.rule.email}`,sensor:{$elemMatch:{sensor_id:`${req.body.rule.sensor_id}`}}},{$set:{"sensor.$.action":action}})
      }else{
        console.log('new rule')
       filterBoardDB.collection("userfilters").findOneAndUpdate({username:`${req.body.rule.email}`},{$push:{sensor:sensor_rule}})
      }
    
  }
  
  
  
  
  //// RETURN RESULT OF ADD NEW RULES
  //// FIRST OF ALL CHECK USERS IS ADMIN OR NOT
  
  await Account.find({username:req.user.username},async(err,role)=>{
    if(err){
      throw Error({err:err})
    }
  
    if(role){
      if(role.length >0){
        if(role[0].role==='admin'){
  
          await defineNewRule().then(()=>{
            res.json({status:200})
          }).catch(error=>{
            console.log('error in new filter rule ', error)
            res.json({status:401})
          })
  
        }
      }
    }
  
      }).clone().catch(function(err){ console.log(err)});
  
  
  