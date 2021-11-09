const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.itemTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.UUID){
        return Responses._400({message: 'missing the UUID'})
    }

    let UUID = event.pathParameters.UUID

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    const item = await Dynamo.get(UUID, UserID, tableName).catch(err => {
        console.log("Error in Dynamo Get", err);
        return null
    })

    if (!item){
        return Responses._400({message: "No such item exist"})
    }

    await Dynamo.delete(UUID, UserID, tableName).catch(err => {
        console.log("Error in Dynamo Get", err);
        return null
    })

    return Responses._200({message: "Item deleted Successfully"});
}
