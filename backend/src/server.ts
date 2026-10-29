import app from "./app";
import connectDB from "./config/db";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
};

startServer();
