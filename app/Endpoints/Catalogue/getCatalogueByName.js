const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.catalogueTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.CatalogueName){
        return Responses._400({message: 'missing the Catalogue Name'})
    }

    const catalogueName = event.pathParameters.CatalogueName.replace(/%20/g, ' ')

    console.log("**********************    ", catalogueName);

    const Catalogues = await Dynamo.query({
        tableName,
        index: 'catalogue-name-index',
        queryKey: 'CatalogueName',
        queryValue: catalogueName
    });

    return Responses._200({Catalogues});
}
