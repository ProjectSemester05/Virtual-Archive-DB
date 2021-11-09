const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.itemTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.pathParameters || !event.pathParameters.ItemName){
        return Responses._400({message: 'missing the Item Name'})
    }

    const itemName = event.pathParameters.ItemName.replace(/%20/g, ' ')

    // const Items = await Dynamo.query({
    //     tableName,
    //     index: 'item-name-index',
    //     queryKey: 'ItemName',
    //     queryValue: itemName
    // });

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    const Items = await Dynamo.getItemByName(itemName, UserID);

    return Responses._200({Items});
}
