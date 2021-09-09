const Responses = require('../Common/responses');
const Dynamo = require('../Common/Dynamo')

const tableName = process.env.tableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.ID){
        return Responses._400({message: 'missing the ID'})
    }

    let ID = event.pathParameters.ID

    const catalogue = await Dynamo.get(ID, tableName).catch(err => {
        console.log("Error in Dynamo Get", err);
        return null
    })

    if (!catalogue){
        return Responses._400({message: "Failed to get catalogue by ID"})
    }

    return Responses._200({catalogue});
}
