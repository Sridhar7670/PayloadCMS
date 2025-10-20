import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'
import {Users} from "@/collections/Users"
type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  console.log(Users.slug,"this id from collections users")
  console.log(user,"this is for testing user log ")
  return Boolean(user)
}
