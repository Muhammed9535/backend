import pool from "../config/eccormerceModel.js"
import Stripe from 'stripe'

const addOrder = async (req, res) => {
    const { items, details, payment, amount } = req.body;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const frontend_url = "http://localhost:5173"
    try {

        const newOrder = await pool.query("INSERT INTO orders(user_id, payment, items, details,amount) VALUES ($1, $2, $3, $4, $5) RETURNING *", [req.user.id, payment, items, details, amount])

        await pool.query("UPDATE users SET cartdata = $1 WHERE id = $2", [{}, req.user.id]);


        if (payment == 'bank') {
            const line_items = req.body.items.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.prodname,
                    },
                    unit_amount: item.prodprice,
                },
                quantity: item.quantity
            }))

            const session = await stripe.checkout.sessions.create({
                line_items: line_items,
                mode: 'payment',
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder.rows[0].id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder.rows[0].id}`,
            })

            req.session.save()
            return res.json({ success: true, session_url: session.url })
        } else if (payment == 'cash') {
            console.log("mkrmn rmnr")
            res.json({ success: true, message: "order added" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "error" })
    }
}


const allOrder = async (req, res) => {
    try {

        const allOrders = await pool.query("SELECT * FROM orders ")
        res.json({ success: true, message: allOrders.rows })
    } catch (error) {
        console.log((error))
        res.json({ success: false, message: 'error' })
    }
}


const verifyOrder = async (req, res) => {
    const { success, orderId } = req.body

    try {
        if (success === 'true') {
            await pool.query("UPDATE orders SET payment_status = $1 WHERE id = $2", [true, orderId]);

            req.session.save()
            res.json({ success: true, message: "paid" })
        } else {
            await pool.query("DELETE FROM orders WHERE id = $1", [orderId])
            res.json({ success: false, message: "Not paid" })

        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// status

const updateStatus = async (req, res) => {
    try {
        await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [req.body.status, req.body.id])

        res.json({ success: true, message: "status Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "error updating status" })
    }
}


const userOrder = async (req, res) => {

    try {
        const userOrder = await pool.query("SELECT * FROM orders WHERE user_id = $1", [req.user.id])

        res.json({ success: true, message: userOrder.rows })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "error" })
    }
}

const CancelOrder = async (req, res) => {

    try {
        console.log(req.user.id)
        const Order = await pool.query("SELECT * FROM orders WHERE id = $1", [req.body.id])

        const cancelOrder = Order.rows[0]
        await pool.query("INSERT INTO cancelorder (user_id, payment, items, amount) VALUES ($1, $2, $3, $4)", [cancelOrder.user_id, cancelOrder.payment, cancelOrder.items, cancelOrder.amount]);

        await pool.query("DELETE FROM orders WHERE id = $1", [req.body.id]);
        res.json({ success: true, message: "order deleted" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "error" })
    }
}

const getCancelOrder = async (req, res) => {
    try {
        const gh = await pool.query("SELECT * FROM cancelorder WHERE user_id = $1", [req.user.id])
        res.json({ success: true, message: gh.rows })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "error" })
    }
}


export { addOrder, allOrder, updateStatus, verifyOrder, userOrder, CancelOrder, getCancelOrder } 