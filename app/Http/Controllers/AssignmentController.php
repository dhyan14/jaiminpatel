<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AssignmentController extends Controller
{
    public function index()
    {
        $assignments = Auth::user()->assignments;
        return view('assignments.index', compact('assignments'));
    }

    public function create()
    {
        return view('assignments.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assignment_file' => 'required|mimes:pdf|max:10240', // 10MB max
        ]);

        $file = $request->file('assignment_file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('assignments', $fileName, 'public');

        Assignment::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'file_path' => $filePath,
            'submission_date' => now(),
        ]);

        return redirect()->route('assignments.index')
            ->with('success', 'Assignment uploaded successfully.');
    }

    public function show(Assignment $assignment)
    {
        // Check if the user is authorized to view this assignment
        if (Auth::user()->id !== $assignment->user_id && !Auth::user()->hasRole('admin')) {
            abort(403);
        }

        return view('assignments.show', compact('assignment'));
    }

    public function viewPdf(Assignment $assignment)
    {
        // Check if the user is authorized to view this assignment
        if (Auth::user()->id !== $assignment->user_id && !Auth::user()->hasRole('admin')) {
            abort(403);
        }

        return response()->file(storage_path('app/public/' . $assignment->file_path));
    }
} 