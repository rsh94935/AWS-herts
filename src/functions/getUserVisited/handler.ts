import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { GetItemOutput } from "aws-sdk/clients/dynamodb";

const getUserVisited = async (event: APIGatewayProxyEvent, context: APIGatewayProxyResult) => {
  var AWS = require('aws-sdk');
  AWS.config.update({region: 'eu-west-2'});
  let ddb: DynamoDB = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
  let existingRecord: record = {} as record;
  let username = "";

  if ( typeof(event.body) === "string" ) {
    username = JSON.parse(event.body).username;
  } else {
    username = event.body["username"];
  }
  existingRecord.username = username;
  let params = {
    TableName: 'userVisitedTable',
    Key: {
      'username': { S: existingRecord.username }
    }
  };

  let retVal = await new Promise((resolve, reject) => {
    ddb.getItem(params, function (err, data) {
      if ( err ) {
        reject(err.message);
      } else {
        existingRecord = mapFromRecord(data);
        resolve(existingRecord);
      }
    });
  });

  return formatJSONResponse({
    message: retVal
  });
}

function mapFromRecord(data: GetItemOutput): record {
  let record: record = {} as record;
  let aStrings = [
    "username",
    "visited"
  ];

  aStrings.forEach(recordName => {
    if ( recordName === "visited" ) {
      record[recordName] = data?.Item?.[recordName]?.SS ? data?.Item[recordName].SS : [];
    } else {
      record[recordName] = data?.Item?.[recordName]?.S ? data?.Item[recordName].S : "";
    }
  });

  return record;
}

export interface record {
  username: string,
  visited: Array<string>
}

export const main = middyfy(getUserVisited);
