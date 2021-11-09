const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')
const {v4: uuidv4} = require("uuid");

const tableName = process.env.catalogueTableName

exports.handler = async event => {
    console.log('event',event)

    if (!event.headers || !event.headers.userid){
        return Responses._400({message: 'missing header UserID'})
    }

    const UserID = event.headers.userid

    let ID = uuidv4();

    const catalogue = JSON.parse(event.body);

    catalogue.UUID = ID;
    catalogue.UserID = UserID;

    // catalogue.CatalogueName = catalogue.CatalogueName.replace(/ /g, '-')

    const catalogueName = catalogue.CatalogueName;

    const catalogueExist = await Dynamo.getCatalogueByName(catalogueName, UserID);

    if (!catalogueExist || catalogueExist.length !== 0){
        return Responses._400({message: 'Name Already Exist'})
    }

    const newCatalogue = await Dynamo.write(catalogue, tableName).catch(err => {
        console.log("Error in dynamo write", err)
        return null;
    })

    if (!newCatalogue){
        return Responses._400({message: "Failed to write catalogue by UUID"})
    }

    return Responses._200({newCatalogue});
}
