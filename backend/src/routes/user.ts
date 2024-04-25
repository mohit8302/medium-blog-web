import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign} from 'hono/jwt'
import z from "zod"; 
import { signupInput, signinInput } from "@mohit8302/medium-common";

export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
        JWT_SECRET:string;
	}
}>();

userRouter.route("/api/v1/user",userRouter);



userRouter.post('/signup', async (c) => {

	const body = await c.req.json();
    const {success}=signinInput.safeParse(body);
    if(!success){
       c.status(411);
       return c.json({
        message:"invaid Credentials"
       })
    }
	const prisma = new PrismaClient({

		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	
	try {
		const user= await prisma.user1.create({
			data: {
				username: body.username,
				password: body.password,
				name: body.name,
			}
		})
		const jwt=await sign({
			id:user.id,
		},c.env.JWT_SECRET)

		return c.text(jwt)
	} catch(e) {	
		console.log(e);
		c.status(411);
		return c.json({ error: "error while signing up" });
	}
})


userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const user = await prisma.user1.findFirst({
		where: {
			username: body.username,
			password:body.password
		}
	})

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})




