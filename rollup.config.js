import typescript from "rollup-plugin-typescript2";

export default {
	input: "./src/main.ts",

	plugins: [
		typescript( { tsconfig: "tsconfig.rollup.json" } )
	],

    output: {
        file: "public/js/bundle.js",
        sourcemap: "inline"
    }
}
