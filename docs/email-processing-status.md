# EmailProcessingStatus Model

## Overview
The `EmailProcessingStatus` model is designed to track and manage email processing jobs in the application. It provides detailed information about each job's progress, results, and settings.

## Schema

```prisma
model EmailProcessingStatus {
  id                String    @id @default(cuid())
  userId            String
  startedAt         DateTime  @default(now())
  completedAt       DateTime?
  status            String    // "pending", "processing", "completed", "failed"
  retailer          String?   // e.g., "Myntra"
  searchQuery       String?   @db.Text
  daysBack          Int       @default(30)
  maxEmails         Int       @default(10)
  onlyUnread        Boolean   @default(true)
  emailsFound       Int?
  emailsProcessed   Int?
  ordersCreated     Int?
  failedEmails      Int?
  errorMessage      String?   @db.Text
  lastProcessedId   String?   // Last processed email ID for resuming
  
  // Advanced options and flags
  markAsRead        Boolean   @default(true)
  isAutomated       Boolean   @default(false)
  nextScheduledRun  DateTime?
  
  // Relation to User
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Indexes for better query performance
  @@index([userId, status])
  @@index([userId, startedAt])
  @@index([userId, retailer])
}
```

## Field Descriptions

### Core Fields
- `id`: Unique identifier for the job
- `userId`: The ID of the user who owns this job
- `startedAt`: When the job was created/started
- `completedAt`: When the job was completed (if successful)
- `status`: Current job status (pending, processing, completed, failed)
- `retailer`: The retailer this job is targeting (e.g., "Myntra")

### Search Parameters
- `searchQuery`: The Gmail search query used
- `daysBack`: How many days back to search for emails
- `maxEmails`: Maximum number of emails to process
- `onlyUnread`: Whether to only process unread emails
- `markAsRead`: Whether to mark processed emails as read

### Results
- `emailsFound`: Total number of matching emails found
- `emailsProcessed`: Number of emails successfully processed
- `ordersCreated`: Number of orders created from processed emails
- `failedEmails`: Number of emails that failed to process
- `errorMessage`: Detailed error message if the job failed
- `lastProcessedId`: ID of the last processed email (for resumable jobs)

### Advanced Features
- `isAutomated`: Whether this job was triggered automatically
- `nextScheduledRun`: When the next automated run is scheduled (for recurring jobs)

## Indexes
- `[userId, status]`: For quick filtering by user and status
- `[userId, startedAt]`: For chronological listing of jobs
- `[userId, retailer]`: For filtering by retailer

## Relationships
- Each `EmailProcessingStatus` belongs to one `User`
- A `User` can have many `EmailProcessingStatus` jobs

## Usage Examples

### Creating a new job
```typescript
const newJob = await prisma.emailProcessingStatus.create({
  data: {
    userId: user.id,
    status: 'pending',
    retailer: 'Myntra',
    searchQuery: 'from:myntra.com OR subject:myntra',
    daysBack: 30,
    maxEmails: 50,
    onlyUnread: true,
    markAsRead: true
  }
});
```

### Updating job progress
```typescript
const updatedJob = await prisma.emailProcessingStatus.update({
  where: { id: jobId },
  data: { 
    status: 'processing',
    emailsFound: 15
  }
});
```

### Completing a job
```typescript
const completedJob = await prisma.emailProcessingStatus.update({
  where: { id: jobId },
  data: {
    status: 'completed',
    completedAt: new Date(),
    emailsProcessed: 12,
    ordersCreated: 8,
    failedEmails: 3
  }
});
```

### Listing a user's recent jobs
```typescript
const recentJobs = await prisma.emailProcessingStatus.findMany({
  where: { 
    userId: user.id,
    status: 'completed'
  },
  orderBy: { startedAt: 'desc' },
  take: 10
});
```

## Benefits

1. **Job Tracking**: Provides detailed tracking of email processing tasks
2. **Error Handling**: Captures detailed error information for troubleshooting
3. **Performance Metrics**: Tracks processing statistics (emails found, processed, etc.)
4. **User History**: Maintains history of processing jobs for each user
5. **Resumability**: Supports resuming interrupted jobs with `lastProcessedId`
6. **Automation Support**: Fields for automated/scheduled processing jobs 