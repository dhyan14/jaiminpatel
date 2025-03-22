@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Assignment Details</h1>
        <a href="{{ url()->previous() }}" class="btn btn-secondary">Back</a>
    </div>

    <div class="row">
        <div class="col-lg-12">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">{{ $assignment->title }}</h6>
                </div>
                <div class="card-body">
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <p><strong>Student:</strong> {{ $assignment->user->name }}</p>
                            <p><strong>Email:</strong> {{ $assignment->user->email }}</p>
                            <p><strong>Submitted on:</strong> {{ $assignment->submission_date->format('M d, Y H:i') }}</p>
                        </div>
                        <div class="col-md-6">
                            @if($assignment->description)
                                <p><strong>Description:</strong></p>
                                <p>{{ $assignment->description }}</p>
                            @endif
                        </div>
                    </div>

                    <div class="row mb-4">
                        <div class="col-md-12">
                            <h5>Assignment File:</h5>
                            <div class="d-flex">
                                <a href="{{ Storage::url($assignment->file_path) }}" class="btn btn-primary me-2" target="_blank">Download PDF</a>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
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
</div>
@endsection 