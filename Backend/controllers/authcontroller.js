const user=require('../model/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const sendmail= require('../utils/sendmail');


//token generation
const generatetoken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
};

// Register user
const registeruser= async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const existingUser= await user.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }
        const salt= await bcrypt.genSalt(10);
        const hashedpassword= await bcrypt.hash(password,salt);
        const otp= Math.floor(100000 + Math.random() * 900000).toString();
        const message= `Welcome to  ecomerce website ${name} Your OTP for registration is ${otp}`;
        const newUser = await user.create({name, email, password: hashedpassword,otp,

                otpExpire:
                    Date.now() + 10*60*1000});
                    ;
        if(newUser){
            await sendmail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome to E-commerce',
                text: message
            });
            
        }
         res.status(201).json({
            message:"OTP sent to email"
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
//login user
const loginuser= async (req, res) => {
    const {email, password} = req.body;
    try {
        const existingUser= await user.findOne({email});
        if(!existingUser){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const isMatch= await bcrypt.compare(password, existingUser.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        if(!existingUser.verified){

    return res.status(400).json({
        message:"Verify your account first"
    });
}
        res.status(200).json({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            token: generatetoken(existingUser._id),
            role: existingUser.role,
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
const getuser= async (req, res) => {
    try {
        const users= await user.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
const verifyotp = async(req,res)=>{

    try{

        const {email,otp} = req.body;

        const existingUser =
            await user.findOne({email});

        if(!existingUser){

            return res.status(404).json({
                message:"User not found"
            });
        }

        if(existingUser.otp !== otp){

            return res.status(400).json({
                message:"Invalid OTP"
            });
        }

        if(existingUser.otpExpire < Date.now()){

            return res.status(400).json({
                message:"OTP expired"
            });
        }

        existingUser.verified = true;

        existingUser.otp = undefined;

        existingUser.otpExpire = undefined;

        await existingUser.save();

        res.status(201).json({
            _id:existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            token: generatetoken(existingUser._id), 
            role: existingUser.role,
            message: 'Account verified successfully'
        });
        

    }catch(error){

        res.status(500).json({
            message:error.message
        });
    }
};

module.exports= {registeruser, loginuser, getuser, verifyotp};