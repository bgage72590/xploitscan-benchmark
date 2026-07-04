// Server handler that passes a user-supplied string straight into eval().
// Classic remote code execution — VC015 must fire.

export async function calculate(req, res) {
  const expression = req.body.expression;
  // User input goes directly into eval — trivially exploitable RCE.
  const answer = eval(expression);
  res.json({ answer });
}
