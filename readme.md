### Simple User API with API Gateway, Lambda, Jest, and Swagger

CRUD API was documented with [SwaggerHub] and then imported to Amazon's API Gateway, allowing quick scaffolding of API from Swagger definition.

[Click to view the API's Swagger Definition].

[Serverless] API built with Amazon's API Gateway and Lambda functions.

[NPM jsonschema] package used to validate user model. It was assumed that all fields are required.

100% Lambda coverage achieved with [Jest] testing framework. Jest was chosen because it is an all in one solution: including test runner, assertions, and coverage reports.

 ----

To view test coverage:
1. Download project
2. install dependencies 
   ```
   npm install
   ```
3. run unit tests to build coverage report
   ```
   npm run test
   ```
4. view coverage report in browser (requires chrome)
   ```
   npm run view-coverage
   ```

----

If forking for personal use, the following credentials must be defined in project root file 'aws-config.sh' in order to deploy lambdas with npm scripts
```
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_DEFAULT_REGION=
```


[SwaggerHub]: https://swagger.io/tools/swaggerhub/
[Click to view the API's Swagger Definition]: https://app.swaggerhub.com/apis/ThisOrgName/test-api/1.0.0
[npm jsonschema]: https://www.npmjs.com/package/jsonschema
[Serverless]: https://aws.amazon.com/serverless/
[Jest]: https://jestjs.io/en/