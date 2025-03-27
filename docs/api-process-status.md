# Email Processing Status API

## Overview

This API provides endpoints for checking the status of email processing jobs and retrieving job history. It enables clients to track the progress of ongoing jobs, view detailed results of completed jobs, and retrieve job history for analytics and debugging.

## Endpoints

### GET /api/gmail/process-status

Retrieves detailed information about a specific email processing job.

#### Query Parameters

- `id`: The ID of the processing job to check (required)

#### Response

**Success (200 OK)**

```json
{
  "id": "cm8dibi0i0001bwxjnko4ko3v",
  "status": "completed",
  "startedAt": "2025-03-17T19:18:18.693Z",
  "completedAt": "2025-03-17T20:18:18.693Z",
  "retailer": "Myntra",
  "stats": {
    "emailsFound": 15,
    "emailsProcessed": 12,
    "ordersCreated": 8,
    "failedEmails": 4
  },
  "error": null,
  "settings": {
    "daysBack": 30,
    "maxEmails": 50,
    "onlyUnread": true,
    "markAsRead": true
  }
}
```

**Error Responses**

- `400 Bad Request`: Missing job ID
  ```json
  {
    "error": "Missing job ID",
    "details": "Please provide a valid job ID parameter"
  }
  ```

- `401 Unauthorized`: User not authenticated
  ```json
  {
    "error": "Unauthorized"
  }
  ```

- `403 Forbidden`: User not authorized to access the job
  ```json
  {
    "error": "Forbidden",
    "details": "You do not have permission to access this job"
  }
  ```

- `404 Not Found`: Job not found
  ```json
  {
    "error": "Processing job not found",
    "details": "The requested job does not exist"
  }
  ```

- `500 Internal Server Error`: Server error
  ```json
  {
    "error": "Failed to check processing status",
    "details": "Error message"
  }
  ```

### POST /api/gmail/process-status

Retrieves a list of email processing jobs for the authenticated user, with support for filtering and pagination.

#### Request Body

```json
{
  "status": "completed",  // Optional: Filter by status
  "retailer": "Myntra",   // Optional: Filter by retailer
  "limit": 10,            // Optional: Number of jobs to return (default: 10)
  "offset": 0             // Optional: Number of jobs to skip (default: 0)
}
```

#### Response

**Success (200 OK)**

```json
{
  "jobs": [
    {
      "id": "cm8dibi0i0001bwxjnko4ko3v",
      "status": "completed",
      "retailer": "Myntra",
      "startedAt": "2025-03-17T19:18:18.693Z",
      "completedAt": "2025-03-17T20:18:18.693Z",
      "stats": {
        "emailsFound": 15,
        "emailsProcessed": 12,
        "ordersCreated": 8,
        "failedEmails": 4
      }
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

**Error Responses**

- `401 Unauthorized`: User not authenticated
  ```json
  {
    "error": "Unauthorized"
  }
  ```

- `500 Internal Server Error`: Server error
  ```json
  {
    "error": "Failed to get processing jobs",
    "details": "Error message"
  }
  ```

## Usage Examples

### Check the status of a specific job

```javascript
const response = await fetch(`/api/gmail/process-status?id=${jobId}`);
const data = await response.json();

if (response.ok) {
  console.log(`Job Status: ${data.status}`);
  console.log(`Emails Processed: ${data.stats.emailsProcessed}`);
  console.log(`Orders Created: ${data.stats.ordersCreated}`);
} else {
  console.error(`Error: ${data.error}`);
}
```

### Get a list of completed jobs

```javascript
const response = await fetch('/api/gmail/process-status', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'completed',
    limit: 5
  }),
});

const data = await response.json();

if (response.ok) {
  console.log(`Found ${data.jobs.length} completed jobs`);
  data.jobs.forEach(job => {
    console.log(`Job ID: ${job.id}, Retailer: ${job.retailer}`);
  });
} else {
  console.error(`Error: ${data.error}`);
}
```

## Error Handling

The API includes comprehensive error handling to provide meaningful error messages to clients:

1. **Authentication**: All endpoints require user authentication via NextAuth.js.
2. **Authorization**: Users can only access jobs that belong to them.
3. **Input Validation**: Parameters are validated with appropriate error messages.
4. **Not Found**: Clear error messages when a job ID doesn't exist.
5. **Server Errors**: Detailed error information for debugging.

## Implementation Notes

- The API uses the Prisma ORM to interact with the database
- The `runtime = 'nodejs'` configuration ensures compatibility with Prisma
- Authentication is handled through NextAuth.js
- All endpoints include robust error handling 