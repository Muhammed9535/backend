import express from 'express'
import { registerUser, loginUser, logoutUser } from '../controller/userController.js';

const userRoutes = express.Router()

userRoutes.post("/login", loginUser)
userRoutes.post("/register", registerUser)
userRoutes.get("/logout", logoutUser)



export default userRoutes;  