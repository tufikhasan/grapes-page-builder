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
/********************************
 * body content format method
 ********************************/
function updateEditorParts(html) {
    // Remove <body> and </body> tags
    html = html
        .replace(/<\s*body[^>]*>/gi, "")
        .replace(/<\s*\/\s*body\s*>/gi, "");

    // Remove all <script>...</script> tags including multiline and inline
    html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

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
// category-component
editor.DomComponents.addType("category-component", {
    model: {
        defaults: {
            components: `
                    <section>
                        <h2>Swiper Slider</h2>
                        <div class="row">
                            <!-- DYNAMIC_PART_START:components.category -->
                            <div class="swiper">
                                <div class="swiper-wrapper">
                                        <div class="swiper-slide">
                                            <span>Item 01</span>
                                        </div>
                                        <div class="swiper-slide">
                                            <span>Item 02</span>
                                        </div>
                                        <div class="swiper-slide">
                                            <span>Item 03</span>
                                        </div>
                                        <div class="swiper-slide">
                                            <span>Item 04</span>
                                        </div>
                                </div>
                            </div>
                            <div>
                                <button class="button-prev">
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 7L1 7M1 7L7 1M1 7L7 13" stroke="#161439" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                                <button class="button-next">
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 7L15 7M15 7L9 1M15 7L9 13" stroke="#161439" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <!-- DYNAMIC_PART_END -->
                        </div>
                    </section>`,
            script: function () {
                var categoriesSwiper = new Swiper(".swiper", {
                    // Optional parameters
                    slidesPerView: 1,
                    loop: true,
                    // Navigation arrows
                    navigation: {
                        nextEl: ".button-next",
                        prevEl: ".button-prev",
                    },
                });
            },
        },
        init() {
            const wrapper = this;
            const disableEditExcept = (comp, isRoot = false) => {
                const tag = comp.get("tagName")?.toUpperCase();
                const isAllowed = ["H5", "H2"].includes(tag);

                comp.set({
                    editable: isAllowed,
                    draggable: isRoot, //allow root to be draggable
                    droppable: false,
                    copyable: false,
                    selectable: isAllowed || isRoot, // allow root and allow tags to be selectable
                });

                comp.components().forEach((child) =>
                    disableEditExcept(child, false)
                );
            };

            disableEditExcept(wrapper, true); // Pass `true` for root
        },
    },
});

editor.BlockManager.add("category-section", {
    label: "Category Section",
    category: "Sections",
    content: {
        type: "category-component",
    },
    media: `<i class="fas fa-th-large"></i>`,
});
// table-component
editor.DomComponents.addType("table-component", {
    model: {
        defaults: {
            name: "Table",
            droppable: false,
            draggable: true,
            selectable: true,
            highlightable: true,
            components: [
                {
                    tagName: "table",
                    classes: ["table", "w-full", "border"],
                    components: [
                        {
                            tagName: "thead",
                            components: [
                                {
                                    tagName: "tr",
                                    selectable: true,
                                    components: [
                                        {
                                            tagName: "th",
                                            components: [
                                                { type: "text", content: "#" },
                                            ],
                                        },
                                        {
                                            tagName: "th",
                                            components: [
                                                {
                                                    type: "text",
                                                    content: "First",
                                                },
                                            ],
                                        },
                                        {
                                            tagName: "th",
                                            components: [
                                                {
                                                    type: "text",
                                                    content: "Last",
                                                },
                                            ],
                                        },
                                        {
                                            tagName: "th",
                                            components: [
                                                {
                                                    type: "text",
                                                    content: "Handle",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            tagName: "tbody",
                            components: [
                                {
                                    tagName: "tr",
                                    selectable: true,
                                    components: [
                                        {
                                            tagName: "th",
                                            attributes: { scope: "row" },
                                            components: [
                                                { type: "text", content: "1" },
                                            ],
                                        },
                                        {
                                            tagName: "td",
                                            components: [
                                                {
                                                    type: "text",
                                                    content: "Mark",
                                                },
                                            ],
                                        },
                                        {
                                            tagName: "td",
                                            components: [
                                                {
                                                    type: "text",
                                                    content: "Otto",
                                                },
                                            ],
                                        },
                                        {
                                            tagName: "td",
                                            components: [
                                                {
                                                    type: "text",
                                                    content: "@mdo",
                                                },
                                            ],
                                        },
                                    ],
                                },
                                // Add more <tr> like above
                            ],
                        },
                    ],
                },
            ],
        },
    },
});

editor.BlockManager.add("table-section", {
    label: "Table",
    category: "Sections",
    content: {
        type: "table-component",
    },
    media: `<i class="fas fa-list"></i>`,
});
