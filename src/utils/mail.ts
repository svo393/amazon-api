import nodemailer from 'nodemailer'
import env from './config'

export const transport = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: Number(env.MAIL_PORT),
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS
  }
})

export const makeEmail = (text: string): string => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    ${text}
  </div>
`
