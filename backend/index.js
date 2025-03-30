const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const tenantRouter = require("./routes/tenantRoutes");
const landlordRouter = require("./routes/landlordRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tenants", tenantRouter);
app.use("/api/landlord", landlordRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));