const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const contactRoutes = require("./routers/contactRoutes");
const galleryRoutes = require("./routers/galleryRoutes");
const pressReleaseRoutes = require("./routers/pressReleaseRoutes");
const videoRoutes = require("./routers/videoRoutes");
const sliderRoutes = require("./routers/sliderRoutes");
const personalDetailRoutes = require("./routers/personalDetailRoutes");
const categoryRoutes = require("./routers/categoryRoutes");
const aboutRoutes = require("./routers/aboutRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Content-Type:', req.headers['content-type']);
    next();
});


// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/press-release", pressReleaseRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/personal-detail", personalDetailRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/about", aboutRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
