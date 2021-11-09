const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')
const {v4: uuidv4} = require("uuid");

const tableName = process.env.reminderTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.body || !JSON.parse(event.body).UUID){
        return Responses._400({message: 'missing UUID'})
    }

    const reminder = JSON.parse(event.body);

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    reminder.UserID = UserID

    console.log("========================",reminder);

    const newReminder = await Dynamo.write(reminder, tableName).catch(err => {
        console.log("Error in dynamo write", err)
        return null;
    })

    if (!newReminder){
        return Responses._400({message: "Failed to write reminder by UUID"})
    }

    return Responses._200({newReminder});
}
