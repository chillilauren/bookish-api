import "dotenv/config";
import express from "express";
import nunjucks from "nunjucks";
import sassMiddleware from "node-sass-middleware";
import homeRoutes from "./routes/homeRoutes";
import bookRoutes from "./routes/bookRoutes";

const app = express();
const port = process.env['PORT'] || 3000;

const srcPath = __dirname + "/../stylesheets";
const destPath = __dirname + "/../public";
app.use(
    sassMiddleware({
        src: srcPath,
        dest: destPath,
        debug: true,
        outputStyle: 'compressed',
        prefix: '',
    })
);
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));

const PATH_TO_TEMPLATES = "./templates/";
nunjucks.configure(PATH_TO_TEMPLATES, { 
    autoescape: true,
    express: app
});


app.use("/books", bookRoutes);
app.use("/", homeRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
