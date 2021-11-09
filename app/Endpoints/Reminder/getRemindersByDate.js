const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

// const tableName = process.env.reminderTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.ReminderDate){
        return Responses._400({message: 'missing the Reminder Date'})
    }

    const ReminderDate = event.pathParameters.ReminderDate

    // const Reminders = await Dynamo.query({
    //     tableName,
    //     index: 'reminder-date-index',
    //     queryKey: 'ReminderDate',
    //     queryValue: ReminderDate
    // });

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    const Reminders = await Dynamo.getReminderByDate(ReminderDate, UserID);

    return Responses._200({Reminders});
}
