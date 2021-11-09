const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.catalogueTableName

exports.handler = async event => {
    console.log('event',event)

    // if (!event.pathParameters || !event.pathParameters.UserID){
    //     return Responses._400({message: 'missing the User ID'})
    // }
    //
    // const userId = event.pathParameters.UserID

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const userId = event.headers.userid

    const Catalogues = await Dynamo.query({
        tableName,
        index: 'user-id-index',
        queryKey: 'UserID',
        queryValue: userId
    });

    // const Items = await Dynamo.getItemByCatalogue(catalogueUuid, userId);

    return Responses._200({Catalogues});
}
