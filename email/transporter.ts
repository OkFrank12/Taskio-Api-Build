import { createTransport } from "nodemailer";
import { join } from "path";
import { envExports } from "../environment/envExports";
import { sign } from "jsonwebtoken";
import { renderFile } from "ejs";

export const sendVerificationMail = async (auth: any) => {
  try {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: envExports.EMAIL,
        pass: envExports.EMAIL_PASS,
      },
    });

    const token = sign({ id: auth._id }, envExports.TOKEN_SECRET);

    const mailOptions = {
      userName: auth.userName,
      email: auth.email,
      verifyLink: `http://localhost:5173/${token}/verify-account`,
    };

    const locateEjsFile = join(__dirname, "../views/verifyEJS.ejs");
    const htmlToSend = await renderFile(locateEjsFile, mailOptions);

    const mailer = {
      from: "Taskio App <cfoonyemmemme@gmail.com>",
      to: auth.email,
      subject: "Verify Your Taskio Account - Complete Registration Now!",
      html: htmlToSend,
    };

    transporter.sendMail(mailer);
  } catch (error: any) {
    console.error(error);
  }
};
