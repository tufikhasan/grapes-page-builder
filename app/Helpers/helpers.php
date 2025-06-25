<?php

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;

if (!function_exists('getBuilderComponentFiles')) {
    /**
     * Get all JS component files from public/js/components folder.
     *
     * @return array
     */
    function getBuilderComponentFiles(): array {
        return collect(File::files(public_path('js/components')))
        ->filter(fn($file) => $file->getExtension() === 'js')
        ->map(fn($file) => '/js/components/' . $file->getFilename()) // only filename, no path
        ->values()
        ->toArray();
    }
}
