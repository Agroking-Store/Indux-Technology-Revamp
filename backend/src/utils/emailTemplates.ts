export const getEmailBaseTemplate = (title: string, bodyContent: string) => {
  const currentYear = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    /* Reset and Base */
    body, p, h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f6; color: #333333; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; width: 100%; }
    
    /* Layout */
    .container { max-w-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); margin-top: 40px; margin-bottom: 40px; }
    .header { background-color: #0f2e4a; padding: 35px 40px; text-align: center; }
    .header img { max-width: 180px; height: auto; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin-top: 15px; letter-spacing: 0.5px; }
    
    /* Content */
    .content { padding: 40px; background-color: #ffffff; }
    .greeting { font-size: 20px; font-weight: 600; color: #1e293b; margin-bottom: 20px; }
    .text-body { font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 25px; }
    
    .highlight-box { background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; border-radius: 4px; margin-bottom: 30px; }
    .highlight-box p { font-size: 15px; color: #334155; line-height: 1.5; font-style: italic; }
    
    .cta-container { text-align: center; margin: 35px 0; }
    .cta-button { display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: 600; font-size: 16px; transition: background-color 0.3s; }
    
    /* Footer */
    .footer { background-color: #f8fafc; padding: 40px; border-top: 1px solid #e2e8f0; text-align: center; }
    .social-icons { margin-bottom: 25px; }
    .social-icons a { display: inline-block; margin: 0 8px; }
    .social-icons img { width: 24px; height: 24px; opacity: 0.7; transition: opacity 0.3s; }
    
    .company-details { font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 15px; }
    .company-details strong { color: #475569; }
    .copyright { font-size: 12px; color: #94a3b8; }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .container { margin-top: 0; margin-bottom: 0; border-radius: 0; }
      .content, .footer { padding: 25px 20px; }
    }
  </style>
</head>
<body>
  <div style="background-color: #f4f7f6; padding: 20px 0;">
    <table class="container" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
      <!-- Header -->
      <tr>
        <td class="header">
          <!-- Fallback if logo URL is missing, we use a styled text logo for safety -->
          <div style="color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: 1px; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span style="color: #3b82f6;">●</span> INDUX TECHNOLOGY
          </div>
        </td>
      </tr>
      
      <!-- Body Content -->
      <tr>
        <td class="content">
          ${bodyContent}
          
          <p class="text-body" style="margin-top: 40px;">
            Best Regards,<br>
            <strong>The Indux Technology Team</strong>
          </p>
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td class="footer">
          <!-- Social Links -->
          <div class="social-icons">
            <a href="https://www.linkedin.com/company/indux-technology/" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LinkedIn">
            </a>
            <a href="https://x.com/induxtechnology" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" alt="Twitter">
            </a>
            <a href="https://www.facebook.com/885831577953764/" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook">
            </a>
            <a href="https://www.instagram.com/indux.technology" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram">
            </a>
            <a href="https://wa.me/918421538753" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp">
            </a>
          </div>
          
          <!-- Company Details -->
          <div class="company-details">
            <p><strong>Email:</strong> <a href="mailto:connect@induxtechnology.com" style="color: #2563eb; text-decoration: none;">connect@induxtechnology.com</a> | <strong>Phone:</strong> +91 84215 38753</p>
            <p style="margin-top: 5px;">S. No. 05, Geeta Paradise, Opp. Zensar, Kharadi, Pune, India</p>
          </div>
          
          <div class="copyright">
            &copy; ${currentYear} Indux Technology. All rights reserved.
          </div>
        </td>
      </tr>
      
    </table>
  </div>
</body>
</html>
  `;
};

// Lead (Contact Us) Auto-Reply Template
export const getLeadEmailTemplate = (name: string) => {
  const bodyContent = `
    <h2 class="greeting">Hi ${name},</h2>
    <p class="text-body">
      Thank you for reaching out to us. We have successfully received your message and our team is currently reviewing your inquiry.
    </p>
    <p class="text-body">
      We pride ourselves on rapid response times. One of our experts will get back to you within 24 hours to discuss how we can help.
    </p>
    
    <div class="cta-container">
      <a href="https://induxtechnology.com/services" class="cta-button">Explore Our Services</a>
    </div>
  `;
  
  return getEmailBaseTemplate("Thank you for contacting Indux Technology", bodyContent);
};

// Quote Request Auto-Reply Template
export const getQuoteEmailTemplate = (name: string, serviceInterest: string, companyName?: string) => {
  const bodyContent = `
    <h2 class="greeting">Hi ${name},</h2>
    <p class="text-body">
      Thank you for requesting a quote from Indux Technology${companyName ? ` on behalf of <strong>${companyName}</strong>` : ''}.
    </p>
    <p class="text-body">
      We are thrilled to hear about your interest in our <strong>${serviceInterest.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong> solutions. Our technical consultants are already analyzing your requirements to craft a tailored proposal that aligns perfectly with your goals.
    </p>
    <p class="text-body">
      You can expect to hear from us shortly to discuss the next steps, clarify any details, and present our technical approach.
    </p>
    
    <div class="cta-container">
      <a href="https://induxtechnology.com/products" class="cta-button">View Our Products</a>
    </div>
  `;
  
  return getEmailBaseTemplate("We received your quote request - Indux Technology", bodyContent);
};

// Forgot Password Email Template
export const getForgotPasswordEmailTemplate = (name: string, resetUrl: string) => {
  const bodyContent = `
    <h2 class="greeting">Hi ${name},</h2>
    <p class="text-body">
      You are receiving this email because you (or someone else) requested a password reset for your Indux Technology admin account.
    </p>
    <p class="text-body">
      Please click the button below to complete the process. This link is valid for 10 minutes.
    </p>
    
    <div class="cta-container">
      <a href="${resetUrl}" class="cta-button">Reset Password</a>
    </div>

    <p class="text-body" style="font-size: 14px; color: #64748b;">
      If you did not request this, please ignore this email and your password will remain unchanged.
    </p>
  `;
  
  return getEmailBaseTemplate("Password Reset Request - Indux Technology", bodyContent);
};
