import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios, { AxiosRequestConfig } from "axios";
import { URLSearchParams } from 'url';
import { TextEncoder } from 'util';

const getAccessToken = async (event: APIGatewayProxyEvent, context: APIGatewayProxyResult) => {
  let code = "";
  let options: AxiosRequestConfig;

  if ( typeof(event.body) === "string" ) {
    code = JSON.parse(event.body).code;
  } else {
    code = event.body["code"];
  }
  let client_id = "4lefus9ve2j42qbn1p03g6aavf";
  let client_secret = "hgblsdgbf8d7ta8am2im58cauakfci6s3hjptvtl7e7mnml0nl7";
  let auth = Buffer.from(client_id + ":" + client_secret).toString('base64');
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', 'http://localhost:4200/login');
  params.append('client_id', client_id);
  params.append('code', code);

  options = {
    headers: {
      "Authorization": "Basic " + auth,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }

  let retVal = "";
  await doRequest()

  async function doRequest() {
    await axios.post("https://navigator-herts.auth.eu-west-2.amazoncognito.com/oauth2/token", params, options).then(response => {
      retVal = response.data
    })
    .catch(err => {
      retVal = err;
    })
    
  }

  return formatJSONResponse({
    message: retVal
  });
}

export const main = middyfy(getAccessToken);
