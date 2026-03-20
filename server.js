import express from 'express'
import dotenv from 'dotenv'
import cloudinary from "cloudinary";
import cors from 'cors';
import compression from "compression";
import connectDataBase from './config/connectDataBase.js'
import { errorMiddleware } from './error/error.js'
import agentRoutes from './routes/agent.routes.js'
import adminRoutes from './routes/admin.routes.js'
import userRoutes from './routes/user.routes.js'
import leadRoutes from './routes/lead.routes.js'
import leadPaymentRoutes from './routes/lead.payment.routes.js'
import newsRoutes from './routes/news.routes.js'
import contactRoutes from './routes/contact.routes.js'
import axios from 'axios';

dotenv.config()

connectDataBase()

const app = express()


// Middleware

app.use(compression());
app.use(express.json({ limit: "1gb" }));
app.use(express.urlencoded({ extended: true, limit: "1gb" }));

app.use(
    cors(
        {
            origin: [
                process.env.FRONTEND_URL_1,
                process.env.FRONTEND_URL_2,
                
            ],
            // methods: ["GET", "POST", "PUT", "DELETE"],
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            credentials: true,
        }
    )
);



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Routes
app.use('/api/v1/agent', agentRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/lead', leadRoutes)
app.use('/api/v1/payment', leadPaymentRoutes)
app.use('/api/v1/news', newsRoutes)
app.use('/api/v1/contact', contactRoutes)


app.get('/', (req, res) => {
    res.send('server is running')
})
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' })
})

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
}) 
