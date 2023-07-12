import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as path from "path";

require('dotenv').config();

const DBENDPOINT = process.env.DBENDPOINT!;
const DBUSER = process.env.DBUSER!;
const DBMASTERPASS = process.env.DBMASTERPASS!;

export class AlamiLamdaIntegrationSqlStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nestAppLambda = new NodejsFunction(this, 'nestApp', {
      functionName: 'nestAppLambda',
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../../dist/main.js'),
      handler: 'handler',
      environment: {
        DBENDPOINT,
        DBUSER,
        DBMASTERPASS
      },
      bundling: {
        externalModules: [
          '@nestjs/websockets/socket-module',
          '@nestjs/microservices/microservices-module',
          '@nestjs/microservices',
          'class-transformer',
          'class-validator',
        ]
      }
    });

    const api = new apiGateway.LambdaRestApi(this, 'NestApiGateway', {
      handler: nestAppLambda,
    });
  }
}
