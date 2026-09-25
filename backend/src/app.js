import express from 'express';
import userRouter from "./routes/user.route.js";

const app = express();  // create an express app

app.use(express.json()); // middleware to parse JSON request body from the Client side.


//routes import


//routes declaration
app.use("/api/v1/users", userRouter);

// example route: http://localhost:4000/api/v1/users/register

export default app;