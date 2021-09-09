const Responses = require('../Common/responses');
const Dynamo = require('../Common/Dynamo')

const tableName = process.env.tableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.ID){
        return Responses._400({message: 'missing the ID'})
    }

    let ID = event.pathParameters.ID

    const catalogue = JSON.parse(event.body);

    catalogue.ID = ID

    const newCatalogue = await Dynamo.write(catalogue, tableName).catch(err => {
        console.log("Error in dynamo write", err)
        return null;
    })

    if (!newCatalogue){
        return Responses._400({message: "Failed to write catalogue by ID"})
    }

    return Responses._200({newCatalogue});
}
