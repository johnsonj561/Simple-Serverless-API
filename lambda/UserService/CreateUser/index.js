const { LambdaResponse, StatusCodes } = require('./utils/lambda-utility');
const AWS = require('aws-sdk');
const UserModel = require('./models/user.model');

/**
 * Create User
 * Validates body
 * Writes data to user table if valid
 * Returns success response if write succeeds
 */
exports.handler = async (event, context, callback) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const lambdaResponse = new LambdaResponse(callback);

  // parse payload
  let { body } = event;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return lambdaResponse.sendError('Invalid payload, unable to parse', StatusCodes.BAD_REQUEST);
    }
  }
  
  // validate payload
  const errors = UserModel.validationErrors(body);
  if (errors.length) {
    return lambdaResponse.sendError(errors, StatusCodes.BAD_REQUEST);
  }

  const TableName = 'users';
  const { email } = body;
  const lookupParams = { TableName, Key: { email }};
  const createParams = { TableName, Item: body };

  
  try {

    // make sure user does not already exist
    const { Item } = await documentClient.get(lookupParams).promise();
    if (Item) {
      return lambdaResponse.sendError(`User ${email} already exists`, StatusCodes.CONFLICT);
    }

    // write new user to users table
    await documentClient.put(createParams).promise();
    return lambdaResponse.sendSuccess(`User ${email} created`);

  } catch(err) {
    return lambdaResponse.sendError('Error creating new user', StatusCodes.INTERNAL_ERROR);
  }
};
