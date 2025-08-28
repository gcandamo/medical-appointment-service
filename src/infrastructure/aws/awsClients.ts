import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SNSClient } from "@aws-sdk/client-sns";
import { SQSClient } from "@aws-sdk/client-sqs";
import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { DEFAULT_REGION } from '../../utils/constants'

const isOffline = process.env.IS_OFFLINE === "true";

const region = process.env.AWS_REGION || DEFAULT_REGION;

const localConfig = {
  region,
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "fakeAccessKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
};

const localSnsConfig = {
  region,
  endpoint: "http://localhost:4002",
  credentials: {
    accessKeyId: "fakeAccessKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
};

const dynamoClient = new DynamoDBClient(isOffline ? localConfig : { region });
export const dynamo = DynamoDBDocumentClient.from(dynamoClient);

export const sns = new SNSClient(isOffline ? localSnsConfig : { region });

export const sqs = new SQSClient(isOffline ? localConfig : { region });

export const eventBridge = new EventBridgeClient(isOffline ? localConfig : { region });

export async function listTables(): Promise<string[]> {
  try {
    const result = await dynamoClient.send(new ListTablesCommand({}));
    return result.TableNames ?? [];
  } catch (err) {
    console.error("Error listing tables:", err);
    throw err;
  }
}
