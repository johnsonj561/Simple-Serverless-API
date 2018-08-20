const getAllUsers = require('./index').handler;
const user1 = require('../../../mock-data/user1');
const invalidUser = require('../../../mock-data/invalid-user');
const AWS = require('aws-sdk-mock');

const context = {};

// restore mock after each test
afterEach(() => {
  AWS.restore();
})


it('Returns 200 if database lookup succeeds', (done) => {
  // scan returns array of items
  AWS.mock('DynamoDB.DocumentClient', 'scan', function(params, callback) {
    callback(null, { Items: [] });
  });

  const event = {};

  getAllUsers(event, context, (err, resp) => {
    const { statusCode } = resp;
    const body = JSON.parse(resp.body);
    expect(statusCode).toEqual(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    done();
  });
});


it('Will send empty array if no items are found in database', (done) => {
  // scan returns array of items
  AWS.mock('DynamoDB.DocumentClient', 'scan', function(params, callback) {
    callback(null, { });
  });

  const event = {};

  getAllUsers(event, context, (err, resp) => {
    const { statusCode } = resp;
    const body = JSON.parse(resp.body);
    expect(statusCode).toEqual(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    done();
  });
});


it('Returns 500 error if dynamo db fails', (done) => {
  const event = { };

  getAllUsers(event, context, (err, resp) => {
    const { statusCode } = resp;
    expect(statusCode).toEqual(500);
    done();
  });
});