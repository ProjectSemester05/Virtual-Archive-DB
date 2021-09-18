const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')
const {v4: uuidv4} = require("uuid");

const tableName = process.env.catalogueTableName

exports.handler = async event => {
    console.log('event',event)

    let ID = uuidv4();

    const catalogue = JSON.parse(event.body);

    catalogue.UUID = ID

    // catalogue.CatalogueName = catalogue.CatalogueName.replace(/ /g, '-')

    console.log("========================",catalogue);

    const newCatalogue = await Dynamo.write(catalogue, tableName).catch(err => {
        console.log("Error in dynamo write", err)
        return null;
    })

    if (!newCatalogue){
        return Responses._400({message: "Failed to write catalogue by UUID"})
    }

    return Responses._200({newCatalogue});
}
