import { Appointment } from '../../domain/entities/Appointment';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { dynamo } from '../aws/awsClients';
import {
  PutCommand,
  UpdateCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb';

const TableName = 'Appointments';

export class DynamoAppointmentRepository implements IAppointmentRepository {
  async savePending(item: Appointment): Promise<void> {
    console.log('item*** ', item);
    await dynamo.send(new PutCommand({
      TableName,
      Item: item
    }));
  }

  async updateStatus(insuredId: string, scheduleId: number, status: 'completed'): Promise<void> {
    await dynamo.send(new UpdateCommand({
      TableName,
      Key: { insuredId, scheduleId },
      UpdateExpression: 'SET #s = :s, updatedAt = :u',
      ExpressionAttributeNames: {
        '#s': 'status'
      },
      ExpressionAttributeValues: {
        ':s': status,
        ':u': new Date().toISOString()
      }
    }));
  }

  async listByInsuredId(insuredId: string): Promise<Appointment[]> {
    const res = await dynamo.send(new QueryCommand({
      TableName,
      KeyConditionExpression: 'insuredId = :id',
      ExpressionAttributeValues: {
        ':id': insuredId
      }
    }));

    return (res.Items as Appointment[]) ?? [];
  }
}
