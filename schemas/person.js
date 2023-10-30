import zod from 'zod'
// definied the schema person with validations
const personSchema = zod.object({
  name: zod.string({
    invalid_type_error: 'person name must be a string',
    required_error: 'person name is require'
  }),
  age: zod.number().int().min(12).max(100),
  gender: zod.enum(['male', 'female']),
  address: zod.string(),
  email: zod.string().email({
    invalid_type_error: 'email no valido',
    required_error: 'email is require'
  }),
  balance: zod.number({
    invalid_type_error: 'balance must be a number',
    required_error: 'number is require'
  }).positive()
})

export function validatePerson (object) {
  return personSchema.safeParse(object)
}

export function validatePartialPerson (object) {
  return personSchema.partial().safeParse(object)
}

export default { validatePerson, validatePartialPerson }
