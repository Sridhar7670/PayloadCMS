import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
      
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'url',
          type: 'text', 
          label: 'URL',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'GitHub', value: 'github' },
          ],
          required: true,
        },
      ],
      maxRows: 5,
      admin: {
        initCollapsed: true,
      },
    },
    
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
