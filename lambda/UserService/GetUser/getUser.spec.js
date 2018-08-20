const getUser = require('./index').handler;
const user1 = require('../../../mock-data/user1');
const invalidUser = require('../../../mock-data/invalid-user');
const AWS = require('aws-sdk-mock');

const context = {};

// restore mock after each test
afterEach(() => {
  AWS.restore();
})


it('Returns 200 if lookup success', (done) => {
  // get returns Item, user exists
  AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
    callback(null, { Item: {} });
  });
  const event = { pathParameters: { email: 'johnson@aol.com' } };

  getUser(event, context, (err, resp) => {
    const { statusCode } = resp;
    const body = JSON.parse(resp.body);
    expect(statusCode).toEqual(200);
    expect(body.data).toBeTruthy();
    done();
  });
});


it('Returns status code 404 if user is not found', (done) => {
  // get returns nothing, user is not found
  AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
    callback(null, {});
  });
  const event = { pathParameters: { email: 'johnson@aol.com' } };

  getUser(event, context, (err, resp) => {
    const { statusCode } = resp;
    const body = JSON.parse(resp.body);
    expect(statusCode).toEqual(404);
    expect(body.data).toMatch('not found');
    done();
  });
});


it('Returns a status code of 400 if email is not provided', (done) => {
  const event = { pathParameters: {} };

  getUser(event, context, (err, resp) => {
    const { statusCode } = resp;
    const body = JSON.parse(resp.body);
    expect(statusCode).toEqual(400);
    expect(body.data).toMatch('Required');
    done();
  });
});


it('Returns 500 error if dynamo db fails', (done) => {
  const event = { pathParameters: { email: 'johnson@aol.com' } };

  getUser(event, context, (err, resp) => {
    const { statusCode } = resp;
    expect(statusCode).toEqual(500);
    done();
  });
});