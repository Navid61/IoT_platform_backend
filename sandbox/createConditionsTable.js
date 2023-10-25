 
/** try 1 
 const conditionsTable = [
    {
      "id": 1,
      "site": "parking",
      "device": "00001",
      "part": "actuator",
      "name": "vaccum",
      "operand": "eq",
      "value": "on",
      "logical": "OR",
      "actuator": "00002"
    },
    {
      "id": 2,
      "site": "kitchen",
      "device": "00002",
      "part": "sensor",
      "name": "temp",
      "operand": "gt",
      "value": "12",
      "logical": "AND",
      "sensor": "00001"
    },
    {
      "id": 3,
      "site": "room1",
      "device": "00004",
      "part": "actuator",
      "name": "tv",
      "operand": "eq",
      "value": "off",
      "logical": "AND",
      "actuator": "00005"
    },
    {
      "id": 4,
      "site": "garge",
      "device": "00010",
      "part": "actuator",
      "name": "vaccum",
      "operand": "eq",
      "value": "on",
      "logical": "AND",
      "actuator": "00002"
    },
    {
      "id": 5,
      "site": "parking",
      "device": "00001",
      "part": "sensor",
      "name": "pressure",
      "operand": "lt",
      "value": "1234",
      "logical": "OR",
      "sensor": "00007"
    },
    {
      "id": 6,
      "site": "hall",
      "device": "00007",
      "part": "sensor",
      "name": "temp",
      "operand": "ne",
      "value": "2342",
      "logical": "AND",
      "sensor": "00001"
    }
  ]
*/
/** try 2 

const conditionsTable =[
    {
      "id": 1,
      "site": "hall",
      "device": "00003",
      "part": "sensor",
      "name": "temp",
      "operand": "gt",
      "value": "12",
      "logical": "AND",
      "sensor": "00001"
    },
    {
      "id": 2,
      "site": "room1",
      "device": "00004",
      "part": "sensor",
      "name": "temp",
      "operand": "lt",
      "value": "123",
      "logical": "AND",
      "sensor": "00001"
    },
    {
      "id": 3,
      "site": "room2",
      "device": "00009",
      "part": "sensor",
      "name": "temp",
      "operand": "lt",
      "value": "23",
      "logical": "OR",
      "sensor": "00001"
    },
    {
      "id": 4,
      "site": "garge",
      "device": "00010",
      "part": "actuator",
      "name": "light",
      "operand": "eq",
      "value": "on",
      "logical": "AND",
      "actuator": "00006"
    }
  ]
*/

/**try 3 🆗
const conditionsTable =[
    {
      "id": 1,
      "site": "room1",
      "device": "00004",
      "part": "sensor",
      "name": "temp",
      "operand": "gt",
      "value": "12",
      "logical": "OR",
      "sensor": "00001"
    },
    {
      "id": 2,
      "site": "garge",
      "device": "00010",
      "part": "sensor",
      "name": "temp",
      "operand": "lt",
      "value": "123",
      "logical": "OR",
      "sensor": "00001"
    },
    {
      "id": 3,
      "site": "parking",
      "device": "00001",
      "part": "actuator",
      "name": "light",
      "operand": "eq",
      "value": "off",
      "logical": "OR",
      "actuator": "00006"
    }
  ]

*/
/** try 4 👌 
const conditionsTable =[
    {
      "id": 1,
      "site": "hall",
      "device": "00003",
      "part": "sensor",
      "name": "pressure",
      "operand": "gt",
      "value": "1",
      "logical": "AND",
      "sensor": "00004"
    },
    {
      "id": 2,
      "site": "garge",
      "device": "00010",
      "part": "sensor",
      "name": "pressure",
      "operand": "ne",
      "value": "121",
      "logical": "OR",
      "sensor": "00007"
    },
    {
      "id": 3,
      "site": "parking",
      "device": "00001",
      "part": "actuator",
      "name": "light",
      "operand": "eq",
      "value": "off",
      "logical": "AND",
      "actuator": "00006"
    }
  ]

*/
/** try 5 🆗 
const conditionsTable =[
    {
      "id": 1,
      "site": "hall",
      "device": "00003",
      "part": "sensor",
      "name": "pressure",
      "operand": "gt",
      "value": "1",
      "logical": "AND",
      "sensor": "00004"
    }
  
  ]
*/

/** try 6 🆗 
const conditionsTable =[
    {
      "id": 1,
      "site": "hall",
      "device": "00003",
      "part": "sensor",
      "name": "pressure",
      "operand": "gt",
      "value": "1",
      "logical": "OR",
      "sensor": "00004"
    }
  
  ]
*/

/** try 7 🆗 
const conditionsTable =[
    {
      "id": 1,
      "site": "hall",
      "device": "00003",
      "part": "sensor",
      "name": "pressure",
      "operand": "gt",
      "value": "1",
      "logical": "",
      "sensor": "00004"
    }
  
  ]
*/
///

