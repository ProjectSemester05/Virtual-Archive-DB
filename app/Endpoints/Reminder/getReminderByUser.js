const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

let tableName = process.env.reminderTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    const Reminders = await Dynamo.query({
        tableName,
        index: 'reminder-user-id-index',
        queryKey: 'UserID',
        queryValue: UserID
    });

    for (const reminder of Reminders) {
        let UUID = reminder.ItemUUID;
        console.log("***********",UUID);

        const item = await Dynamo.get(UUID, UserID, process.env.itemTableName).catch(err => {
            console.log("Error in Dynamo Get", err);
            return null
        })

        if (item){
            reminder.ItemName = item.ItemName
            reminder.ImageUrl = item.ImageUrl
        }

    }


    return Responses._200({Reminders});
}
