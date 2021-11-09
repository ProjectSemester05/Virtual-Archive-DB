const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.reminderTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.ItemUUID){
        return Responses._400({message: 'missing the User ID'})
    }

    const ItemUUID = event.pathParameters.ItemUUID

    // const Reminders = await Dynamo.query({
    //     tableName,
    //     index: 'reminder-item-id-index',
    //     queryKey: 'ItemUUID',
    //     queryValue: ItemUUID
    // });

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    const Reminders = await Dynamo.getReminderByItem(ItemUUID, UserID);

    return Responses._200({Reminders});
}
