import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import errorHandler from './middleware/errorhandler.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // parse JSON requests

//User Routes
app.use("/user", userRoutes);


//Contact Routes
app.use("/contact",contactRoutes);


app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));