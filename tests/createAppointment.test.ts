import { httpHandler } from '../src/lambdas/appointment';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

jest.mock('../src/infrastructure/dynamodb/DynamoAppointmentRepository', () => {
  return {
    DynamoAppointmentRepository: jest.fn().mockImplementation(() => {
      return {
        savePending: jest.fn().mockResolvedValue(true),
        listByInsuredId: jest.fn().mockResolvedValue([{ insuredId: '12', scheduleId: 1, status: 'pending' }]),
        updateStatus: jest.fn().mockResolvedValue(true),
      };
    }),
  };
});

jest.mock('../src/infrastructure/sns/SnsPublisher', () => {
  return {
    publishAppointmentMessage: jest.fn().mockResolvedValue(true),
  };
});

describe('httpHandler', () => {

  beforeAll(() => {
    process.env.IS_OFFLINE = 'false';
  });

  it('should return 400 if insuredId is invalid in POST request', async () => {
    const event: APIGatewayProxyEventV2 = {
      requestContext: {
        http: {
          method: 'POST',
        },
      },
      body: JSON.stringify({ insuredId: '12', scheduleId: 1 }),
    } as any;

    const res = await httpHandler(event) as any;
    expect(res.statusCode).toBe(400);
    const responseBody = JSON.parse(res.body);
    expect(responseBody.error).toEqual('insuredId debe ser un string de 5 digitos; Required');
  });

  it('should create an appointment successfully (POST)', async () => {
    const event: APIGatewayProxyEventV2 = {
      requestContext: {
        http: {
          method: 'POST',
        },
      },
      body: JSON.stringify({
        insuredId: "01234",
        scheduleId: 100,
        countryISO: "PE"
      }),
    } as any;

    const res = await httpHandler(event) as any;
    expect(res.statusCode).toBe(200);
    const responseBody = JSON.parse(res.body);
    expect(responseBody.message).toBe('Registro de cita en proceso');
    expect(responseBody.insuredId).toBe('01234');
    expect(responseBody.scheduleId).toBe(100);
    expect(responseBody.countryISO).toBe('PE');
  });

  it('should return 400 if insuredId is missing in GET request', async () => {
    const event: APIGatewayProxyEventV2 = {
      requestContext: {
        http: {
          method: 'GET',
        },
      },
      pathParameters: null,
    } as any;

    const res = await httpHandler(event) as any;
    expect(res.statusCode).toBe(400); 
    const responseBody = JSON.parse(res.body);
    expect(responseBody.error).toBe('insuredId es requerido');
  });

  it('should return list of appointments for a valid insuredId (GET)', async () => {
    const event: APIGatewayProxyEventV2 = {
      requestContext: {
        http: {
          method: 'GET',
        },
      },
      pathParameters: { insuredId: '12' },
    } as any;

    const res = await httpHandler(event) as any;
    expect(res.statusCode).toBe(200);
    const responseBody = JSON.parse(res.body);
    expect(responseBody).toEqual([{
      insuredId: '12',
      scheduleId: 1,
      status: 'pending',
    }]);
  });
});
