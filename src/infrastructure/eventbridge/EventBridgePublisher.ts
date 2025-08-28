import { PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { eventBridge } from '../aws/awsClients';
import { CountryISO } from '../../utils/constants'

const EventBusName = process.env.EVENT_BUS_NAME || 'appointment-bus';

export async function publishConfirmation(detail: {
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
}) {
  await eventBridge.send(new PutEventsCommand({
    Entries: [{
      Source: 'appointment.workers',
      DetailType: 'AppointmentConfirmed',
      EventBusName,
      Detail: JSON.stringify(detail)
    }]
  }));
}
