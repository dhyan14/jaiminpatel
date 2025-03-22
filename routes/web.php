<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\Admin\AssignmentController as AdminAssignmentController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_middleware')
])->group(function () {
    Route::get('/', function () {
        return view('welcome');
    });
});

Route::middleware([
    'auth'
])->group(function () {
    Route::get('/assignments', [AssignmentController::class, 'index'])->name('assignments.index');
    Route::get('/assignments/create', [AssignmentController::class, 'create'])->name('assignments.create');
    Route::post('/assignments', [AssignmentController::class, 'store'])->name('assignments.store');
    Route::get('/assignments/{assignment}', [AssignmentController::class, 'show'])->name('assignments.show');
    Route::get('/assignments/{assignment}/view', [AssignmentController::class, 'viewPdf'])->name('assignments.view');
});

Route::middleware([
    'auth', 'role:admin'
])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/assignments', [AdminAssignmentController::class, 'index'])->name('assignments.index');
    Route::get('/assignments/by-student', [AdminAssignmentController::class, 'byStudent'])->name('assignments.by-student');
    Route::get('/assignments/student/{user}', [AdminAssignmentController::class, 'studentAssignments'])->name('assignments.student');
    Route::get('/assignments/{assignment}', [AdminAssignmentController::class, 'show'])->name('assignments.show');
});

Route::middleware([
    'auth'
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});

require __DIR__.'/auth.php';

Route::get('/', function () {
    return view('welcome');
}); 