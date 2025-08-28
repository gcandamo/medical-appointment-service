import mysql from 'mysql2/promise';
import { CountryISO } from '../../utils/constants'

function getConnInfo(country: CountryISO) {
  if (country === 'PE') {
    return {
      host: process.env.DB_PE_HOST!,
      user: process.env.DB_PE_USER!,
      password: process.env.DB_PE_PASSWORD!,
      database: process.env.DB_PE_DATABASE!
    };
  }
  return {
    host: process.env.DB_CL_HOST!,
    user: process.env.DB_CL_USER!,
    password: process.env.DB_CL_PASSWORD!,
    database: process.env.DB_CL_DATABASE!
  };
}

export async function insertAppointmentToRDS(payload: {
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
}) {
  const conn = await mysql.createConnection(getConnInfo(payload.countryISO));
  try {
    await conn.execute(
      `CREATE TABLE IF NOT EXISTS appointments (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        insured_id VARCHAR(10) NOT NULL,
        schedule_id BIGINT NOT NULL,
        country_iso CHAR(2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
    await conn.execute(
      'INSERT INTO appointments (insured_id, schedule_id, country_iso) VALUES (?, ?, ?)',
      [payload.insuredId, payload.scheduleId, payload.countryISO]
    );
  } finally {
    await conn.end();
  }
}