/** 
const operandMapping = {
    'eq': '===',
    'lte': '<=',
    'lt': '<',
    'gte': '>=',
    'gt': '>',
    'ne': '!=='
};

async function fetchLatestDataForCondition(condition) {
    // Sample: Simulating fetching data for a given condition from the DB.
    // In real-world usage, replace this with your actual RethinkDB query.
    return {
        site: condition.site,
        device: condition.device,
        part: condition.part === 'sensor' ? condition.sensor : condition.actuator,
        name: condition.name,
        value: condition.value[Object.keys(condition.value)[0]]  // mock value
    };
}

function evaluateSingleCondition(data, condition) {
    const operand = operandMapping[Object.keys(condition.value)[0]];
    const checkValue = condition.value[Object.keys(condition.value)[0]];
    const evalString = `data.value ${operand} ${checkValue}`;
    return eval(evalString);
}

async function evaluateConditions(inputArray) {
    let results = [];

    for (let conditionsGroup of inputArray) {
        if (conditionsGroup.length === 1) {
            // OR condition
            let data = await fetchLatestDataForCondition(conditionsGroup[0]);
            results.push(evaluateSingleCondition(data, conditionsGroup[0]));
        } else {
            // AND condition
            let andResults = [];
            for (let condition of conditionsGroup) {
                let data = await fetchLatestDataForCondition(condition);
                andResults.push(evaluateSingleCondition(data, condition));
            }
            results.push(andResults.every(res => res === true));
        }
    }

    return results.includes(true);
}

// Usage example:
(async function() {
    const overallResult = await evaluateConditions(conditionsTable);
    console.log(overallResult);  // true if any group of conditions is met, false otherwise.
})();

*/


// function generateReQLQuery(conditions) {
//     const operandMapping = {
//         'eq': 'eq',
//         'lte': 'le',
//         'lt': 'lt',
//         'gte': 'ge',
//         'gt': 'gt',
//         'ne': 'ne'
//     };

//     let groupedQueries = [];
//     let currentGroup = [];

//     for (let i = 0; i < conditions.length; i++) {
//         const condition = conditions[i];
//         const operation = {
//             name: condition.name,
//             site: condition.site,
//             device: condition.device,
//             [condition.part]: condition[condition.part],
//             value: { [operandMapping[condition.operand]]: condition.value }
//         };

//         // If the first condition is OR, push it as its own group and continue.
//         if (i === 0 && condition.logical === "OR") {
//             groupedQueries.push([operation]);
//             continue;
//         }

//         // If the current condition is OR and not the first in the group, finalize the current group first.
//         if (condition.logical === "OR" && currentGroup.length > 0) {
//             groupedQueries.push(currentGroup);
//             currentGroup = [];
//         }

//         currentGroup.push(operation);

//         // If the next condition is not 'AND' or it's the last condition, push the currentGroup to the groupedQueries.
//         if (i === conditions.length - 1 || conditions[i + 1].logical !== "AND") {
//             groupedQueries.push(currentGroup);
//             currentGroup = [];
//         }
//     }

//     return groupedQueries;
// }

// convert above array to reQL

// function generateReQLQuery(conditions) {
//     const operandMapping = {
//         'eq': 'eq',
//         'lte': 'le',
//         'lt': 'lt',
//         'gte': 'ge',
//         'gt': 'gt',
//         'ne': 'ne'
//     };

//     let groupedQueries = [];
//     let currentGroup = [];

//     for (let i = 0; i < conditions.length; i++) {
//         const condition = conditions[i];
//         const operation = {
//             name: condition.name,
//             site: condition.site,
//             device: condition.device,
//             [condition.part]: condition[condition.part],
//             value: { [operandMapping[condition.operand]]: condition.value }
//         };

//         const currentLogical = condition.logical || "OR";
//         const nextLogical = conditions[i + 1] ? conditions[i + 1].logical || "OR" : null;

//         if (currentLogical === "OR" && (!nextLogical || nextLogical === "OR")) {
//             if (currentGroup.length) {
//                 groupedQueries.push(currentGroup);
//                 currentGroup = [];
//             }
//             groupedQueries.push([operation]);
//         } else {
//             currentGroup.push(operation);
//             if (!nextLogical || nextLogical === "OR") {
//                 groupedQueries.push(currentGroup);
//                 currentGroup = [];
//             }
//         }
//     }

//     return groupedQueries;
// }


function generateReQLQuery(conditions) {
    const operandMapping = {
        'eq': 'eq',
        'lte': 'le',
        'lt': 'lt',
        'gte': 'ge',
        'gt': 'gt',
        'ne': 'ne'
    };

    let groupedQueries = [];
    let currentGroup = [];

    for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];
        const operation = {
            id: condition.id,
            name: condition.name,
            site: condition.site,
            device: condition.device,
            [condition.part]: condition[condition.part],
            value: { [operandMapping[condition.operand]]: condition.value }
        };

        currentGroup.push(operation);

        if (condition.logical === "OR" || i === conditions.length - 1) {
            groupedQueries.push([...currentGroup]);
            currentGroup = [];
        }
    }

    return groupedQueries;
}






const filterConditionData = conditionsTable;
const conditions = filterConditionData;
const groupedQueries = generateReQLQuery(conditions);

if(groupedQueries.length > 0){
    console.log('groupedQueries ', JSON.stringify(groupedQueries));
}