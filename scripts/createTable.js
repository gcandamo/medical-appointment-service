const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'fakeAccessKeyId',
  secretAccessKey: 'fakeSecretAccessKey'
});

const params = {
  TableName: 'Appointments',
  KeySchema: [
    { AttributeName: 'insuredId', KeyType: 'HASH' },
    { AttributeName: 'scheduleId', KeyType: 'RANGE' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'insuredId', AttributeType: 'S' },
    { AttributeName: 'scheduleId', AttributeType: 'N' }
  ],
  BillingMode: 'PAY_PER_REQUEST'
};

dynamoDB.createTable(params, (err, data) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table created successfully:', data);
  }
});
