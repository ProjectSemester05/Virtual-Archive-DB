const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')
const {v4: uuidv4} = require("uuid");

const tableName = process.env.itemTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.body || !JSON.parse(event.body).UUID){
        return Responses._400({message: 'missing essential data'})
    }

    const item = JSON.parse(event.body);

    console.log("========================",item);

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    item.UserID = UserID

    const newItem = await Dynamo.write(item, tableName).catch(err => {
        console.log("Error in dynamo write", err)
        return null;
    })

    if (!newItem){
        return Responses._400({message: "Failed to update item by UUID"})
    }

    return Responses._200({newItem});
}
