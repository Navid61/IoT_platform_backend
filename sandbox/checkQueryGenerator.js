const conditionsTable=[
    [
        {
            "name": "temp",
            "site": "kitchen",
            "device": "00002",
            "sensor": "00001",
            "value": {
                "gt": "12"
            }
        }
    ],
    [
        {
            "name": "temp",
            "site": "kitchen",
            "device": "00002",
            "sensor": "00001",
            "value": {
                "lt": "123"
            }
        }
    ],
    [
        {
            "name": "tv",
            "site": "kitchen",
            "device": "00002",
            "actuator": "00005",
            "value": {
                "eq": "off"
            }
        },
        {
            "name": "light",
            "site": "hall",
            "device": "00003",
            "actuator": "00006",
            "value": {
                "eq": "on"
            }
        }
    ],
    [
        {
            "name": "temp",
            "site": "room1",
            "device": "00004",
            "sensor": "00001",
            "value": {
                "ge": "12"
            }
        }
    ],
    [
        {
            "name": "temp",
            "site": "parking",
            "device": "00001",
            "sensor": "00001",
            "value": {
                "le": "23"
            }
        },
        {
            "name": "temp",
            "site": "room2",
            "device": "00009",
            "sensor": "00001",
            "value": {
                "lt": "34"
            }
        }
    ],
    [
        {
            "name": "light",
            "site": "garge",
            "device": "00010",
            "actuator": "00006",
            "value": {
                "eq": "off"
            }
        }
    ],
    [
        {
            "name": "light",
            "site": "room3",
            "device": "00006",
            "actuator": "00006",
            "value": {
                "eq": "on"
            }
        }
    ]
]




function generateSingleReQLCondition(condition) {
    let baseQuery = r.table('your_table_name')
        .filter(r.row('site').eq(condition.site))
        .and(r.row('device').eq(condition.device))
        .and(r.row('name').eq(condition.name));

    if (condition.sensor) {
        baseQuery = baseQuery.and(r.row('part').eq('sensor'))
            .and(r.row('sensor').eq(condition.sensor));
    } else if (condition.actuator) {
        baseQuery = baseQuery.and(r.row('part').eq('actuator'))
            .and(r.row('actuator').eq(condition.actuator));
    }

    const operand = Object.keys(condition.value)[0];
    const value = condition.value[operand];
    if (isNaN(value)) {
        baseQuery = baseQuery.and(r.row('value')[operand](value));
    } else {
        baseQuery = baseQuery.and(r.row('value')[operand](parseFloat(value)));
    }
    
    return baseQuery;
}

// Given a single query, this function executes it against the database and checks if the result is non-empty
async function executeAndCheck(query, connection) {
    let result = await query.run(connection);
    return result.length > 0;
}

async function evaluateConditions(conditionsTable, connection) {
    let results = [];
    for (const conditions of conditionsTable) {
        if (conditions.length === 1) {
            const query = generateSingleReQLCondition(conditions[0]);
            results.push(await executeAndCheck(query, connection));
        } else {
            let andResults = [];
            for (const condition of conditions) {
                const query = generateSingleReQLCondition(condition);
                andResults.push(await executeAndCheck(query, connection));
            }
            results.push(!andResults.includes(false));
        }
    }
    return results;
}

// Example usage:
(async function() {
    // Use your existing connection here
    const evaluationResults = await evaluateConditions(conditionsTable, yourExistingConnection);
    const finalResult = evaluationResults.includes(true);
    console.log(finalResult);
})();

/**
 * 
 * evaluateConditions Function
This function is asynchronous because it involves database operations which are inherently asynchronous.

Parameters:
conditionsTable: This is an array where each element can be:

An array containing a single condition object: Represents an OR condition.
An array containing multiple condition objects: Represents a group of AND conditions.
connection: This is the RethinkDB connection object you use to interact with the database.

Inside the function:
let results = [];: We initialize an empty array where we'll store the results of evaluating each set of conditions.

The outer for loop (for (const conditions of conditionsTable)) iterates over each set of conditions in the conditionsTable.

If the current conditions array has only one condition:

if (conditions.length === 1) { ... }: This means we're dealing with an OR condition.

const query = generateSingleReQLCondition(conditions[0]);: We generate the RethinkDB query string for this single condition.

results.push(await executeAndCheck(query, connection));: We execute the query and check the result. The result (either true or false) is added to our results array.

If the current conditions array has multiple conditions:

This means we're dealing with a set of AND conditions.

let andResults = [];: We initialize an empty array to store the results of evaluating each individual AND condition.

The inner for loop (for (const condition of conditions)) iterates over each individual condition in the current set of AND conditions.

const query = generateSingleReQLCondition(condition);: For each condition, we generate the RethinkDB query string.

andResults.push(await executeAndCheck(query, connection));: We execute the query for each condition and check the result. Each result is added to the andResults array.

After evaluating all conditions in the current AND group, results.push(!andResults.includes(false)); checks if any of the results in andResults is false. If even one is false, it means the entire group of AND conditions evaluates to false. If all are true, it means the entire group of AND conditions evaluates to true. The result for the entire group is then added to our results array.

After iterating over all sets of conditions in conditionsTable, the function returns the results array.

In essence, this function is designed to process a table of conditions where each entry can either be a single OR condition or a group of AND conditions. The function returns an array of boolean values indicating the result of each set of conditions.
 */