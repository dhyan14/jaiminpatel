<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\User;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index()
    {
        $assignments = Assignment::with('user')->latest()->get();
        return view('admin.assignments.index', compact('assignments'));
    }

    public function show(Assignment $assignment)
    {
        return view('admin.assignments.show', compact('assignment'));
    }
    
    public function byStudent()
    {
        $students = User::whereHas('assignments')->withCount('assignments')->get();
        return view('admin.assignments.by-student', compact('students'));
    }
    
    public function studentAssignments(User $user)
    {
        $assignments = $user->assignments;
        return view('admin.assignments.student-assignments', compact('user', 'assignments'));
    }
} 