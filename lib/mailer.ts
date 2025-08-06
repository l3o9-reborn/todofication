import { transporter } from './email'

interface SendEmailOptions {
  to: string
  subject: string
  text: string
  html?: string
  from?: string
}

export async function sendEmail({ to, subject, text, html, from }: SendEmailOptions) {
  const mailOptions = {
    from: from || process.env.SMTP_FROM || '"Task App" <no-reply@yourapp.com>',
    to,
    subject,
    text,
    html,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
