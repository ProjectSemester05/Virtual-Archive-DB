const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')
const {v4: uuidv4} = require("uuid");

const tableName = process.env.itemTableName

exports.handler = async event => {
    console.log('event',event)

    let ID = uuidv4();

    const item = JSON.parse(event.body);

    item.UUID = ID

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    item.UserID = UserID;

    console.log("========================",item);

    const newItem = await Dynamo.write(item, tableName).catch(err => {
        console.log("Error in dynamo write", err)
        return null;
    })

    if (!newItem){
        return Responses._400({message: "Failed to write item by UUID"})
    }

    return Responses._200({newItem});
}
