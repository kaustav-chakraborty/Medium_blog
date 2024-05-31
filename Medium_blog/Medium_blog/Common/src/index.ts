import z from "zod"

export  const signupInput=z.object({
  email:z.string().email(),
  password:z.string().min(6),
  name:z.string().optional()

})

export type signupInput=z.infer<typeof signupInput>

export  const signinInput=z.object({
    email:z.string().email(), 
    password:z.string().min(6),
    name:z.string().optional()
  
  })
  
  export type siginInput=z.infer<typeof signinInput>
  
  export const createblogInput=z.object({
    title:z.string(),
    content:z.string(),

  })

  export type createblogInput=z.infer<typeof createblogInput>

  export const updateblogInput=z.object({
    title:z.string(),
    content:z.string(),
    id:z.number()

  })

  export type updateblogInput=z.infer<typeof updateblogInput >