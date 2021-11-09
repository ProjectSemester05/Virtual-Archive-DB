const AWS = require('aws-sdk');
const {target} = require("../../webpack.config");

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {

    async get(UUID, UserID, TableName) {
        const params = {
            TableName,
            Key: {
                "UserID": UserID,
                "UUID" : UUID
            },
        };

        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) {
            throw Error(`There was an error fetching the data for UUID of ${UUID} from ${TableName}`);
        }
        console.log(data);

        return data.Item;
    },

    async write(data, TableName) {
        if (!data.UUID) {
            throw Error("No UUID on the data")
        }

        const params = {
            TableName,
            Item: data
        };

        const res = await documentClient.put(params).promise();

        if (!res) {
            throw Error(`There was an error inserting UUID of the ${data.UUID} in the ${TableName}`)
        }

        return data;
    },

    // async update(tableName, primaryKey, primaryKeyValue)


    async delete(UUID, UserID, TableName) {
        const params = {
            TableName,
            Key: {
                "UserID": UserID,
                "UUID" : UUID
            },
        };

        const data = await documentClient.delete(params).promise();

        if (!data || !data.Item) {
            throw Error(`There was an error erasing the data for UUID of ${UUID} from ${TableName}`);
        }
        console.log(data);

        return data.Item;
    },

    query: async ({tableName, index, queryKey, queryValue}) => {
        const params = {
            TableName: tableName,
            IndexName: index,
            KeyConditionExpression: `${queryKey} = :hkey`,
            ExpressionAttributeValues: {
                ':hkey': queryValue
            }
        };

        const res = await documentClient.query(params).promise();

        return res.Items || [];
    },

    getCatalogueByName: async (catalogueName, UserID) => {
        // const params = {
        //     TableName: "catalogues",
        //     KeyConditionExpression: `#uid = :id`,
        //     ExpressionAttributeNames:{
        //         "#uid": "UserID"
        //     },
        //     ExpressionAttributeValues: {
        //         ":id" : "14082a4d-35d1-4450-97c3-393730cffa29"
        //     }
        // };

        const params = {
            TableName: "catalogues",
            IndexName: "catalogue-name-index",
            KeyConditionExpression: "UserID = :id and CatalogueName = :name",
            ExpressionAttributeValues: {
                ":id" : UserID,
                ":name" : catalogueName
            }
        };

        const res = await documentClient.query(params).promise();

        return res.Items || [];
    },

    getCatalogueByParent: async (ParentCatalogueUUID, UserID) => {

        const params = {
            TableName: "catalogues",
            IndexName: "parent-uuid-index",
            KeyConditionExpression: "UserID = :id and ParentCatalogueUUID = :uid",
            ExpressionAttributeValues: {
                ":id" : UserID,
                ":uid" : ParentCatalogueUUID
            }
        };

        const res = await documentClient.query(params).promise();

        return res.Items || [];
    },

    getItemByName: async (itemName, UserID) => {

        const params = {
            TableName: "items",
            IndexName: "item-name-index",
            KeyConditionExpression: "UserID = :id and ItemName = :name",
            ExpressionAttributeValues: {
                ":id" : UserID,
                ":name" : itemName
            }
        };

        const res = await documentClient.query(params).promise();

        return res.Items || [];
    },

    getItemByCatalogue: async (CatalogueUUID, UserID) => {

        const params = {
            TableName: "items",
            IndexName: "catalogue-uuid-index",
            KeyConditionExpression: "UserID = :id and CatalogueUUID = :uid",
            ExpressionAttributeValues: {
                ":id" : UserID,
                ":uid" : CatalogueUUID
            }
        };

        const res = await documentClient.query(params).promise();

        return res.Items || [];
    },

    getReminderByDate: async (ReminderDate, UserID) => {

        const params = {
            TableName: "reminders",
            IndexName: "reminder-date-index",
            KeyConditionExpression: "UserID = :id and ReminderDate = :rdate",
            ExpressionAttributeValues: {
                ":id" : UserID,
                ":rdate" : ReminderDate
            }
        };

        const res = await documentClient.query(params).promise();

        return res.Items || [];
    },

    getReminderByItem: async (ItemUUID, UserID) => {

        const params = {
            TableName: "reminders",
            IndexName: "reminder-item-id-index",
            KeyConditionExpression: "UserID = :id and ItemUUID = :uid",
            ExpressionAttributeValues: {
                ":id" : UserID,
                ":uid" : ItemUUID
            }
        };

        const res = await documentClient.query(params).promise();

        return res.Items || [];
    },

};

module.exports = Dynamo
