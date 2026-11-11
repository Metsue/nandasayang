<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnniversaryController;

Route::get('/', AnniversaryController::class)->name('anniversary');
