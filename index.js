import express from 'express'
import pool from './config/eccormerceModel.js';
import session from 'express-session';
import passport from 'passport';
import connectPgSimple from 'connect-pg-simple';
import userRoutes from './routes/userRoutes.js';
import configurePassport from './passport-config.js';
import cors from 'cors'
import cartRouter from './routes/cartRoutes.js';
import wishListRouter from './routes/wishListRoute.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoute.js';
import contactRouter from './routes/contactRoutes.js';
import "dotenv/config"




const app = express()
const port = process.env.PORT || 3000;
pool.connect()

app.set("trust proxy", 1);

app.use(cors({
    origin: ['https://exclusive-ecommerce-frontend.onrender.com', 'https://exclusive-ecommerce-admin.onrender.com'],
    credentials: true  // Allow cookies in CORS
}))

const PgSession = connectPgSimple(session);

app.use(session({
    store: new PgSession({
        pool,
        tableName: "sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: false,
        // sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24,
    }
}))



app.use(passport.initialize());
app.use(passport.session())


configurePassport();

app.get("/", (req, res) => {
    res.send("Hello there")
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/user", userRoutes);
app.use("/api/cart", cartRouter)
app.use("/api/wishlist", wishListRouter)
app.use("/api/product", productRouter)
app.use("/api/order", orderRouter)
app.use("/api/contact", contactRouter)
app.use("/images", express.static('uploads'))

app.listen(port, () => { console.log(`server running on port ${port}`) })


