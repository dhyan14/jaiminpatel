@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Assignment Details</span>
                    <a href="{{ route('assignments.index') }}" class="btn btn-secondary btn-sm">Back to Assignments</a>
                </div>

                <div class="card-body">
                    <h4>{{ $assignment->title }}</h4>
                    <p><strong>Submitted on:</strong> {{ $assignment->submission_date->format('M d, Y H:i') }}</p>
                    
                    @if($assignment->description)
                        <div class="mb-4">
                            <h5>Description:</h5>
                            <p>{{ $assignment->description }}</p>
                        </div>
                    @endif

                    <div class="mb-4">
                        <h5>Assignment File:</h5>
                        <div class="d-flex">
                            <a href="{{ Storage::url($assignment->file_path) }}" class="btn btn-primary me-2" target="_blank">Download PDF</a>
                            <a href="{{ route('assignments.view', $assignment) }}" class="btn btn-info" target="_blank">View PDF</a>
                        </div>
                    </div>

                    <div class="mt-4">
                        <h5>PDF Preview:</h5>
                        <div style="height: 600px; width: 100%;">
                            <embed src="{{ Storage::url($assignment->file_path) }}" type="application/pdf" width="100%" height="100%">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection 