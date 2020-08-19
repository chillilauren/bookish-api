import "dotenv/config";
import express from "express";
import nunjucks from "nunjucks";
import sassMiddleware from "node-sass-middleware";
import "express-async-errors"
import homeRoutes from "./routes/homeRoutes";
import memberRoutes from "./routes/memberRoutes";
import bookRoutes from "./routes/bookRoutes";
import copyRoutes from "./routes/copyRoutes";

const app = express();
const port = process.env['PORT'] || 3000;

const srcPath = __dirname + "/../stylesheets";
const destPath = __dirname + "/../public";
app.use(
    sassMiddleware({
        src: srcPath,
        dest: destPath,
        outputStyle: 'compressed',
        prefix: '',
    })
);
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

const PATH_TO_TEMPLATES = "./templates/";
nunjucks.configure(PATH_TO_TEMPLATES, { 
    autoescape: true,
    express: app,
    trimBlocks: true,
});


app.use("/books", bookRoutes);
app.use("/members", memberRoutes);
app.use("/copies", copyRoutes);
app.use("/", homeRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
