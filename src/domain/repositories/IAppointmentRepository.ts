import { Appointment } from '../entities/Appointment';

export interface IAppointmentRepository {
  savePending(item: Appointment): Promise<void>;
  updateStatus(insuredId: string, scheduleId: number, status: 'completed'): Promise<void>;
  listByInsuredId(insuredId: string): Promise<Appointment[]>;
}
