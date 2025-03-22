@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>My Assignments</span>
                    <a href="{{ route('assignments.create') }}" class="btn btn-primary btn-sm">Upload Assignment</a>
                </div>

                <div class="card-body">
                    @if (session('success'))
                        <div class="alert alert-success">
                            {{ session('success') }}
                        </div>
                    @endif

                    @if($assignments->count() > 0)
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Submission Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($assignments as $assignment)
                                <tr>
                                    <td>{{ $assignment->title }}</td>
                                    <td>{{ $assignment->submission_date->format('M d, Y H:i') }}</td>
                                    <td>
                                        <a href="{{ route('assignments.show', $assignment) }}" class="btn btn-info btn-sm">View</a>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @else
                        <p>You haven't uploaded any assignments yet.</p>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection 