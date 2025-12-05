const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const secret = process.env.JWT_SECRET || "dev_jwt_secret";

async function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing auth header" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, secret);
    const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
    if (!admin) return res.status(401).json({ error: "Invalid token" });
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized", detail: err.message });
  }
}

async function userAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing auth header" });
  
  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid auth format" });

  try {
    const payload = jwt.verify(token, secret);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ error: "Invalid token" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized", detail: err.message });
  }
}

module.exports = { adminAuth, userAuth };
