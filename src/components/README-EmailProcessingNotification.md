# EmailProcessingNotification Component

A React component that displays real-time progress of email processing jobs, including a progress bar, statistics, and status information.

## Features

- **Real-time progress tracking**: Automatically polls the API at configurable intervals
- **Visual progress bar**: Shows percentage of completion based on processed vs. found emails
- **Detailed statistics**: Displays counts for emails found, processed, orders created, and failures
- **Status indicators**: Different visual styles for pending, processing, completed, and failed states
- **Error handling**: Displays error messages with retry functionality
- **Responsive design**: Adapts to different screen sizes
- **Auto-hide option**: Can automatically hide after completion
- **Callback support**: Provides callbacks for completion and error events

## Usage

```tsx
import EmailProcessingNotification from '@/components/EmailProcessingNotification';

// Basic usage with just the processing ID
<EmailProcessingNotification processingId="cm8dibi0i0001bwxjnko4ko3v" />

// Complete usage with all options
<EmailProcessingNotification
  processingId="cm8dibi0i0001bwxjnko4ko3v"
  onComplete={(job) => console.log('Processing complete!', job)}
  onError={(error) => console.error('Processing error:', error)}
  pollInterval={5000}
  autoHideOnComplete={true}
  autoHideDelay={10000}
/>
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `processingId` | `string` | (Required) | The ID of the email processing job to track |
| `onComplete` | `(job: ProcessingJob) => void` | `undefined` | Callback function triggered when processing completes |
| `onError` | `(error: string) => void` | `undefined` | Callback function triggered when an error occurs |
| `pollInterval` | `number` | `3000` | Time in milliseconds between API polling requests |
| `autoHideOnComplete` | `boolean` | `false` | Whether to automatically hide the component after job completion |
| `autoHideDelay` | `number` | `5000` | Time in milliseconds to wait before hiding after completion |

## States

The component handles several different states:

1. **Loading**: Initial state while fetching the job status
2. **Error**: Displayed when the API call fails
3. **Processing**: Shows progress bar and real-time statistics
4. **Completed**: Shows final results with success styling
5. **Failed**: Shows error information with failure styling

## API Interaction

This component interacts with the `/api/gmail/process-status` endpoint:

- GET request with query parameter `id` to fetch the current job status
- Automatically stops polling when job reaches a terminal state (completed or failed)
- Provides error handling for API failures

## Exported Types

The component exports these TypeScript types for use in other components:

- `ProcessingStats`: Interface for job statistics (emails found, processed, etc.)
- `ProcessingJob`: Interface for the complete job data structure

## Example Response

The component expects API responses in this format:

```json
{
  "id": "cm8dibi0i0001bwxjnko4ko3v",
  "status": "processing", // pending, processing, completed, failed
  "startedAt": "2025-03-17T19:18:18.693Z",
  "completedAt": null,
  "retailer": "Myntra",
  "stats": {
    "emailsFound": 15,
    "emailsProcessed": 8,
    "ordersCreated": 5,
    "failedEmails": 1
  },
  "error": null
}
```

## Integration with Email Processing Workflow

This component is designed to be shown after initiating an email processing job. The typical workflow:

1. User initiates email processing and receives a job ID
2. This component is rendered with that job ID
3. User sees real-time progress as emails are processed
4. Component updates automatically without page refreshes
5. On completion, success message and final statistics are shown 