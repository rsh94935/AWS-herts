import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { PutItemInputAttributeMap } from "aws-sdk/clients/dynamodb";

const setUserData = async (event: APIGatewayProxyEvent, context: APIGatewayProxyResult) => {
  var AWS = require('aws-sdk');
  AWS.config.update({region: 'eu-west-2'});
  let ddb: DynamoDB = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
  let newRecord: record = {} as record;
  let obj = {};
  let username = "";

  if ( typeof(event.body) === "string" ) {
    obj = JSON.parse(event.body);
  } else {
    obj = event.body;
  }
  username = obj["username"];
  
  for ( let key in obj ) {
    newRecord[key] = obj[key];
  }

  let params = {
    TableName: 'userDetailsTable',
    Item: mapToRecord(newRecord, username)
  };

  let retVal = await new Promise((resolve, reject) => {
    ddb.putItem(params, function (err, data) {
      if ( err ) {
        reject(err.message);
      } else {
        resolve(data);
      }
    });
  });

  return formatJSONResponse({
    message: retVal
  });
}

function mapToRecord(record: record, username: string) {
  const mapped: PutItemInputAttributeMap = {
    username: { S: username },
    fname: { S: JSON.stringify(record.fname) },
    lname: { S: JSON.stringify(record.lname) }
  }

  return mapped;
}

export interface record {
  username: string,
  fname: string,
  lname: string
}

export const main = middyfy(setUserData);
