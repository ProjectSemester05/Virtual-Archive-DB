const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.CatalogueName || !event.pathParameters.ItemName){
        return Responses._400({message: 'missing the Catalogue Name'})
    }

    const catalogueName = event.pathParameters.CatalogueName.replace(/%20/g, ' ')

    const itemName = event.pathParameters.ItemName.replace(/%20/g, ' ')

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    const Catalogues = await Dynamo.getCatalogueByName(catalogueName, UserID);

    if (Catalogues.length === 0){
        return Responses._400({message: 'No such catalogue exist'})
    }

    let catalogueUuid = Catalogues[0].UUID

    const Items = await Dynamo.getItemByCatalogue(catalogueUuid, UserID);

    let itemUuid = "";

    let itemFound = false;

    Items.forEach(item => {
        if(item.ItemName === itemName){
            itemUuid = item.UUID;
            itemFound = true;
        }
    })

    if (itemFound === false){
        return Responses._400({message: 'No such item exist'})
    }

    return Responses._200({itemUuid});
}
