import { Request, Response } from "express";

import Newsletter from "../models/Newsletter";
import  transporter  from "../services/emailService";

export const sendWelcomeEmail = async (email: string) => {
    await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Indux Technologies",
        html: `
            <h2>Welcome!</h2>
            <p>
                Thank you for subscribing to our newsletter.
            </p>
            <p>
                You will now receive our latest updates.
            </p>
        `
    });
};
export const subscribeNewsletter = async (
    req: Request,
    res: Response
) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        const exists = await Newsletter.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Already subscribed",
            });
        }
        const subscriber = await Newsletter.create({
            email,
        });
    await sendWelcomeEmail(email);
        return res.status(201).json({
            success: true,
            message: "Subscribed Successfully",
            data: subscriber,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};