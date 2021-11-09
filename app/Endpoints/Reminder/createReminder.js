const { v4: uuidv4 } = require('uuid');
const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.reminderTableName

exports.handler = async event => {
    console.log('event',event)

    let ID = uuidv4();

    const reminder = JSON.parse(event.body);

    reminder.UUID = ID

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    reminder.UserID = UserID

    const newReminder = await Dynamo.write(reminder, tableName).catch(err => {
        console.log("Error in dynamo write", err)
        return null;
    })

    if (!newReminder){
        return Responses._400({message: "Failed to write reminder by ID"})
    }

    return Responses._200({newReminder});
}
