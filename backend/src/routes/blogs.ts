import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify} from 'hono/jwt'
import { createBlogInput, updateBlogInput } from "@mohit8302/medium-common";

export const blogRouter = new Hono<{
	Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }, 
    Variables:{
        userId:String; 
    }
}>();

blogRouter.route("/blog",blogRouter);

blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        if (user) {
            c.set("userId", user.id);
            await next();
        } else {
            c.status(403);
            return c.json({
                message: "You are not logged in"
            })
        }
    } catch(e) {
        console.log(e);
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
});

blogRouter.post('/',async (c) => {
	const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const authorId=c.get("userId");
	const prisma = new PrismaClient({

		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

   const blog= await prisma.blog.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:Number(authorId)
        }
    })

    return c.json({
        id:blog.id
    })

})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
	const userId = c.get('userId');
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	try{
        const body = await c.req.json();
        prisma.blog.update({
            where: {
                id: body.id,
                authorId: Number(userId)
            },
            data: {
                title: body.title,
                content: body.content
            }
        });
        return c.json({
            title:body.title,
            content:body.content
        })
    }catch(e){
       console.log(e);
       c.status(411);
       return c.json({
        message:"error while updating the post"
       })
    }
});


// add pagination
blogRouter.get  ('/bulk',async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const blogs=await prisma.blog.findMany({
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



blogRouter.get('/:id', async (c) => {
	const id=c.req.param("id");
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	try{
        const blog=await prisma.blog.findFirst({
            where:{
                id:Number(id)
            },
            select:{
                id:true,
                title:true,
                content:true,
                author:{
                    select:{
                        name:true
                    }
                }
            }
        })
        return c.json({
            blog
        })
    }catch(e){
        c.status(411);
        return c.json({
            message:"Error while fetching the blog post"
        });
    }
})



blogRouter.delete('/:id', async (c) => {
    const id=c.req.param("id");
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!blog) {
            c.status(404);
            return c.json({ message: "Blog not found" });
        }

        if (blog.authorId !== Number(authorId)) {
            c.status(403);
            return c.json({ message: "You are not authorized to delete this blog" });
        }

        await prisma.blog.delete({
            where: {
                id: Number(id)
            }
        });

        return c.json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});


// {
//     "username":"aksba",
//     "password":"adkad",
//     "name":"sdnja"  
//  }
// {
//     "title":"its madhjabd",
//     "content":"sdnsd"
// }
