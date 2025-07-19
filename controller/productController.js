import db from "../config/eccormerceModel.js";
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary';



const addProduct = async (req, res) => {
    const { prodName, prodPrice, prodCategory } = req.body;
    const imageFile = req.file; // Assuming you are using Multer to handle file uploads

    if (!imageFile) {
        return res.status(400).json({ success: false, message: "No file uploaded!" });
    }

    try {
        // Upload image to Cloudinary
        cloudinary.uploader.upload_stream(
            { folder: "uploads" }, // Folder in Cloudinary
            async (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return res.status(500).json({ success: false, message: error.message });
                }

                const prodImg = result.secure_url; // Get Cloudinary URL
                // Insert product into PostgreSQL
                try {
                    const dbResult = await db.query(
                        "INSERT INTO products (prodimg, prodname, prodprice, prodcategory) VALUES ($1, $2, $3, $4) RETURNING *",
                        [prodImg, prodName, prodPrice, prodCategory]
                    );

                    res.json({
                        success: true,
                        message: dbResult.rows[0], // Return saved product details
                    });

                } catch (dbError) {
                    console.error("Database Insert Error:", dbError);
                    res.status(500).json({ success: false, message: "Error saving product to database." });
                }
            }
        ).end(imageFile.buffer); // Upload the image from memory buffer

    } catch (error) {
        console.error("Upload Route Error:", error);
        res.status(500).json({ success: false, message: "Upload failed!" });
    }
};


const removeProduct = async (req, res) => {
    try {

        const result = await db.query("DELETE FROM products WHERE id = $1 RETURNING *", [req.body.id])


        fs.unlink(`uploads/${result.rows[0].prodimg}`, () => {
        })


        res.json({ success: true, message: "product deleted" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'error' })
    }


}


const listProduct = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM products");
        res.json({ success: true, productlist: result.rows })
    } catch (error) {
        console.log(error)
        res.json({ success: true, message: "error" })
    }
}


export { addProduct, removeProduct, listProduct }
