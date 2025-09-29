import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // parse JSON requests

app.use("/api/users", userRoutes);


app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));