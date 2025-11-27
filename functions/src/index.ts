import * as functions from "firebase-functions";
import next from "next";
import * as admin from "firebase-admin";

admin.initializeApp();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, conf: { distDir: ".next" } });
const handle = app.getRequestHandler();

export const nextjsFunc = functions.https.onRequest({ region: "asia-northeast3" }, async (req, res) => {
  try {
    await app.prepare();
    return handle(req, res);
  } catch (error) {
    console.error("Error handling the request:", error);
    res.status(500).send("Internal Server Error");
  }
});
