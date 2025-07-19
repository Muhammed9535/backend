import pool from "../config/eccormerceModel.js"

const addContact = async (req, res) => {
    const { name, email, number, message } = req.body
    try {
        await pool.query("INSERT INTO contact(name, email, number, message) VALUES ($1, $2, $3, $4)", [name, email, number, message])
        res.json({ success: true, message: "message added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'error' })
    }
}



const getAllContact = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM contact")
        res.json({ success: true, message: result.rows })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'error' })
    }
}
export { addContact, getAllContact }