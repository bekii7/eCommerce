import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

const hmacSecret = process.env.SUPABASE_JWT_SECRET;

// Prevent the server from starting if the secret is not set
if (!hmacSecret) {
  console.error("Please set the SUPABASE_JWT_SECRET environment variable");
  process.exit(1);
}

export const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  if (token.includes("Bearer")) token = token.split(" ")[1];

  // Validate token
  jwt.verify(token, hmacSecret, (err, decoded) => {
    if (err) {
      res.status(401);
      throw new Error(err.message);
    }

    // Attach user id and email to request object to access it later in the handler
    req.email = decoded.email;
    req.id = decoded.sub;
    next(); // Call the next handler if token is valid
  });
};
