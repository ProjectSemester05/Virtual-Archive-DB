const AWS = require('aws-sdk');
const {target} = require("../../webpack.config");

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
    async get(UUID, TableName) {
        const params = {
            TableName,
            Key: {
                UUID,
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

    // async update(data)

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
    }

};

module.exports = Dynamo
