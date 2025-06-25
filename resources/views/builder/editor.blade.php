<!DOCTYPE html>
<html>

<head>
    <title>Editor - {{ $page->title }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
    <link href="https://unpkg.com/grapesjs-component-code-editor/dist/grapesjs-component-code-editor.min.css"
        rel="stylesheet">
    {{-- @vite('resources/css/app.css') --}}
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
    <script>
        window.pageJson = @json(json_decode($page->json) ?? []);
        window.pageSaveUrl = @json(route('builder.save',$page->id));
        window.builderComponentsFiles = @json(getBuilderComponentFiles());
    </script>
    <script type="module" src="{{ asset('js/builder.js') }}"></script>
    {{-- @vite('resources/js/builder.js') --}}
</body>

</html>