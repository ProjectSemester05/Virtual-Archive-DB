const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.userTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.UUID){
        return Responses._400({message: 'missing the UUID'})
    }

    let UUID = event.pathParameters.UUID

    const user = await Dynamo.get(UUID, tableName).catch(err => {
        console.log("Error in Dynamo Get", err);
        return null
    })

    if (!user){
        return Responses._400({message: "Failed to get user by UUID"})
    }

    return Responses._200({user});
}
