import haqqaton from "./haqqaton.json";

const isProd = process.env.NODE_ENV === "production";
const isLocal = process.env.NODE_ENV === "local";
const SERVER_URI = isProd ? haqqaton.server.prod : isLocal ? haqqaton.server.local : haqqaton.server.dev;
const EXCEPT_URL = ["/login", "/auth/refreshToken", "/auth/token", "/auth/google/callback", "/auth/logout", "/public", "/assets", "/favicon.ico"];

export {haqqaton, SERVER_URI, EXCEPT_URL};
