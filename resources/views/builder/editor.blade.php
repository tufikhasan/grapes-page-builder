<!DOCTYPE html>
<html>

<head>
    <title>Editor - {{ $page->title }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="base-url" content="{{ url('/') }}">
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
    <input type="hidden" id="page_id" value="{{$page->id}}">

    <script src="https://unpkg.com/grapesjs"></script>
    <script src="https://unpkg.com/grapesjs-preset-webpage"></script>
    <script src="https://unpkg.com/grapesjs-blocks-basic"></script>
    <script src="https://unpkg.com/grapesjs-component-code-editor"></script>
    <script src="{{ asset('js/builder.js') }}"></script>

    <script>
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
    </script>

</body>

</html>