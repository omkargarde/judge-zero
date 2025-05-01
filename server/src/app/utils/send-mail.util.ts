import nodemailer from "nodemailer";

const sendVerificationMail = async (email: string, token: string) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const VerificationUrl = `${process.env.BASE_URL!}/api/v1/users/verify/${token}`;

  const transporter = nodemailer.createTransport({
    auth: {
      pass: process.env.MAIL_PASSWORD,
      user: process.env.MAIL_USERNAME,
    },
    secure: !!process.env.IS_PROD,
    service: process.env.MAIL_HOST,
  });

  const mailOptions = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    from: process.env.MAIL_SENDER!,
    html: "<b>Hello world?</b>",
    subject: "Email Verification",
    text: `Click on the link to verify your email: ${VerificationUrl}`,
    to: email,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: ", info.messageId);
    return true;
  } catch (error) {
    return error;
  }
};

export { sendVerificationMail };
