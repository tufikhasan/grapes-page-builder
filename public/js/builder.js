const editor = grapesjs.init({
    container: "#gjs",
    height: "100vh",
    width: "auto",
    fromElement: false,
    storageManager: false,

    // canvas: {
    //     styles: [
    //         "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css",
    //     ],
    //     scripts: [
    //         "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js",
    //         "/js/custom.js",
    //     ],
    // },

    plugins: [
        "gjs-preset-webpage",
        "gjs-blocks-basic",
        "grapesjs-component-code-editor",
    ],

    pluginsOpts: {
        "gjs-blocks-basic": {},
        "grapesjs-component-code-editor": {},
    },
});
function updateEditorParts(html) {
    // Remove <body> and </body> tags
    html = html
        .replace(/<\s*body[^>]*>/gi, "")
        .replace(/<\s*\/\s*body\s*>/gi, "");

    // Replace dynamic parts with Blade @include directive
    html = html.replace(
        /<!--\s*DYNAMIC_PART_START:(.*?)\s*-->([\s\S]*?)<!--\s*DYNAMIC_PART_END\s*-->/g,
        (match, path) => {
            const trimmedPath = path.trim();
            return `<!-- DYNAMIC_PART_START:${trimmedPath} -->\n@include('${trimmedPath}')\n<!-- DYNAMIC_PART_END -->`;
        }
    );

    return html;
}
