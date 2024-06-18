import nodemailer from "nodemailer";

// Email workflow
// Have nodemailer installed
// 1. Create transport
// 2. Form the body message
// 3. send email

const emailProcessor = async (methodBodyObj) => {
  try {
    // 1. create transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail(methodBodyObj);
    return info;
  } catch (error) {
    console.log(error);
  }
};

// async..await is not allowed in global scope, must use a wrapper
export const emailVerificationMail = ({ email, firstName, url }) => {
  const obj = {
    from: `"Tech Store 👻" <${process.env.SMTP_EMAIL}>`, // sender address
    to: `${email}`, // list of receivers
    subject: "Action Required", // Subject line
    text: `Hello there, please follow the link to verify your account ${url}`, // plain text body
    html: `<b>Hello ${firstName}</b>
            <p>Click the button below to verify your account. </p>
            <a href=${url} style ="padding:1rem; background:green">Verify Now </a><br/>
            <p>If the button does not work above, please copy the following url and paste in your browser ${url}</p>`, // html body
  };

  emailProcessor(obj);
  //   console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};
