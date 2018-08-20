const updateUser = require('./index').handler;
const user1 = require('../../../mock-data/user1');
const invalidUser = require('../../../mock-data/invalid-user');
const AWS = require('aws-sdk-mock');

const context = {};

// restore mock after each test
afterEach(() => {
  AWS.restore();
})


it('Returns 200 if user exists, new user info is valid, and db write succeeds', (done) => {
  // get returns Item, user exists
  AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
    callback(null, { Item: {} });
  });
  // write returns success
  AWS.mock('DynamoDB.DocumentClient', 'put', function(params, callback) {
    callback(null);
  });

  const event = { body: user1 };

  updateUser(event, context, (err, resp) => {
    const { statusCode } = resp;
    const body = JSON.parse(resp.body);
    expect(statusCode).toEqual(200);
    expect(body.data).toMatch('updated');
    done();
  });
});




it('Returns status code 404 if user already exists', (done) => {
  // get does not return user, user does not exist
  AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
    callback(null, { });
  });

  const event = { body: user1 };

  updateUser(event, context, (err, resp) => {
    const { statusCode } = resp;
    const body = JSON.parse(resp.body);
    expect(statusCode).toEqual(404);
    expect(body.data).toMatch('not found');
    done();
  });
});


it('Returns status code 400 if user payload is invalid object', (done) => {
  const event = { body: 'this should be an object' };

  updateUser(event, context, (err, resp) => {
    const { statusCode } = resp;
    const body = JSON.parse(resp.body);
    expect(statusCode).toEqual(400);
    expect(body.data).toEqual('Invalid payload, unable to parse');
    done();
  });
});


it('Returns a status code of 400 if user object is invalid', (done) => {
  const event = { body: invalidUser };

  updateUser(event, context, (err, resp) => {
    const { statusCode } = resp;
    const body = JSON.parse(resp.body);
    expect(statusCode).toEqual(400);
    expect(body.data[0]).toMatch('required');
    done();
  });
});


it('Returns 500 error if dynamo db fails', (done) => {
  const event = { body: user1 };

  updateUser(event, context, (err, resp) => {
    const { statusCode } = resp;
    expect(statusCode).toEqual(500);
    done();
  });
});