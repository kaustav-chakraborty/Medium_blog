import { Hono } from 'hono';
import { userRouter } from './Routes/user';
import { bookRouter } from './Routes/blogs';
import { cors } from 'hono/cors';

const app = new Hono<{
    Bindings:{
        DATABASE_URL:string;
        JWT_SECRET:string;
    }
}>();

app.use('/*',cors())
app.route("/api/v1/user",userRouter)
app.route("/api/v1/blogs",bookRouter)



export default app;
