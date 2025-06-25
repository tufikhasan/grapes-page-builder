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


        // Inject Bootstrap CSS and Font Awesome into the canvas
        editor.on("load", () => {
            // Load project data before manipulating iframe
            @if ($page->json)
                editor.loadProjectData({!! json_encode(json_decode($page->json))!!});
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