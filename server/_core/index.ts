import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { registerStripeWebhook } from "../stripeWebhook";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

// CORS policy for the license validation endpoint:
// The HTML product files are opened locally (file://) by customers,
// so we must allow cross-origin requests from any origin for this specific route.
const licenseCors = cors({
  origin: true, // reflect request origin (allows file:// and any domain)
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Accept", "Content-Type"],
});

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Register Stripe webhook BEFORE express.json() so raw body is available for signature verification
  registerStripeWebhook(app);

  // License validation endpoint (REST API for license.js)
  // CORS is explicitly enabled here so customers can call this from locally-opened HTML files.
  app.options("/api/validate-license", licenseCors);
  app.get("/api/validate-license", licenseCors, async (req, res) => {
    try {
      const { key, product } = req.query;
      if (!key || typeof key !== "string") {
        return res.status(400).json({ valid: false, error: "Missing license key" });
      }
      
      const db = await (await import("../db")).getDb();
      if (!db) {
        return res.status(500).json({ valid: false, error: "Database unavailable" });
      }
      
      const { licenses } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      const licenseRows = await db
        .select()
        .from(licenses)
        .where(eq(licenses.licenseKey, key))
        .limit(1);
      
      if (licenseRows.length === 0) {
        return res.json({ valid: false });
      }
      
      const license = licenseRows[0];
      if (product) {
        const expectedTier = product === "family" ? "family" : "personal";
        if (license.tier !== expectedTier) {
          return res.json({ valid: false });
        }
      }
      
      return res.json({ valid: true });
    } catch (error) {
      console.error("License validation error:", error);
      return res.status(500).json({ valid: false, error: "Validation failed" });
    }
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
