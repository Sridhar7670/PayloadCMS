import { clickhouse } from '@/utilities/clickhouse';
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  // auth: true,
  auth:{
    useAPIKey: true, 
  },
  fields: [],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        try {
          await clickhouse.insert({
            table: 'users',
            values: [
              {
                id: doc.id,
                email: doc.email,
                api_key: doc.apiKey || '',
                created_at: new Date(doc.createdAt),
                updated_at: new Date(doc.updatedAt),
              },
            ],
            format: 'JSONEachRow',
          });
          console.log(`[ClickHouse] Synced ${operation} for user: ${doc.email}`);
        } catch (err) {
          console.error('[ClickHouse] Error syncing user:', err);
        }
      },
    ],
  },
}
