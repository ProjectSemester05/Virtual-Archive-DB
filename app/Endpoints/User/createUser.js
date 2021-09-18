const { v4: uuidv4 } = require('uuid');
const Responses = require('../../Common/responses');
const Dynamo = require('../../Common/Dynamo')

const tableName = process.env.userTableName

exports.handler = async event => {
    console.log('event',event)

    let ID = uuidv4();

    const user = JSON.parse(event.body);

    user.UUID = ID

    const newUser = await Dynamo.write(user, tableName).catch(err => {
        console.log("Error in dynamo write", err)
        return null;
    })

    if (!newUser){
        return Responses._400({message: "Failed to write user by ID"})
    }

    return Responses._200({newUser});
}
