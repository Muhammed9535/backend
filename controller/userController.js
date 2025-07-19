import isEmail from "validator/lib/isEmail.js"
import pool from "../config/eccormerceModel.js"
import bcrypt from 'bcryptjs'
import passport from "passport";
const saltRounds = 10;






const registerUser = async (req, res) => {
    const { name, username, password } = req.body



    try {

        const exist = await pool.query("SELECT * FROM users WHERE email = ($1)", [username])
        if (exist.rows[0]) {
            return res.json({ success: false, message: "User already exist" })
        } else {

            if (!isEmail(username)) {
                res.json({ success: false, message: "invalid email" })
            } else {
                if (password.length < 8) {
                    res.json({ success: false, message: "password must be more that 8 character" })
                } else {
                    const hasedPassword = await bcrypt.hash(password, saltRounds)
                    const result = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)RETURNING *", [name, username, hasedPassword]);

                    const user = result.rows[0]

                    req.logIn(user, async (err) => {
                        if (err) {
                            return err;
                        }
                        req.session.user_id = user.id
                        const userName = await pool.query("SELECT name FROM users WHERE id = $1", [req.user.id])

                        return res.json({ success: true, sessionId: req.sessionID, message: "login successful", name: userName.rows[0].name })
                    })
                }
            }
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error })
    }
}




const loginUser = (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) {
            return next(err); // Pass error to Express error handler
        }
        if (!user) {
            return res.json({ success: false, message: "Login failed" });
        }

        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }
            const userName = await pool.query("SELECT name FROM users WHERE id = $1", [req.user.id])
            console.log(req.session);
            return res.json({ success: true, sessionId: req.sessionID, message: "login successful", name: userName.rows[0].name });
        });
    })(req, res, next);
};


const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, message: "logout failed" })
        }


        req.session.destroy((err) => {
            if (err) {
                return res.json({ success: false, message: err })
            }


            res.clearCookie("connect.sid")
            res.json({ success: true, message: "Logged out successful" })
        })
    })
}



export { registerUser, loginUser, logoutUser };
