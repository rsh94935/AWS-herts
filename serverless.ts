import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import getAccessToken from '@functions/getAccessToken';
import getUserData from '@functions/getUserData';
import setUserData from '@functions/setUserData';
import getUserVisited from '@functions/getUserVisited';
import setUserVisited from '@functions/setUserVisited';

const serverlessConfiguration: AWS = {
  service: 'projects',
  frameworkVersion: '2',
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
  },
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-2',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [{
      Effect: "Allow",
      Action: ["dynamodb:Query", "dynamodb:Scan", "dynamodb:GetItem", "dynamodb:PutItem"],
      Resource: "*"
    }],
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { hello, getAccessToken, getUserData, setUserData, getUserVisited, setUserVisited },
  resources: {
    Resources: {
      userDetailsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [{
            AttributeName: 'username',
            AttributeType: 'S'
          }],
          KeySchema: [{
            AttributeName: 'username',
            KeyType: 'HASH'
          }],
          TableName: "userDetailsTable",
          BillingMode: 'PAY_PER_REQUEST'
        }
      },
      userVisitedTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [{
            AttributeName: 'username',
            AttributeType: 'S'
          }],
          KeySchema: [{
            AttributeName: 'username',
            KeyType: 'HASH'
          }],
          TableName: "userVisitedTable",
          BillingMode: 'PAY_PER_REQUEST'
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
