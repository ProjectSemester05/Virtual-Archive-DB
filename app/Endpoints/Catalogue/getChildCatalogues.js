const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.catalogueTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.ParentCatalogueUUID){
        return Responses._400({message: 'missing the parent UUID'})
    }

    const ParentCatalogueUUID = event.pathParameters.ParentCatalogueUUID

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    // const Items = await Dynamo.query({
    //     tableName,
    //     index: 'parent-uuid-index',
    //     queryKey: 'ParentCatalogueUUID',
    //     queryValue: ParentCatalogueUUID
    // });

    const Catalogues = await Dynamo.getCatalogueByParent(ParentCatalogueUUID, UserID);

    return Responses._200({Catalogues});
}
