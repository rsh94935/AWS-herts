import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { GetItemOutput } from "aws-sdk/clients/dynamodb";

const getUserData = async (event: APIGatewayProxyEvent, context: APIGatewayProxyResult) => {
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
    TableName: 'userDetailsTable',
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
    "fname",
    "lname",
    "add1",
    "add2",
    "city",
    "postcode",
    "preferences"
  ];

  aStrings.forEach(recordName => {
    if ( recordName === "preferences" ) {
      record[recordName] = data?.Item?.[recordName]?.SS ? data?.Item[recordName].SS : [];
    } else {
      record[recordName] = data?.Item?.[recordName]?.S ? data?.Item[recordName].S : "";
    }
  });

  return record;
}

export interface record {
  username: string,
  fname: string,
  lname: string,
  add1: string,
  add2: string,
  city: string,
  postcode: string,
  preferences: Array<string>
}

export const main = middyfy(getUserData);
