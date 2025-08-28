# Medical Appointment Service

Proyecto encargado de registrar citas medicas usando serverless
## Despliegue

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Exportar variables de conexión a RDS:
   ```bash
   export DB_PE_HOST=...
   export DB_PE_USER=...
   export DB_PE_PASSWORD=...
   export DB_PE_DATABASE=...
   export DB_CL_HOST=...
   export DB_CL_USER=...
   export DB_CL_PASSWORD=...
   export DB_CL_DATABASE=...
   ```
3. Desplegar:
   ```bash
   serverless deploy
   ```

## Endpoints

- **POST** `/appointment` → body `{ insuredId: "01234", scheduleId: 100, countryISO: "PE" }`
- **GET** `/appointment/{insuredId}`

## Pruebas

```bash
npm test
```

## Desarrollado por: Gianfranco Candamo
[Linkedin](www.linkedin.com/in/gianfranco-candamo-moran-63731b1b2)