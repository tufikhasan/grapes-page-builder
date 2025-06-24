<!DOCTYPE html>
<html>

<head>
    <title>Create New Page</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.7/css/bootstrap.min.css" />
</head>

<body>
    <h1>Create a New Page</h1>
    <form method="POST" action="{{ route('builder.store') }}">
        @csrf
        <div>
            <label>Title:</label>
            <input type="text" name="title" value="{{ old('title') }}" required>
            @error('title')
                <span class="text-danger text-sm">{{ $message }}</span>
            @enderror
        </div>
        <div>
            <label>Slug:</label>
            <input type="text" name="slug" value="{{ old('slug') }}" required>
            @error('slug')
                <span class="text-danger text-sm">{{ $message }}</span>
            @enderror
        </div>
        <button type="submit">Create & Edit</button>
    </form>
</body>

</html>
