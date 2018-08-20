const { LambdaResponse, StatusCodes } = require('./utils/lambda-utility');
const AWS = require('aws-sdk');

/**
 * Delete User
 * Receives user email from pathname
 * Deletes user from database
 * Returns success if delete is performed without error
 */
exports.handler = async (event, context, callback) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const lambdaResponse = new LambdaResponse(callback);
  
  // get email from path params
  const { pathParameters } = event;
  const { email } = pathParameters;

  // check for valid email
  if (!email) {
    return lambdaResponse.sendError('Missing required email', StatusCodes.BAD_REQUEST);
  }

  // perform lookup
  const TableName = 'users';
  const lookupParams = { TableName, Key: { email }};
 
  try {

    // check if user exists
    const { Item } = await documentClient.get(lookupParams).promise();
    if (!Item) {
      return lambdaResponse.sendError(`User ${email} not found`, StatusCodes.NOT_FOUND);
    }

    // delete user
    await documentClient.delete(lookupParams).promise();
    return lambdaResponse.sendSuccess(`User ${email} deleted`);

  } catch(err) {
    return lambdaResponse.sendError(`Error deleting user ${email}`, StatusCodes.INTERNAL_ERROR);
  }
};
