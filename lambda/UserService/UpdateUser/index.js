const { LambdaResponse, StatusCodes } = require('./utils/lambda-utility');
const AWS = require('aws-sdk');
const UserModel = require('./models/user.model');

/**
 * Update User
 * Performs user lookup to make sure user exists
 * Validates user against user model, then writes to database
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

  const TableName = 'users';
  const { email } = body;
  const lookupParams = { TableName, Key: { email }};
  const updateParams = { TableName, Item: body };

  // validate payload
  const errors = UserModel.validationErrors(body);
  if (errors.length) {
    return lambdaResponse.sendError(errors, StatusCodes.BAD_REQUEST);
  }
 

  try {

    // make sure user exists
    const { Item } = await documentClient.get(lookupParams).promise();
    if (!Item) {
      return lambdaResponse.sendError(`User ${email} not found`, StatusCodes.NOT_FOUND);
    }

    // update user
    await documentClient.put(updateParams).promise();
    return lambdaResponse.sendSuccess(`User ${email} updated`);

  } catch(err) {
    return lambdaResponse.sendError('Error creating new user', StatusCodes.INTERNAL_ERROR);
  }
};
