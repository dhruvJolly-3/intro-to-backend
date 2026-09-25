import { User } from '../models/user.model.js';

const registerUser = async(req, res) => {
    try{
        const { username, email, password } = req.body || {};


        // basic validation
        if(!username || !email || !password){
            return res.status(400).json({ message: "Please provide all required fields!" });
        }

        // check if user already exists

        const existing = await User.findOne({ email: email.toLowerCase() });
        if(existing){
            return res.status(400).json({message: "User already exists!!"});
        }

        // create new user

        const user = await User.create({
            username,
            email:email.toLowerCase(),
            password,
            loggedIn: false,
        });

        return res.status(201).json({
             message: "User registered successfully",
              user:{ id:user._id,email:user.email,username:user.username} 
            });

    }
    catch(error){
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const loginUser = async(req, res) => {
    try{
        const { email, password } = req.body || {};

        // basic validation
        if(!email || !password){
            return res.status(400).json({ message: "Please provide email and password!" });
        }

        // checking if the user exists
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if(!user){
            return res.status(400).json({
                message: "User not found"
            });
        }

        // compare the passwords
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });

    } catch(error){
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
const logoutUser = async(req, res) => {
    try{
        const{email} = req.body;

        const user = await User.findOne({
            email
        });

        if(!user){
            return res.status(400).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User logged out successfully"
        });
    } catch(error){
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}
export{
    registerUser,
    loginUser,
    logoutUser
};