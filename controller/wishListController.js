import db from "../config/eccormerceModel.js"

const addToWishList = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id])
        let wishlist = result.rows[0].wishlist

        if (!wishlist[req.body.itemId]) {
            wishlist[req.body.itemId] = 1
        } else if (wishlist[req.body.itemId] == 1) {
            return res.json({ success: false, message: "item already in wishlist" })
        }

        await db.query("UPDATE users SET wishlist = $1 WHERE id = $2", [wishlist, req.user.id])
        res.json({ success: true, message: "Added to wishlist" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "error" })
    }
}


const removeFromWishList = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
        let wishlist = result.rows[0].wishlist

        if (wishlist[req.body.itemId] === 1) {
            wishlist[req.body.itemId] -= 1
        } else if (wishlist[req.body.itemId] === 0) {
            return res.json({ success: false, message: "item does not exist" })
        }

        await db.query("UPDATE users SET wishlist = $1 WHERE id = $2", [wishlist, req.user.id])


        res.json({ success: true, wishlist })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: "error" })
    }

}


const getWishList = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id])
        let userWishlist = result.rows[0].wishlist;

        console

        let wishlistQuantity = 0
        for (const item in userWishlist) {
            wishlistQuantity += userWishlist[item]
        }

        res.json({ success: true, userWishlist, wishlistQuantity })

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "error" })
    }
}


const moveAllToBag = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id])
        let wishlist = result.rows[0].wishlist

        const cart = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id])

        let userCart = cart.rows[0].cartdata;



        for (const item in wishlist) {
            if (userCart[item]) {
                userCart[item] += 1
                wishlist[item] = 0
            } else if (!userCart[item]) {
                userCart[item] = 1
                wishlist[item] = 0
            }
        }

        await db.query("UPDATE users SET cartdata = $1, wishlist = $2 WHERE id = $3", [userCart, {}, req.user.id])

        res.json({ success: true, message: {} })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "error" })
    }
}


export { addToWishList, removeFromWishList, getWishList, moveAllToBag }