const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.itemTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.CatalogueUUID){
        return Responses._400({message: 'missing the Item Name'})
    }

    const catalogueUuid = event.pathParameters.CatalogueUUID

    const Items = await Dynamo.query({
        tableName,
        index: 'catalogue-uuid-index',
        queryKey: 'CatalogueUUID',
        queryValue: catalogueUuid
    });

    return Responses._200({Items});
}
