const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

/********************************
 * editor initialize
 ********************************/
const editor = grapesjs.init({
    container: "#gjs",
    height: "100vh",
    fromElement: true,
    storageManager: false,
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
// Example usage inside your main script
loadComponentModules(editor);
/********************************
 * Save Button
 ********************************/
// Button
editor.Panels.addButton("options", [
    {
        id: "save-page",
        className: "fa fa-floppy-o",
        command: "save-page",
        attributes: {
            title: "Save Page",
        },
    },
]);
// Command
editor.Commands.add("save-page", {
    async run(editor, sender) {
        sender && sender.set("active", false);

        const html = editor.getHtml();
        const css = editor.getCss();
        const js = editor.getJs();
        const json = JSON.stringify(editor.getProjectData());
        const content = updateEditorParts(html);

        try {
            const res = await fetch(window.pageSaveUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    html,
                    css,
                    js,
                    json,
                    content,
                }),
            });

            const data = await res.json();
            showToast("Page saved successfully!", "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to save page.", "error");
        }
    },
});
/*** body content format method ***/
// function updateEditorParts(html) {
//     // Remove <body> and </body> tags
//     html = html
//         .replace(/<\s*body[^>]*>/gi, "")
//         .replace(/<\s*\/\s*body\s*>/gi, "");

//     // Remove all <script>...</script> tags including multiline and inline
//     html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

//     // Replace dynamic parts with Blade @include directive
//     html = html.replace(
//         /<!--\s*DYNAMIC_PART_START:(.*?)\s*-->([\s\S]*?)<!--\s*DYNAMIC_PART_END\s*-->/g,
//         (match, path) => {
//             const trimmedPath = path.trim();
//             return `<!-- DYNAMIC_PART_START:${trimmedPath} -->\n@include('${trimmedPath}')\n<!-- DYNAMIC_PART_END -->`;
//         }
//     );

//     return html;
// }

/*** body content format method with params ***/
function updateEditorParts(html) {
    // Remove <body> and </body> tags
    html = html
        .replace(/<\s*body[^>]*>/gi, "")
        .replace(/<\s*\/\s*body\s*>/gi, "");

    // Remove all <script>...</script> tags including multiline and inline
    html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

    // Replace dynamic parts with Blade @include directive
    html = html.replace(
        /<!--\s*DYNAMIC_PART_START:(\S+)([^>]*)-->([\s\S]*?)<!--\s*DYNAMIC_PART_END\s*-->/g,
        (match, path, paramsString) => {
            const trimmedPath = path.trim();

            // Parse params string like ' count=4 filter=latest userId=123'
            const params = {};
            paramsString
                .trim()
                .split(/\s+/)
                .forEach((pair) => {
                    if (!pair) return;
                    const [key, val] = pair.split("=");
                    if (key && val !== undefined) {
                        params[key] = val.replace(/^["']|["']$/g, ""); // remove quotes if any
                    }
                });

            // Convert params object to PHP array string for blade
            const bladeParams = Object.entries(params).map(([k, v]) => `'${k}' => '${v}'`).join(", ");
            // include dynamic path and check params exist or not
            const includePart = bladeParams.length > 0 ? `@include('${trimmedPath}', [${bladeParams}])` : `@include('${trimmedPath}')`;
            return `<!-- ${capitalizeWords(trimmedPath + " Start" )} -->\n${includePart}\n<!-- ${capitalizeWords(trimmedPath + " End")} -->`;
        }
    );

    return html;
}
function capitalizeWords(str) {
    return str
        .split(/[_\-.,]/) // escape dash for clarity
        .filter(Boolean) // remove empty strings from split results
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
// toast
function showToast(message, type) {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === "success" ? "#22c55e" : "#ef4444"};
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 9999;
                font-family: sans-serif;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
/********************************
 * load
 ********************************/
// styles
const styles = [
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.7/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
    "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css",
];
// scripts
const scripts = [
    "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js",
    "/js/custom.js",
];
// Inject Bootstrap CSS and Font Awesome into the canvas
editor.on("load", () => {
    if (window.pageJson) {
        editor.loadProjectData(window.pageJson);
    }
    const iframe = editor.Canvas.getFrameEl();
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    // Add CSS links
    styles.forEach((href) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        iframeDoc.head.appendChild(link);
    });

    // Add JS scripts
    scripts.forEach((src) => {
        const script = document.createElement("script");
        script.src = src; // ✅ corrected
        script.type = "text/javascript";
        iframeDoc.body.appendChild(script);
    });
});
/********************************
 * Sections
 ********************************/
async function loadComponentModules(editor) {
    try {
        const res = await fetch("/component-files");
        const componentFiles = await res.json();

        for (const file of componentFiles) {
            if (!file || typeof file !== "string") continue; // Skip empty or invalid entries

            try {
                const module = await import(file);
                if (typeof module.default === "function") {
                    module.default(editor);
                }
            } catch (err) {
                console.error(`❌ Failed to load: ${file}`, err);
            }
        }
    } catch (e) {
        console.error("❌ Failed to fetch component files", e);
    }
}
