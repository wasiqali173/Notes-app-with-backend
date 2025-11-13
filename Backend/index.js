
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import dbConnect from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const PORT = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
  })
);


dbConnect();


app.use('/auth', authRoutes);  
app.use('/users', userRoutes);  
app.use('/notes', noteRoutes);  


app.get('/', (req, res) => {
  res.send('Server is running successfully ✅');
});


export default app;  

