import pool from "../config/eccormerceModel.js";


const addToCart = async (req, res) => {

    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id])
        let cartData = result.rows[0].cartdata;

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
        } else {
            cartData[req.body.itemId] += 1
        }

        await pool.query("UPDATE users SET cartdata = $1 WHERE id = $2", [cartData, req.user.id])
        res.json({ success: true, message: "item added" })
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "error" })
    }
}


const removeFromCart = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);

        let cartData = result.rows[0].cartdata;

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1
        } else if (cartData[req.body.itemId] == 0) {
            cartData[req.body.itemId] = ''
        }

        await pool.query("UPDATE users SET cartdata = $1 WHERE id = $2", [cartData, req.user.id])
        res.json({ success: true, message: "item removed" })

    } catch (err) {
        console.log(err)
        res.json({ success: false, message: "error" })
    }

}


const getCart = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id])

        const userCart = result.rows[0].cartdata;

        let cartQuantity = 0
        for (const item in userCart) {
            cartQuantity += userCart[item]
        }

        res.json({ success: true, userCart, cartQuan: cartQuantity })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: "error" })
    }
}


export { addToCart, removeFromCart, getCart }