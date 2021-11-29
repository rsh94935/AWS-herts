import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios, { AxiosRequestConfig } from "axios";
import { URLSearchParams } from 'url';

const getAccessToken = async (event: APIGatewayProxyEvent, context: APIGatewayProxyResult) => {
  let code = "";
  let options: AxiosRequestConfig;
  //Recieve the request body and convert it from string to json for ease of readability
  if ( typeof(event.body) === "string" ) {
    code = JSON.parse(event.body).code;
  } else {
    code = event.body["code"];
  }
  let client_id = "4lefus9ve2j42qbn1p03g6aavf";
  //Client secret has to be kept server side to keep it secure, must not be known to clients
  let client_secret = "hgblsdgbf8d7ta8am2im58cauakfci6s3hjptvtl7e7mnml0nl7";
  //Create the authorization code =
  let auth = Buffer.from(client_id + ":" + client_secret).toString('base64');
  const params = new URLSearchParams();
  //Setup request parameters
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', 'http://localhost:4200/login');
  params.append('client_id', client_id);
  params.append('code', code);

  //Setup headers for API call
  options = {
    headers: {
      "Authorization": "Basic " + auth,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }

  let retVal = "";
  await doRequest()

  //Make API request to the access token inbuilt endpoint to get access token, with params and headers
  async function doRequest() {
    await axios.post("https://navigator-herts.auth.eu-west-2.amazoncognito.com/oauth2/token", params, options).then(response => {
      retVal = response.data
    })
    .catch(err => {
      retVal = err;
    })
    
  }
  //Return response from API call
  return formatJSONResponse({
    message: retVal
  });
}

export const main = middyfy(getAccessToken);
