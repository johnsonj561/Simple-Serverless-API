const { LambdaResponse, StatusCodes } = require('./utils/lambda-utility');
const AWS = require('aws-sdk');


/**
 * Get All Users
 * Looks up all users in user table
 * Returns success message with user data if lookup success
 */
exports.handler = async (event, context, callback) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const lambdaResponse = new LambdaResponse(callback);

  // perform lookup
  const TableName = 'users';
  const lookupParams = { TableName };
 
  try {

    // get all users and return, default to empty array
    const { Items } = await documentClient.scan(lookupParams).promise();
    return lambdaResponse.sendSuccess(Items || []);

  } catch(err) {
    return lambdaResponse.sendError('Error looking up users', StatusCodes.INTERNAL_ERROR);
  }
};
