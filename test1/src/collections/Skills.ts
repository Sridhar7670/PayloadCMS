// import { authenticated } from '@/app/acess/authenticated'
// import { clickhouse } from '@/utilities/clickhouse';
// import type { CollectionConfig } from 'payload'

// export const Skills: CollectionConfig = {
//   slug: 'skills',
//   admin: {
//     useAsTitle: 'skillName',
//     defaultColumns: ['skillName', 'updatedAt'],
//   },
//   access: {
//     read: () => true,
//     create:()=>true
//   },
//   fields: [
//     {
//       name: 'skillName',
//       type: 'text',
//       required: true,
//       label: 'Skill Name',
//     },
//    {
//       name: 'description',
//       type: 'textarea',
//       label: 'Description',
//     },
//   ],
//   hooks: {
//     /** Trigger after create/update */
// afterChange: [
//   async ({ doc, operation }) => {
//     console.log(`[Payload Hook] afterChange triggered for: ${doc.skillName}`);
//     try {
//       await clickhouse.insert({
//         table: 'skills',
//         values: [
//           {
//             id: String(doc.id),
//             skillName: String(doc.skillName),
//             description: String(doc.description || ''),
//             created_at: new Date(doc.createdAt),
//             updated_at: new Date(doc.updatedAt),
//           },
//         ],
//       });
//       console.log(`[ClickHouse] Synced ${operation} for skill: ${doc.skillName}`);
//     } catch (err) {
//       console.error('[ClickHouse] Error syncing skill:', err);
//     }
//   },
// ],



//     /**  remove from ClickHouse when deleted */
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

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'skillName',
    defaultColumns: ['skillName', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
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
        console.log(`[Payload Hook] afterChange triggered for: ${doc.skillName}`);

      try {
            await clickhouse.insert({
              table: 'skills',
              //  Added  this format option to ensure the server knows how to read the payload. i guess 
              format: 'JSONEachRow', 
              values: [
                {
                  // Payload's doc.id is usually a number or string (like a UUID string)
                  id: doc.id, 
                  skillName: String(doc.skillName),
                  description: String(doc.description || ''),
                  // IMPORTANT: ClickHouse prefers ISO 8601 strings for insertion
                 created_at: new Date(doc.createdAt).toISOString().replace('T', ' ').replace('Z', ''), 
                  updated_at: new Date(doc.updatedAt).toISOString().replace('T', ' ').replace('Z', ''),
                },
              ],
            });
            console.log(`[ClickHouse] Synced ${operation} for skill: ${doc.skillName}`);
      } catch (err) {
          console.error('[ClickHouse] Error syncing skill:', err);
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          await clickhouse.command({
            query: `ALTER TABLE skills DELETE WHERE id = '${doc.id}'`,
          });
          console.log(`[ClickHouse] Deleted skill: ${doc.skillName}`);
        } catch (err) {
          console.error('[ClickHouse] Error deleting skill:', err);
        }
      },
    ],
  },
};
