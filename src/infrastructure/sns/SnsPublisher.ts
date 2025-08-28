import { PublishCommand } from '@aws-sdk/client-sns';
import { sns } from '../aws/awsClients';
import { CountryISO } from '../../utils/constants'

export async function publishAppointmentMessage(message: any, countryISO: CountryISO) {
  let topicArn = process.env.SNS_TOPIC_ARN;

  if (!topicArn) {
    console.warn('SNS_TOPIC_ARN no está definido, usando ARN local simulado');

    const topicName = process.env.SNS_TOPIC_NAME || 'appointmentTopic';
    topicArn = `arn:aws:sns:us-east-1:000000000000:${topicName}`;
  }

  console.log('Publicando a SNS Topic ARN:', topicArn);

  const command = new PublishCommand({
    TopicArn: topicArn,
    Message: JSON.stringify(message),
    MessageAttributes: {
      countryISO: {
        DataType: 'String',
        StringValue: countryISO
      }
    }
  });

  await sns.send(command);
}
