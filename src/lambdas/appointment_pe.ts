import { SQSHandler } from 'aws-lambda';
import { insertAppointmentToRDS } from '../infrastructure/rds/RDSAppointmentRepository';
import { publishConfirmation } from '../infrastructure/eventbridge/EventBridgePublisher';

export const main: SQSHandler = async (event) => {
  for (const r of event.Records) {
    const payload = JSON.parse(r.body);
    await insertAppointmentToRDS({ insuredId: payload.insuredId, scheduleId: payload.scheduleId, countryISO: 'PE' });
    await publishConfirmation({ insuredId: payload.insuredId, scheduleId: payload.scheduleId, countryISO: 'PE' });
  }
};
