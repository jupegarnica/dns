/** @jsx h */
import {
    h,
    jsx,
    serve,
} from "https://deno.land/x/sift@0.6.0/mod.ts";

import { Dns, resolveDns } from "./resolveDns.jsx";

serve({
    "/:slug": async (_, connInfo, params) => {

        const domain = params?.slug ?? "garn.dev";

        return jsx(<Dns records={await resolveDns(domain)} domain={domain} />);
    },
}, {

});
