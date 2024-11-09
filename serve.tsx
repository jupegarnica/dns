/** @jsx h */
import {
    h,
    jsx,
    serve,
} from "https://deno.land/x/sift@0.6.0/mod.ts";

import { join } from "https://deno.land/std@0.126.0/path/mod.ts";
import { Dns, resolveDns } from "./resolveDns.jsx";

const NotFound = () => (
    <div>
        <h1>Page not found</h1>
    </div>
);

serve({
    "/:slug": async (_, connInfo, params) => {

        const domain = params?.slug ?? "garn.dev";

        return jsx(<Dns records={await resolveDns(domain)} domain={domain} />);
    },

    404: (req: Request) => {
        let url = req.url;
        if (url.endsWith("index.html")) {
            url = url.split("index.html").join('garn.dev');
        }
        console.log(url);

        const nextUrl = new URL(join(url, "./index.html"));
        return Response.redirect(nextUrl, 302);
    },
}, {

});
