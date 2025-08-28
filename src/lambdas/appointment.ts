import dotenv from 'dotenv';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  SQSHandler,
} from "aws-lambda";
import { v4 as uuid } from "uuid";
import { ok, badRequest } from "../utils/response";
import { Appointment } from "../domain/entities/Appointment";
import { DynamoAppointmentRepository } from "../infrastructure/dynamodb/DynamoAppointmentRepository";
import { AppointmentSchema } from "../application/validation";
import { publishAppointmentMessage } from "../infrastructure/sns/SnsPublisher";
import { listTables } from '../infrastructure/aws/awsClients';
import { HTTP_METHOD } from '../utils/constants'

dotenv.config();
const repo = new DynamoAppointmentRepository();

export const httpHandler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const httpMethod = event.requestContext.http.method;
    console.log("Método HTTP recibido:", httpMethod);
    console.log('process.env.IS_OFFLINE** ', process.env.IS_OFFLINE);
    console.log("Evento completo:", JSON.stringify(event));

    if (httpMethod === HTTP_METHOD.POST) {
      const body = event.body ? JSON.parse(event.body) : {};
      
      const parsed = AppointmentSchema.safeParse(body);
      if (!parsed.success) {
        return badRequest(
          parsed.error.errors.map((e) => e.message).join("; ")
        );
      }
      
      if (process.env.IS_OFFLINE === 'true') {        
        (async () => {
          const tables = await listTables();
          console.log(' Tablas en DynamoDB:', tables); // solo local
        })();
      }

      const { insuredId, scheduleId, countryISO } = parsed.data;
      const item: Appointment = {
        id: uuid(),
        insuredId,
        scheduleId,
        countryISO,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await repo.savePending(item);
      console.log('Appointment guardado');

      await publishAppointmentMessage(
        { insuredId, scheduleId, countryISO },
        countryISO
      );

      return ok({
        message: "Registro de cita en proceso",
        insuredId,
        scheduleId,
        countryISO,
      });
    }

    if (httpMethod ===HTTP_METHOD.GET) {
      const insuredId = event.pathParameters?.insuredId;
      if (!insuredId) return badRequest("insuredId es requerido");
      const items = await repo.listByInsuredId(insuredId);
      return ok(items);
    }

    return badRequest("Ruta no soportada");
  } catch (err: any) {
    console.error("Error saving appointment:", JSON.stringify(err));
    console.error("Error en handler:", err);
    return badRequest("Error interno");
  }
};

export const confirmHandler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);

    const detail =
      body?.detail ??
      JSON.parse(body.Message ?? "{}")?.detail ??
      body;

    const { insuredId, scheduleId } = detail;
    await repo.updateStatus(insuredId, scheduleId, "completed");
  }
};
