import { Request, Response } from "express";
import Newsletter from "../models/Newsletter";
import { sendEmail } from "../utils/sendEmail";
import { getNewsletterWelcomeTemplate } from "../utils/emailTemplates";
import { env } from "../config/env";

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
        
        let subscriber = await Newsletter.findOne({ email });
        
        if (subscriber) {
            if (subscriber.status === "Subscribed") {
                return res.status(400).json({
                    success: false,
                    message: "Already subscribed",
                });
            } else {
                // If they were unsubscribed, resubscribe them
                subscriber.status = "Subscribed";
                await subscriber.save();
            }
        } else {
            subscriber = await Newsletter.create({ email });
        }

        // Generate unsubscribe URL. In production, this should ideally have a token/hash for security
        // For simplicity right now, passing email in query params.
        const unsubscribeUrl = `${env.CLIENT_URL}/api/v1/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
        
        const emailHtml = getNewsletterWelcomeTemplate(unsubscribeUrl);
        
        sendEmail({
            to: email,
            subject: "Welcome to the Indux Technology Newsletter",
            html: emailHtml,
        }).catch(err => console.error("Newsletter Email error:", err));

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

export const unsubscribeNewsletter = async (
    req: Request,
    res: Response
) => {
    try {
        const email = req.query.email || req.body.email;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required to unsubscribe",
            });
        }

        const subscriber = await Newsletter.findOne({ email: String(email) });
        
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: "Subscriber not found",
            });
        }

        subscriber.status = "Unsubscribed";
        await subscriber.save();

        // Redirect to frontend or send JSON
        if (req.method === "GET") {
            // Ideally redirect to a "Successfully Unsubscribed" frontend page
            // But we'll just send a simple HTML response for now
            return res.status(200).send(`
                <div style="text-align: center; font-family: sans-serif; margin-top: 50px;">
                    <h2>Unsubscribed Successfully</h2>
                    <p>You have been removed from our newsletter list and will no longer receive marketing emails.</p>
                </div>
            `);
        }

        return res.status(200).json({
            success: true,
            message: "Unsubscribed Successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};