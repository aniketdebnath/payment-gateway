import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

//logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//body parser middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

//global error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...PORT(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

//api routes

//should be at bottom
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`);
});
