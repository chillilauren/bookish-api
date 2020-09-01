import "dotenv/config";
import express from "express";
import nunjucks from "nunjucks";
import sassMiddleware from "node-sass-middleware";
import "express-async-errors"
import homeRoutes from "./routes/homeRoutes";
import memberRoutes from "./routes/memberRoutes";
import bookRoutes from "./routes/bookRoutes";
import copyRoutes from "./routes/copyRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import authRoutes from "./routes/authRoutes";
import passport from "passport";
import passportLocal from "passport-local";
import {tryLoginMember} from "./services/auth";
import {fetchMemberByEmail, fetchMemberById, Member} from "./database/members";
import session from "express-session";
import cookieParser from "cookie-parser";
import passportGitHub from "passport-github2";
import crypto from "crypto";
import {knexClient, PAGE_SIZE} from "./database/knexClient";

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
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());

const PATH_TO_TEMPLATES = "./templates/";
nunjucks.configure(PATH_TO_TEMPLATES, { 
    autoescape: true,
    express: app,
    trimBlocks: true,
});

passport.use(new passportLocal.Strategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    async (email, password, done) => {
        // Find the member with a given email
        const member = await knexClient
            .select("*")
            .from("member")
            .where("deleted", false)
            .andWhere(builder => {
                builder
                    .where("name", "ILIKE", `%${search}%`)
                    .orWhere("email", "ILIKE", `%${search}%`);
            })
            .offset(PAGE_SIZE * (page - 1))
            .limit(PAGE_SIZE);

        // If there isn't an email, return no member and an error message.
        if (!member) {
            return done(null, false, { message: "email or password is incorrect" });
        }

        // Hash the password and the salt.
        const hashedAttempt = crypto
            .createHash('sha256')
            .update(password + member.salt)
            .digest('base64');
        
        // If the password hashes match, then return the member.
        if (hashedAttempt === member.hashed_password) {
            return done(null, member);
        }

        // Otherwise return a failed login again.
        return done(null, false, { message: "email or password is incorrect" });
    }
));

passport.use(new passportGitHub.Strategy(
    {
        clientID: process.env.GITHUB_OAUTH_CLIENT_ID!,
        clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
        callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        const email = profile.emails[0].value.toLowerCase();
        const member = await fetchMemberByEmail(email);
        if (member) {
            return done(null, member);
        }
        return done(null, false, { message: "no matching user found" });
    }
));


passport.serializeUser(function(member: Member, done) {
    done(null, member.id);
});

passport.deserializeUser(async function(id: number, done) {
    const member = await fetchMemberById(id);
    done(null, member);
});


app.use("/books", bookRoutes);
app.use("/members", memberRoutes);
app.use("/copies", copyRoutes);
app.use("/checkouts", checkoutRoutes);
app.use("/auth", authRoutes);
app.use("/", homeRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
