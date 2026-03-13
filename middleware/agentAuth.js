import jwt from 'jsonwebtoken';
import { Agent } from '../models/agent.model.js';
import { ErrorHandler } from '../error/error.js';


// export const agentAuth = async (req, res, next) => {
//     try {
//         const authHeader = req.headers['authorization'];

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return next(new ErrorHandler("Unauthorized. Token missing.", 401));
//         }

//         const token = authHeader.split(" ")[1];
//         if (!token) {
//             return next(new ErrorHandler("Unauthorized access", 401));
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         if (!decoded?.agent_id) {
//             return next(new ErrorHandler("Invalid session token", 401));
//         }

//         const agent = await Agent.findById(decoded.agent_id).select("-password");

//         if (!agent) {
//             return next(new ErrorHandler("Agent not found", 404));
//         }
//         if(!agent.sessionToken){
//             return next(new ErrorHandler("token has been expired",400))
//         }

//         req.agent = agent;
//         next();
//     } catch (error) {
//         // console.error("Token verification error:", error.message);
//         return next(new ErrorHandler("Unauthorized. Invalid or expired token.", 401));
//     }
// };

export const agentAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new ErrorHandler("Unauthorized. Token missing.", 401));
    }
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.agent_id) {
            return next(new ErrorHandler("Invalid session token", 401));
        }

        const agent = await Agent.findById(decoded.agent_id).select("-password");

        if (!agent) {
            return next(new ErrorHandler("Agent not found", 401));
        }
        if (!agent.sessionToken) {
            return next(new ErrorHandler("token has been expired", 401))
        }

        req.agent = agent;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ErrorHandler("Token has expired", 401));
        }
        return next(new ErrorHandler("Unauthorized. Invalid or expired token.", 401));
    }
};

export default agentAuth;