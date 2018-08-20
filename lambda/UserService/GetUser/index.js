const { LambdaResponse, StatusCodes } = require('./utils/lambda-utility');
const AWS = require('aws-sdk');

/**
 * Get User
 * Looks up user with email provided in path name
 * Returns user or empty object as success message if lookup success
 */
exports.handler = async (event, context, callback) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const lambdaResponse = new LambdaResponse(callback);
  
  // get email from path params
  const { pathParameters } = event;
  const { email } = pathParameters;

  // check for valid email
  if (!email) {
    return lambdaResponse.sendError('Required email missing', StatusCodes.BAD_REQUEST);
  }

  // perform lookup
  const TableName = 'users';
  const lookupParams = { TableName, Key: { email }};
 
  try {

    const { Item } = await documentClient.get(lookupParams).promise();
    return (Item) ?
      lambdaResponse.sendSuccess(Item) :
      lambdaResponse.sendError(`User ${email} not found`, StatusCodes.NOT_FOUND);

  } catch(err) {
    return lambdaResponse.sendError(`Error looking up user ${email}`, StatusCodes.INTERNAL_ERROR);
  }
};
