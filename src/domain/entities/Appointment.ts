import { CountryISO, APPOINTMENT_STATUS_TYPE } from '../../utils/constants'

export interface Appointment {
  insuredId: string;          // string de 5 digitos
  scheduleId: number;   
  countryISO: CountryISO;     // 'PE' | 'CL'
  status: APPOINTMENT_STATUS_TYPE;
  createdAt: string;
  updatedAt?: string;
  id?: string;
}
