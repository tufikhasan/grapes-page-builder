<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ $page?->title }}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.7/css/bootstrap.min.css">
    @if ($page->css)
        <style>{!! $page->css !!}</style>
    @endif
</head>

<body>
    {{-- @dd($page) --}}
    {{-- {!! $page->html !!} --}}
    {!! $renderedContent !!}
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
    @if ($page->js)
        <script>
            document.addEventListener("DOMContentLoaded", function () {
                {!! $page->js !!}
            });
        </script>
    @endif
</body>

</html>