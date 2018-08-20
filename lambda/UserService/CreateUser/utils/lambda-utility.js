/**
 * HTTP Status Codes
 */
const StatusCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};


/**
 * Response Headers
 */
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};


/**
 * Response Utility Constructor
 * @param {Function} callback Lambda callback reference
 */
const LambdaResponse = function LambdaResponse(callback) {
  this.callback = callback;
};

/**
 * Execute lambda callback with error message
 * @param {*} data response data
 * @param {Number} statusCode
 */
LambdaResponse.prototype.sendError = function sendError(data, statusCode = StatusCodes.BAD_REQUEST) {
  const body = JSON.stringify({ data });
  const response = { statusCode, headers, body };
  this.callback(null, response);
};


/**
 * Execute lambda callback with success data
 * @param {*} data response data
 * @param {Number} statusCode
 */
LambdaResponse.prototype.sendSuccess = function sendSuccess(data, statusCode = StatusCodes.OK) {
  const body = JSON.stringify({ data });
  const response = { statusCode, headers, body };
  this.callback(null, response);
};



module.exports = {
  StatusCodes,
  LambdaResponse
};
