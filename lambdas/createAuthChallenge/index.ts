import nodemailer from 'nodemailer';

const EMAIL = process.env.GMAIL_USER!;
const PASSWORD = process.env.GMAIL_PASSWORD!;

export const handler = async (event: any) => {
  const email = event.request.userAttributes.email;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });

  await transporter.sendMail({
    from: EMAIL,
    to: email,
    subject: 'Your login code',
    text: `Your code is: ${code}`,
  });

  event.response.publicChallengeParameters = { email };
  event.response.privateChallengeParameters = { code };
  event.response.challengeMetadata = 'CODE_CHALLENGE';

  return event;
};
