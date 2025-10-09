// src/components/ContactSection.tsx
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { FormBlock } from '@/blocks/Form/Component'
import type { Form } from '@/payload-types'
export async function ContactSection() {
  const payload = await getPayload({ config: configPromise })

  // Find the form with the title 'Contact Form'
  const { docs: forms } = await payload.find({
    collection: 'forms',
    where: {
      title: {
        equals: 'Contact Form',
      },
    },
    limit: 1,
  })

  const contactForm = forms[0] as Form 

  if (!contactForm) {
    return null // Form lekapothe em chupinchadu
  }

  return (
    <div className="container py-16">
      <FormBlock
        form={contactForm}
        enableIntro={false}
        blockType="formBlock"
      />
    </div>
  )
}