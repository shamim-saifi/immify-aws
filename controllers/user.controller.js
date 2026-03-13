import { ErrorHandler, TryCatch } from "../error/error.js";
import { User } from "../models/user.model.js";



export const UserSignup = TryCatch(async (req, res, next) => {
    const { firstName, lastName, email, phone, country, state, destination } = req.body;

    if (!firstName || !lastName || !email || !phone || !country || !destination) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Find vet by email
    let userExist = await User.findOne({ email }).select("+password");
    if (!userExist) {
        return next(
            new ErrorHandler("user is not exist please do inform to owner", 400)
        );
    }

    let user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        country,
        state,
        destination
    })


    // this is lead only not user authentication
    // const token = jwe.sign({ user_id: user._id }, process.env.JWT_SECRET, {
    //     expiresIn: "1d",
    // });
    // user.sessionToken = token; // Set session token
    // await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json({
            success: true,
            message: "Your  query has been submitted successfully, we will contact you soon.",
        });
});

export const UserLogin = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Find vet by email
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(
            new ErrorHandler("user is not exist please do inform to owner", 400)
        );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid credentials", 400));
    }

    // Generate token
    const token = jwe.sign({ user_id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    user.sessionToken = token; // Set session token
    await user.save({ validateBeforeSave: false });

    // Set cookie with token
    return res
        .status(200)
        .cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            sameSite: "none",
            secure: true,
        })
        .json({
            success: true,
            message: "Login successful", user
        });
});


