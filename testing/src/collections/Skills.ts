import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'skillName',
    defaultColumns: ['skillName', 'updatedAt'],
  },
  access: {
    read: () => true,
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
}
