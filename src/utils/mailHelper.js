//
import config from "../config/index.js";

import transporter from "../config/transporter.config.js";

const mailHelper = async (option) => {
  // method - 1 - direct give as object or
  // await transporter.sendMail({})

  // method - 2 - define first and object and pass
  const message = {
    from: config.SMTP_SENDER_EMAIL, // sender address
    to: option.email, // list of receivers
    subject: option.subject, // Subject line
    text: option.message, // plain text body
    html: "<b>Hello world?</b>", // html body - if you want to use
  };
  await transporter.sendMail(message);
};

export default mailHelper;
