module.exports = function(email) {
  const obj = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: `You're sussesfully registered`,
    html: `
      <h1>Welcome to our shop</h1>
      <p>You're sussesfully registered. Enjoy.</p>
      <hr/>
      <a href="${process.env.BASE_URL}>---> Start shopping <---</a>"
    `
  }

  return obj;
}
