import * as rolldown from "rolldown";

rolldown.build({
    input: "main.ts",
    platform: "node",
    treeshake: true,
    output: {
        file: "dist/index.js",
        exports: "none",
        minify: true,
        format: "es",
    }
})