import passport from "passport";
import bcrypt from 'bcryptjs'
import pool from "./config/eccormerceModel.js";
import { Strategy as LocalStrategy } from 'passport-local';





const configurePassport = () => {
    passport.use(new LocalStrategy(async function verify(username, password, done) {
        console.log("passport is triggered")

        try {
            const loginUser = await pool.query("SELECT * FROM users WHERE email = $1", [username]);

            if (loginUser.rows.length > 0) {
                const user = loginUser.rows[0]
                const isMatch = await bcrypt.compare(password, user.password)

                if (isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            } else {
                return done(null, false, { message: "User not found" });
            }
        } catch (error) {
            console.log(error)
            return done(error);
        }
    }))
}


passport.serializeUser((user, done) => {
    done(null, user.id)
})


passport.deserializeUser(async (id, done) => {
    try {

        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows[0].length === 0) {
            return done(new Error("User not found"))
        }
        console.log("passport deserialize")
        done(null, result.rows[0])
    } catch (error) {
        return done(error)
    }
})


export default configurePassport 