import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';

// Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true;

// Create SQL query executor
let sql: ReturnType<typeof neon>;

export function getNeonClient() {
  if (!sql) {
    sql = neon(process.env.DATABASE_URL!);
  }
  return sql;
}

// Create connection pool for more complex operations
let pool: Pool;

export function getNeonPool() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

// Helper for simple queries
export async function executeQuery<T = any>(queryText: string, params: any[] = []): Promise<T[]> {
  const client = getNeonClient();
  return client(queryText, params) as Promise<T[]>;
}

// Helper for transactions
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const pool = getNeonPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Examples of specific query helpers
export async function findById<T>(table: string, id: string): Promise<T | null> {
  const results = await executeQuery<T>(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1`, [id]);
  return results.length > 0 ? results[0] : null;
}

export async function findMany<T>(
  table: string, 
  conditions: Record<string, any> = {}, 
  options: { 
    limit?: number; 
    offset?: number; 
    orderBy?: string; 
    orderDirection?: 'ASC' | 'DESC' 
  } = {}
): Promise<T[]> {
  const { limit = 100, offset = 0, orderBy = 'id', orderDirection = 'ASC' } = options;
  
  const conditionKeys = Object.keys(conditions);
  const whereClause = conditionKeys.length 
    ? `WHERE ${conditionKeys.map((key, i) => `${key} = $${i + 1}`).join(' AND ')}` 
    : '';
  
  const values = conditionKeys.map(key => conditions[key]);
  
  const queryText = `
    SELECT * FROM ${table}
    ${whereClause}
    ORDER BY ${orderBy} ${orderDirection}
    LIMIT ${limit} OFFSET ${offset}
  `;
  
  return executeQuery<T>(queryText, values);
}

export async function insert<T>(table: string, data: Record<string, any>): Promise<T> {
  const keys = Object.keys(data);
  const columns = keys.join(', ');
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const values = keys.map(key => data[key]);
  
  const queryText = `
    INSERT INTO ${table} (${columns})
    VALUES (${placeholders})
    RETURNING *
  `;
  
  const results = await executeQuery<T>(queryText, values);
  return results[0];
}

export async function update<T>(
  table: string, 
  id: string, 
  data: Record<string, any>
): Promise<T | null> {
  const keys = Object.keys(data);
  const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = [...keys.map(key => data[key]), id];
  
  const queryText = `
    UPDATE ${table}
    SET ${setClause}
    WHERE id = $1
    RETURNING *
  `;
  
  const results = await executeQuery<T>(queryText, values);
  return results.length > 0 ? results[0] : null;
}

export async function remove(table: string, id: string): Promise<boolean> {
  await executeQuery(`DELETE FROM ${table} WHERE id = $1`, [id]);
  return true; // If no error was thrown, deletion was successful
} 