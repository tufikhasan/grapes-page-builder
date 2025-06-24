<!DOCTYPE html>
<html>

<head>
    <title>Editor - {{ $page->title }}</title>
    <link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
    <link href="https://unpkg.com/grapesjs-component-code-editor/dist/grapesjs-component-code-editor.min.css"
        rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

    <style>
        html,
        body {
            margin: 0;
            height: 100%;
        }
    </style>
</head>

<body>
    <div id="gjs" style="height:100vh;"></div>

    <script src="https://unpkg.com/grapesjs"></script>
    <script src="https://unpkg.com/grapesjs-preset-webpage"></script>
    <script src="https://unpkg.com/grapesjs-blocks-basic"></script>
    <script src="https://unpkg.com/grapesjs-component-code-editor"></script>
    <script src="{{ asset('js/builder.js') }}"></script>

    <script>
        editor.DomComponents.addType('category-component', {
            model: {
                defaults: {
                    components: `
                    <section>
                        <h2>Swiper Slider</h2>
                        <!-- DYNAMIC_PART_START:components.category -->
                        <div class="swiper categories-active">
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
                            <button class="categories-button-prev">
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 7L1 7M1 7L7 1M1 7L7 13" stroke="#161439" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <button class="categories-button-next">
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 7L15 7M15 7L9 1M15 7L9 13" stroke="#161439" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <!-- DYNAMIC_PART_END -->
                    </section>`,
                },
                init() {
                    const wrapper = this;

                    // Recursive function to disable editable except for h5 and h2
                    const disableEditExcept = (comp) => {
                        const tag = comp.get('tagName')?.toUpperCase();
                        const isAllowed = ['H5', 'H2'].includes(tag);
                        comp.set({
                            editable: isAllowed,
                            draggable: false,
                            droppable: false,
                            copyable: false,
                            selectable: isAllowed,
                        });

                        comp.components().forEach(child => disableEditExcept(child));
                    };

                    // Start from this component
                    disableEditExcept(wrapper);
                }
            },
        });

        editor.BlockManager.add('category-section', {
            label: 'Category Section',
            category: 'Sections',
            content: {
                type: 'category-component'
            },
            media: `<i class="fas fa-th-large"></i>`,
        });
        // ✅ Save Button
        editor.Panels.addButton('options', [{
            id: 'save-page',
            className: 'fa fa-floppy-o',
            command: 'save-page',
            attributes: {
                title: 'Save Page'
            }
        }]);

        // ✅ Save Command
        editor.Commands.add('save-page', {
            async run(editor, sender) {
                sender && sender.set('active', false);

                const html = editor.getHtml();
                const css = editor.getCss();
                const js = editor.getJs();
                const json = JSON.stringify(editor.getProjectData());
                const content = updateEditorParts(html);

                try {
                    const res = await fetch('{{ route('builder.save', $page->id) }}', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': '{{ csrf_token() }}'
                        },
                        body: JSON.stringify({
                            html,
                            css,
                            js,
                            json,
                            content,
                        })
                    });

                    const data = await res.json();
                    showToast("Page saved successfully!", "success");

                } catch (e) {
                    console.error(e);
                    showToast("Failed to save page.", "error");
                }
            }
        });

        function showToast(message, type) {
            const toast = document.createElement('div');
            toast.innerText = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#22c55e' : '#ef4444'};
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

        // Inject Bootstrap CSS and Font Awesome into the canvas
        editor.on("load", () => {
            // Load project data before manipulating iframe
            @if ($page->json)
                editor.loadProjectData({!! json_encode(json_decode($page->json)) !!});
            @endif

            const iframe = editor.Canvas.getFrameEl();
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            const styles = [
                "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
                "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css",
            ];

            const scripts = [
                "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js",
                "/js/custom.js",
            ];

            // Wait a short time to ensure iframe is ready
            setTimeout(() => {
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
            }, 200); // slight delay to ensure iframe is fully built
        });
    </script>

</body>

</html>
