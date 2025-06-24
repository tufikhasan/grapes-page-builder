<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::controller(PageController::class)->group(function () {
    Route::get('/builder/show/{slug}', 'index')->name('builder.index');
    Route::get('/builder/create', 'create')->name('builder.create');
    Route::post('/builder/create', 'store')->name('builder.store');

    Route::get('/builder/{slug}', 'edit')->name('builder.edit');
    Route::post('/builder/{id}', 'save')->name('builder.save');
});