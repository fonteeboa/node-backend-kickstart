const dotenv = require('dotenv');
dotenv.config();

const { DB_CLIENT, PGHOST, PGDATABASE, PGPORT, PGUSER, PGPASSWORD, NEON_ENDPOINT_ID } = process.env;

let PGPASSWORDDECODE = decodeURIComponent(PGPASSWORD);

async function openConnection() {
  try {
    let client;

    switch (DB_CLIENT) {
      case 'neon':
        const { neon } = require('@neondatabase/serverless');
        let neonConnectionString = `postgresql://${PGUSER}:${PGPASSWORDDECODE}@${PGHOST}/${PGDATABASE}?sslmode=require`;
        if (NEON_ENDPOINT_ID) {
          neonConnectionString += `&options=project%3D${NEON_ENDPOINT_ID}`;
        }
        client = neon(neonConnectionString);
        await client`SELECT 1`;
        break;

      case 'pg':
        const { Pool } = require('pg');
        const pool = new Pool({
          host: PGHOST,
          database: PGDATABASE,
          user: PGUSER,
          password: PGPASSWORDDECODE,
          port: PGPORT,
          ssl: {
            require: true,
          },
        });
        client = await pool.connect();
        await client.query('SELECT 1');
        break;

      case 'postgres':
        const postgres = require('postgres');
        const sqlPostgresConfig = {
          host: PGHOST,
          database: PGDATABASE,
          username: PGUSER,
          password: PGPASSWORDDECODE,
          port: PGPORT,
          ssl: 'require',
        };

        // Adiciona o NEON_ENDPOINT_ID se ele existir
        if (NEON_ENDPOINT_ID) {
          sqlPostgresConfig.connection = {
            options: `project=${NEON_ENDPOINT_ID}`,
          };
        }

        const sqlPostgres = postgres(sqlPostgresConfig);
        client = sqlPostgres;
        await client`SELECT 1`;
        break;

      default:
        throw new Error('DB_CLIENT not set or unrecognized');
    }

    return { status: 'success', connection: client };
  } catch (err) {
    return { status: 'error', error: { code: 5002, message: 'Database connection failed', details: err } };
  }
}

openConnection()
  .then(result => {
    console.info(result);
    return result;
  })
  .catch(err => {
    console.error(err);
    return { status: 'error', error: err };
  });
