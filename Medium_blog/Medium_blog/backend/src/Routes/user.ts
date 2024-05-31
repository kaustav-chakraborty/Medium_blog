import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { jwt, sign, verify } from 'hono/jwt';
import { signinInput, signupInput } from "kaustavchakraborty99-medium";



export const userRouter =new Hono<{
	Bindings: {
		DATABASE_URL: string,
        JWT_SECRET:string
	}
}>();



userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
    const body = await c.req.json();
    const {success}=signupInput.safeParse(body)
    if(!success){
      c.status(411);
      return c.json({
        message:"inputs not correct"
      })
    }
  
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
  
    //@ts-ignore
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    
    return c.json({
      jwt: token
    });
  });
  
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    const {success}=signinInput.safeParse(body)
    if(!success){
      c.status(411);
      c.json({
        message:"invalid input"
      })
    }
    
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password
      }
    });
  
    if (!user) {
      c.status(403);
      return c.json({ error: "user not found" });
    }
  
    //@ts-ignore
    const jwtToken = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt: jwtToken });
  });
  