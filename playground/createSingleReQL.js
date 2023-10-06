async function fetchLatestDataForDevice(site, device, partNumber, partType) {
    // Here, partType can be 'sensor' or 'actuator' and partNumber is the associated ID.
  
    let filterCondition = {
        site: site,
        device: device
    };
  
    filterCondition[partType] = partNumber;  // This dynamically adds either 'sensor' or 'actuator' to the filter condition
  
    return await r.table(service_id)
                  .orderBy(r.desc('timestamp'))
                  .filter(filterCondition)
                  .limit(1)
                  .coerceTo('array');
  }
  
  
    function evaluateSingleCondition(data, condition) {
      switch (condition.operand) {
          case "eq":
              return data.value === condition.value;
          case "ne":
              return data.value !== condition.value;
          case "lte":
              return data.value <= condition.value;
          case "lt":
              return data.value < condition.value;
          case "gte":
              return data.value >= condition.value;
          case "gt":
              return data.value > condition.value;
          default:
              return false;
      }
  }
  
  
  async function evaluateAllConditions(conditions) {
    let results = [];
  
    for (let condition of conditions) {
      const latestData = await fetchLatestDataForDevice(condition.site, condition.device, condition[condition.part], condition.part);
  
        
        if (latestData && latestData.length > 0) {
            const evaluation = evaluateSingleCondition(latestData[0], condition);
            results.push(evaluation);
        } else {
            results.push(false);
        }
    }
  
    // Combining results based on logical conditions
    let finalResult = results[0];
    for (let i = 1; i < conditions.length; i++) {
        if (conditions[i].logical === "AND") {
            finalResult = finalResult && results[i];
        } else if (conditions[i].logical === "OR") {
            finalResult = finalResult || results[i];
        }
    }
  
    return finalResult;
  }
  
  try {
    const result = await evaluateAllConditions(conditionsTable);
    console.log(result);  // true if all conditions are met, false otherwise
    res.status(200).send({result: result});
  } catch (err) {
    console.error("Error evaluating conditions:", err);
    res.status(500).send({error: "Failed to evaluate conditions"});
  }
  