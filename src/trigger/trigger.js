const express = require("express");

const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');

const SensorsGroup = require('../db/models/sensors')

const ActuatorsGroup = require('../db/models/actuator')

const sensorSite = require("../db/models/sensorSite");

const actuatorSite = require("../db/models/actuatorSite");

const FilterRule = require('../db/models/filter')

const Scene = require('../db/models/scene');

const Device = require("../db/models/device")


// const mongodb = require("../db/config/mongodb");

const mongodb = require("../db/config/mongodb");
const streamDB =  mongodb.streamDB;



const UserGroup = require("../db/models/usergroup");

const Stream = require("../db/models/stream");


const checkAuthenticated = function (req, res, next) {
  
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)

router.post("/trigger/tasks",async (req, res)=>{



    /**
 * Generate ReQL query groups based on logical operators.
 * 
 * This function processes an array of conditions and groups them based on their logical operators. 
 * The main goal is to group consecutive conditions with 'AND' logic together until an 'OR' condition is encountered.
 * 
 * For instance, if we have the sequence: A OR B AND C AND D OR E, the output will be:
 * [[A], [B, C, D], [E]]
 * 
 * @param {Array} conditions - The list of conditions to process.
 * @returns {Array} An array of grouped conditions.
 */
function generateReQLQuery(conditions) {
    // Mapping of the given operand to its corresponding ReQL function name.
    const operandMapping = {
        'eq': 'eq',
        'lte': 'le',
        'lt': 'lt',
        'gte': 'ge',
        'gt': 'gt',
        'ne': 'ne'
    };

    let groupedQueries = [];  // This will hold the final groups of conditions.
    let currentGroup = [];    // Temporarily stores the conditions for the current group.

    for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];

        // Construct the operation object from the condition.
        const operation = {
            id: condition.id,
            name: condition.name,
            site: condition.site,
            device: condition.device,
            [condition.part]: condition[condition.part], // Either sensor or actuator.
            value: { [operandMapping[condition.operand]]: condition.value }
        };

        // Add the operation to the current group.
        currentGroup.push(operation);

        // If the condition's logical operator is 'OR' or if it's the last condition in the list,
        // add the current group to the groupedQueries and then reset the current group.
        if (condition.logical === "OR" || i === conditions.length - 1) {
            groupedQueries.push([...currentGroup]);
            currentGroup = [];
        }
    }

    return groupedQueries;
}



})





module.exports = router;