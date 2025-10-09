import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'skillName',
    defaultColumns: ['skillName', 'category', 'level', 'updatedAt'],
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
      name: 'skillImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Skill Image/Icon',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Database', value: 'database' },
        { label: 'DevOps', value: 'devops' },
      ],
    },
    {
      name: 'level',
      type: 'radio',
      label: 'Skill Level',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Expert', value: 'expert' },
      ],
      defaultValue: 'beginner',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Reference Link',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
    },
  ],
}
