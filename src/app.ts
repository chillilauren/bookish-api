import "dotenv/config";
import express from "express";
import "express-async-errors"
import memberRoutes from "./routes/memberRoutes";
import bookRoutes from "./routes/bookRoutes";
import copyRoutes from "./routes/copyRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";

const app = express();
const port = process.env['PORT'] || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/books", bookRoutes);
app.use("/members", memberRoutes);
app.use("/copies", copyRoutes);
app.use("/checkouts", checkoutRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
