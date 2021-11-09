const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.itemTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.CatalogueUUID){
        return Responses._400({message: 'missing the Item Name'})
    }

    const catalogueUuid = event.pathParameters.CatalogueUUID

    // const Items = await Dynamo.query({
    //     tableName,
    //     index: 'catalogue-uuid-index',
    //     queryKey: 'CatalogueUUID',
    //     queryValue: catalogueUuid
    // });
    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    const Items = await Dynamo.getItemByCatalogue(catalogueUuid, UserID);

    return Responses._200({Items});
}
