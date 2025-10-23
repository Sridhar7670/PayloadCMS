

// import type { CollectionConfig } from 'payload';
// import { clickhouse } from '@/utilities/clickhouse';

// export const Skills: CollectionConfig = {
//   slug: 'skills',
//   admin: {
//     useAsTitle: 'skillName',
//     defaultColumns: ['skillName', 'updatedAt'],
//   },
//   access: {
//     read: () => true,
//     create: () => true,
//   },
//   fields: [
//     {
//       name: 'skillName',
//       type: 'text',
//       required: true,
//       label: 'Skill Name',
//     },
//     {
//       name: 'description',
//       type: 'textarea',
//       label: 'Description',
//     },
//   ],
//   hooks: {
//     afterChange: [
//       async ({ doc, operation }) => {
//         console.log(`[Payload Hook] afterChange triggered for: ${doc.skillName}`);

//       try {
//             await clickhouse.insert({
//               table: 'skills',
//               //  Added  this format option to ensure the server knows how to read the payload. i guess 
//               format: 'JSONEachRow', 
//               values: [
//                 {
//                   // Payload's doc.id is usually a number or string (like a UUID string)
//                   id: doc.id, 
//                   skillName: String(doc.skillName),
//                   description: String(doc.description || ''),
//                   // IMPORTANT: ClickHouse prefers ISO 8601 strings for insertion
//                  created_at: new Date(doc.createdAt).toISOString().replace('T', ' ').replace('Z', ''), 
//                   updated_at: new Date(doc.updatedAt).toISOString().replace('T', ' ').replace('Z', ''),
//                 },
//               ],
//             });
//             console.log(`[ClickHouse] Synced ${operation} for skill: ${doc.skillName}`);
//       } catch (err) {
//           console.error('[ClickHouse] Error syncing skill:', err);
//         }
//       },
//     ],
//     afterDelete: [
//       async ({ doc }) => {
//         try {
//           await clickhouse.command({
//             query: `ALTER TABLE skills DELETE WHERE id = '${doc.id}'`,
//           });
//           console.log(`[ClickHouse] Deleted skill: ${doc.skillName}`);
//         } catch (err) {
//           console.error('[ClickHouse] Error deleting skill:', err);
//         }
//       },
//     ],
//   },
// };


import type { CollectionConfig } from 'payload';
import { clickhouse } from '@/utilities/clickhouse';

// Helper function to format dates for ClickHouse (YYYY-MM-DD HH:MM:SS)
const formatCHDate = (date: string | Date): string => {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'skillName',
    defaultColumns: ['skillName', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true, // Ensure update access is enabled
    delete: () => true, // Ensure delete access is enabled
  },
  fields: [
    {
      name: 'skillName',
      type: 'text',
      required: true,
      label: 'Skill Name',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // 'doc' contains the full document after the change
        // 'operation' is either 'create' or 'update'

        console.log(`[Payload Hook] afterChange triggered for: ${doc.skillName} (Operation: ${operation})`);

        // Escape single quotes for SQL
        const skillName = (doc.skillName || '').replace(/'/g, "''");
        const description = (doc.description || '').replace(/'/g, "''");
        const updatedAt = formatCHDate(doc.updatedAt);

        if (operation === 'create') {
          // --- THIS IS FOR CREATING NEW DOCUMENTS ---
          try {
            await clickhouse.insert({
              table: 'skills',
              format: 'JSONEachRow',
              values: [
                {
                  id: doc.id,
                  skillName: skillName,
                  description: description,
                  created_at: formatCHDate(doc.createdAt),
                  updated_at: updatedAt,
                },
              ],
            });
            console.log(`[ClickHouse] Synced 'create' for skill: ${doc.skillName}`);
          } catch (err) {
            console.error('[ClickHouse] Error syncing create:', err);
          }
        } else if (operation === 'update') {
          // --- THIS IS FOR UPDATING EXISTING DOCUMENTS ---
          try {
            // NOTE: This assumes your 'id' field in ClickHouse is a Number.
            // If your ID is a String (UUID), you must wrap ${doc.id} in quotes: '${doc.id}'
            const updateQuery = `
              ALTER TABLE skills 
              UPDATE 
                skillName = '${skillName}',
                description = '${description}',
                updated_at = '${updatedAt}'
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
            console.log(`[ClickHouse] Synced 'update' for skill: ${doc.skillName}`);
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
            query: `ALTER TABLE skills DELETE WHERE id = ${doc.id}`,
            // Add mutations_sync here as well
            query_params: {
              mutations_sync: 1
            }
          });
          console.log(`[ClickHouse] Deleted skill: ${doc.skillName}`);
        } catch (err) {
          console.error('[ClickHouse] Error deleting skill:', err);
        }
      },
    ],
  },
};