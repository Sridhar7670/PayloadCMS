import { authenticated } from '@/app/acess/authenticated'
import { clickhouse } from '@/utilities/clickhouse';
import type { CollectionConfig } from 'payload'

//just the date helper function noting more..
const formatCHDate = (date: string | Date): string => {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};

export const IdCard: CollectionConfig = {
  slug: 'IdCard',
  admin: {
    useAsTitle: 'userName',
    defaultColumns: ['userName', 'Address','JobTitle','position','gender','updatedAt'],
  },
  access: {
    admin: authenticated,
    read: authenticated,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
  },

  fields: [
    {
      name: 'userName',
      type: 'text',
      required: true,
      label: 'User Name',
    },
   {
      name: 'jobTitle',
      type: 'text',
      label: 'Job Title',
    },
    {
        name:'position',
        type:'text',
        required:true,
        label:'position'
    },
    {
        name: 'gender',
        type:'select',
        label:'gender',
        options:[
            {
                label :'Male',
                value:'Male',
            },
            {
                label:'Female',
                value:'Female'
            },
            {
                label:'Other',
                value:'other'
            }
        ],
    }
    ,{
        name:'Address',
        type:'textarea',
        label:'Address'
    }
  ],
    hooks: {
      afterChange: [
        async ({ doc, operation }) => {
          // 'doc' contains the full document after the change
          // 'operation' is either 'create' or 'update'
  
          console.log(`[Payload Hook] afterChange triggered for: ${doc.userName} (Operation: ${operation})`);
  
          // Escape single quotes for SQL
          const userName = (doc.userName || '').replace(/'/g, "''");
          const jobTitle = (doc.jobTitle || '').replace(/'/g, "''");
          const position = (doc.position || '').replace(/'/g,"''");
          const Address  = (doc.Address || '').replace(/'/g, "''");
          const gender = (doc.gender || '').replace(/'/g, "''");
          const updatedAt = formatCHDate(doc.updatedAt);
  
          if (operation === 'create') {
            // --- THIS IS FOR CREATING NEW DOCUMENTS ---
            try {
              await clickhouse.insert({
                table: 'IdCard',
                format: 'JSONEachRow',
                values: [
                  {
                    id: doc.id,
                    userName: userName,
                    jobTitle: jobTitle,
                    position:position,
                    Address:Address,
                    gender:gender,
                    created_at: formatCHDate(doc.createdAt),
                    updated_at: updatedAt,
                  },
                ],
              });
              console.log(`[ClickHouse] Synced 'created' for IdCard: ${doc.userName}`);
            } catch (err) {
              console.error('[ClickHouse] Error syncing create:', err);
            }
          } else if (operation === 'update') {
            // --- THIS IS FOR UPDATING EXISTING DOCUMENTS ---
            try {
              // NOTE: This assumes your 'id' field in ClickHouse is a Number.
              // If your ID is a String (UUID), you must wrap ${doc.id} in quotes: '${doc.id}'
              const updateQuery = `
                ALTER TABLE IdCard 
                UPDATE 
                  userName = '${userName}',
                  jobTitle = '${jobTitle}',
                  position = '${position}',
                  gender   = '${gender}',
                  Address  = '${Address}'
                WHERE id = ${doc.id}
              `;
  
              await clickhouse.command({
                query: updateQuery,
                // We add this to ensure the mutation completes
                // See ClickHouse docs for 'mutations_sync'
                query_params: {
                  mutations_sync: 1 
                }
              });
              console.log(`[ClickHouse] Synced 'update' for IdCard: ${doc.userName}`);
            } catch (err) {
              console.error('[ClickHouse] Error syncing update:', err);
            }
          }
        },
      ],
      afterDelete: [
        async ({ doc }) => {
          try {
            // NOTE: Changed '${doc.id}' to ${doc.id}
            // SQL syntax for numbers should not have quotes.
            await clickhouse.command({
              query: `ALTER TABLE IdCard DELETE WHERE id = ${doc.id}`,
              // Add mutations_sync here as well
              query_params: {
                mutations_sync: 1
              }
            });
            console.log(`[ClickHouse] Deleted IdCard: ${doc.userName}`);
          } catch (err) {
            console.error('[ClickHouse] Error deleting IdCard:', err);
          }
        },
      ],
    },
}