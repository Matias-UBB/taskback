import express from "express";
import dotenv from "dotenv";
import concetdb from "./database/db";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import { errorHandler } from "./middleware/errorHandler";


dotenv.config();

const app = express();
concetdb();
app.use(express.json());
app.use(errorHandler);
app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/task', taskRoutes);



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

