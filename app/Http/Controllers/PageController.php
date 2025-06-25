<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Blade;

class PageController extends Controller {
    public function index($slug) {
        $page = Page::whereSlug($slug)->firstOrFail();
        $renderedContent = Blade::render($page->content);
        return view('builder.index', compact('page', 'renderedContent'));
    }
    public function create() {
        return view('builder.create');
    }

    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug'  => 'required|string|max:255|unique:pages,slug',
        ]);

        $page = Page::create([
            'title' => $request->title,
            'slug'  => $request->slug,
        ]);

        return redirect()->route('builder.edit', $page->slug);
    }

    public function edit($slug) {
        $page = Page::whereSlug($slug)->firstOrFail();
        return view('builder.editor', compact('page'));
    }

    public function save(Request $request, $id) {
        $page = Page::findOrFail($id);

        $page->update([
            'html'    => null,
            'css'     => null,
            'js'      => null,
            'json'    => null,
            'content' => null,
        ]);

        $page->update([
            'html'    => $request->input('html',null),
            'css'     => $request->input('css',null),
            'js'      => $request->input('js',null),
            'json'    => $request->input('json',null),
            'content' => $request->input('content',null),
        ]);

        return response()->json(['status' => 'success']);
    }

}
