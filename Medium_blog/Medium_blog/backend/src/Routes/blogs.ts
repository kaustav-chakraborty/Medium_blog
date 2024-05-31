import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createblogInput,updateblogInput } from "kaustavchakraborty99-medium";

export const bookRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string
    }
}>();

bookRouter.use("/*",async (c, next) => {
    const jwt = c.req.header('Authorization') ||"";
	try{
		const user=await verify(jwt,c.env.JWT_SECRET);
	if(user){
		c.set("userId", user.id);
		await next();
	}else{
		c.status(403);
		return c.json({
			message:"you are not logged in"
		})
	}
	

	}catch(e){
		 c.status(403);
		 return c.json({
			message:"you are not logged in"
		 })
		
	}
	
	
});

bookRouter.post('/', async (c) => {
	const authorId = c.get('userId');	
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const {success}=createblogInput.safeParse(body);
	if(!success){
		c.status(411);
		return c.json({
			message:"input invalid"
		})
	}
	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: authorId
		}
	});
	return c.json({
		id: post.id
	});
})

bookRouter.put('/', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const{success}=updateblogInput.safeParse(body);
	if(!success){
		c.status(411);
		c.json({
			message:"invalid inputs"
		})
	}
	prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	return c.text('updated post');
});

bookRouter.get('/bulk',async (c) =>{
	const prisma = new PrismaClient({
		datasourceUrl:c.env.DATABASE_URL,
	}).$extends(withAccelerate())
	const blogs= await prisma.post.findMany({
		select:{
			content:true,
			title:true,
			id:true,
			author:{
				select:{
					name:true
				}
			}
		}
	});
	return c.json({
		blogs
	})
})

bookRouter.get('/:id', async (c) => {
	const id=await c.req.param("id");
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	try{
		const post = await prisma.post.findUnique({
			where: {
				id:Number(id)
			},
			select:{
				title:true,
				content:true,
				author:{
					select :{
						name:true

					}
					
				}

			}
		});
	
		return c.json({
			post
		});
		
	}catch(e){
		c.status(411);
		return c.json({
			message:"error while sending the request"
		})
	}

	
})
