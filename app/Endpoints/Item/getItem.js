const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.itemTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.UUID){
        return Responses._400({message: 'missing the UUID'})
    }

    let UUID = event.pathParameters.UUID

    const item = await Dynamo.get(UUID, tableName).catch(err => {
        console.log("Error in Dynamo Get", err);
        return null
    })

    if (!item){
        return Responses._400({message: "Failed to get item by UUID"})
    }

    return Responses._200({item});
}
