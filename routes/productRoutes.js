import express from 'express'
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { addProduct, listProduct, removeProduct } from '../controller/productController.js';

const productRouter = express.Router();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const storage = multer.memoryStorage();
const upload = multer({ storage });


productRouter.post("/add", upload.single("image"), addProduct)

productRouter.post("/remove", removeProduct)
productRouter.get("/get-all-product", listProduct)



export default productRouter