import { authenticated } from '@/app/acess/authenticated'
import type { CollectionConfig } from 'payload'

export const IdCard: CollectionConfig = {
  slug: 'IdCard',
  admin: {
    useAsTitle: 'userName',
    defaultColumns: ['userName', 'address','Jobtitle','position','gender','updatedAt'],
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
      name: 'job Title',
      type: 'text',
      label: 'Job Title',
    },
    {
        name:'position',
        type:'text',
        required:true,
        label:'position ivvu'
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
}
// src/collections/IdCard.ts

// import type { CollectionConfig } from 'payload'

// export const IdCard: CollectionConfig = {
//   slug: 'id-card', // Slugs are usually lowercase and hyphenated
//   admin: {
//     useAsTitle: 'userName',
//     // Added your new fields to the default view
//     defaultColumns: ['userName', 'jobTitle', 'position', 'userImage', 'updatedAt'],
//   },
//   access: {
//     read: () => true,
//     // write:()=>
//   },
//   fields: [
//     {
//       name: 'userName',
//       type: 'text',
//       required: true,
//       label: 'User Name', // Changed label for clarity
//     },
//     {
//       name: 'userImage',
//       type: 'upload', // This field type is for images/files
//       relationTo: 'media', // Links to the 'media' collection below
//       required: true,
//       label: 'User Image',
//     },
//     {
//       name: 'jobTitle',
//       type: 'text',
//       required: true,
//       label: 'Job Title',
//     },
//     {
//         name: 'position',
//         type: 'text',
//         required: true,
//         label: 'Position',
//     },
//     {
//       name: 'gender',
//       type: 'select', // 'select' is great for predefined options
//       label: 'Gender',
//       options: [
//         {
//           label: 'Male',
//           value: 'male',
//         },
//         {
//           label: 'Female',
//           value: 'female',
//         },
//         {
//           label: 'Other',
//           value: 'other',
//         },
//       ],
//     },
//     {
//       name: 'address',
//       type: 'textarea',
//       label: 'Address',
//     },
//   ],
// }