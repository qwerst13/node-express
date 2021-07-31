module.exports = function (email, token) {
  const obj = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: `Password reset`,
    html: `
      <p>We received a request to change your password.</p>
      <p>Click the link below to set a new password:</p>
      <ul>
      <li><a href="${process.env.BASE_URL}/auth/password/${token}">Your reset link</a></li>
      </ul>
      <p>If you didn't request this, please ignore this email.</p>
      <p>The CourseShop Team</p>
    `,
  };

  return obj;
};
