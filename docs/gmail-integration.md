# Gmail Integration for Vera Wardrobe Management

## Overview

The Gmail integration in Vera enables automatic extraction of purchase information from retailer emails (like Myntra) to build your wardrobe without manual data entry. This document explains how the integration works, how to set it up, and its current limitations.

```
┌─────────────────┐          ┌──────────────┐          ┌─────────────┐
│                 │          │              │          │             │
│  Vera Frontend  │◄────────►│  Vera API    │◄────────►│  Gmail API  │
│  (React/Next.js)│          │  (Next.js)   │          │  (Google)   │
│                 │          │              │          │             │
└────────┬────────┘          └──────┬───────┘          └─────────────┘
         │                          │
         │                          │
         ▼                          ▼
┌─────────────────┐          ┌──────────────┐
│                 │          │              │
│  UI Components  │          │  Database    │
│  - GmailSettings│          │  - User      │
│  - GmailSyncPage│          │  - Orders    │
│  - TokenStatus  │          │  - Processing│
│                 │          │    Status    │
└─────────────────┘          └──────────────┘

                 Email Processing Flow
┌────────┐    ┌─────────┐    ┌────────┐    ┌────────┐
│        │    │         │    │        │    │        │
│ Fetch  │───►│ Extract │───►│ Retry  │───►│ Store  │
│ Emails │    │ Orders  │    │ Logic  │    │ Data   │
│        │    │         │    │        │    │        │
└────────┘    └─────────┘    └────────┘    └────────┘
```

## Table of Contents

- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Technical Architecture](#technical-architecture)
- [Components](#components)
- [API Endpoints](#api-endpoints)
- [Type System](#type-system)
- [Error Handling](#error-handling)
- [Retry Mechanism](#retry-mechanism)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [Troubleshooting](#troubleshooting)

## Features

- **OAuth2 Authentication**: Secure connection to user Gmail accounts
- **Token Refresh**: Automatic handling of expired tokens
- **Email Processing**: 
  - Extract order information from retailer emails
  - Parse structured data from HTML/text content
  - Process PDF attachments when needed
- **Retry Mechanism**: Handles transient failures gracefully
- **Monitoring**: Track token status and processing jobs
- **Manual Controls**: Sync on demand, disconnect anytime

## Setup Instructions

### Prerequisites

1. Google Cloud Platform account with Gmail API enabled
2. OAuth2 credentials (Client ID, Client Secret)
3. PostgreSQL database

### Environment Variables

Add these to your `.env` file:

```
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=https://your-app.com/api/auth/gmail/callback
```

### Installation

1. **Install dependencies**

```bash
npm install googleapis google-auth-library
```

2. **Set up database tables**

The Prisma schema already includes necessary tables:
- `User` table with Gmail token fields
- `EmailProcessingStatus` for tracking jobs
- `Order` for storing extracted order information

3. **Configure OAuth Consent Screen**

In Google Cloud Console:
- Set up OAuth consent screen
- Add required scopes:
  - `https://www.googleapis.com/auth/gmail.readonly`
  - `https://www.googleapis.com/auth/gmail.modify`

4. **Enable the Gmail Sync page**

Add the Gmail Sync page to your navigation:

```tsx
<Link href="/gmail-sync">Gmail Sync</Link>
```

## Technical Architecture

The Gmail integration uses a layered architecture:

1. **UI Layer**: React components for connecting accounts and viewing status
2. **API Layer**: Next.js API routes for handling OAuth and processing
3. **Service Layer**: Core Gmail and email processing logic
4. **Data Layer**: Prisma for database operations

### Authentication Flow

1. User initiates connection from the UI
2. System redirects to Google OAuth consent screen
3. Google redirects back with authorization code
4. System exchanges code for tokens
5. Tokens stored securely in database
6. Tokens refreshed automatically when needed

## Components

### UI Components

1. **GmailSettings**
   - Displays connection status 
   - Provides connect/disconnect buttons
   - Shows last sync time

2. **GmailSyncPage**
   - Manual email processing controls
   - Sync history and statistics
   - Configuration options

3. **GmailTokenStatus**
   - Detailed token information
   - Force token refresh option
   - Debugging information

### Core Services

1. **gmail-auth.ts**
   - OAuth client setup
   - Token retrieval and refresh
   - Authentication helpers

2. **gmail-service.ts**
   - Gmail API client initialization
   - Email listing and reading
   - Attachment handling

3. **email-processor.ts**
   - Email classification
   - Order information extraction
   - Multi-tier processing (HTML, text, PDF)

4. **retry-utils.ts**
   - Exponential backoff
   - Smart retry conditions
   - Error categorization

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/gmail/url` | GET | Get OAuth authorization URL |
| `/api/auth/gmail` | POST | Handle OAuth callback, store tokens |
| `/api/auth/gmail/status` | GET | Check connection status |
| `/api/auth/gmail/disconnect` | POST | Remove Gmail authorization |
| `/api/gmail/token-status` | GET | Get detailed token status |
| `/api/gmail/token-status` | POST | Force token refresh |
| `/api/gmail/sync-history` | GET | Get email processing history |
| `/api/gmail/process-myntra-emails` | POST | Process Myntra emails |
| `/api/test-retry` | GET | Test retry mechanism |

## Type System

The Gmail integration uses a comprehensive TypeScript type system defined in `src/types/gmail.ts`:

### Authentication Types
- `GmailToken`: OAuth token information
- `GmailConnectionStatus`: Connection status
- `TokenRefreshResult`: Token refresh operation results

### Email Types
- `EmailMessage`: Email message structure
- `EmailAttachment`: Email attachment structure
- `EmailSearchOptions`: Email search parameters

### Order/Product Types
- `EmailProduct`: Product information extracted from emails
- `OrderInfo`: Order information with items, shipping, etc.

### Processing Types
- `EmailProcessingResult`: Email processing operation results
- `EmailProcessingStatus`: Email processing job status

## Error Handling

The Gmail integration implements robust error handling:

1. **API Error Structure**
   - User-friendly messages
   - Detailed error codes
   - Debug information

2. **Authentication Errors**
   - Token expiration
   - Permission revocation
   - Scope changes

3. **Processing Errors**
   - Content extraction failures
   - API rate limits
   - Network issues

## Retry Mechanism

A sophisticated retry system handles transient failures:

1. **Exponential Backoff**
   - Gradually increasing delays
   - Random jitter to prevent thundering herd
   - Configurable maximum retries

2. **Smart Retry Conditions**
   - Distinguishes between transient and permanent errors
   - Retries network failures, timeouts, rate limits
   - Avoids retrying authentication or validation errors

3. **Multi-tier Approach**
   - HTML parsing: 2 retry attempts
   - Regex-based extraction: single attempt (deterministic)
   - PDF extraction: MAX_RETRIES attempts (3 by default)

## Limitations

The current implementation has several limitations:

1. **Retailer Support**
   - Currently optimized for Myntra emails
   - Limited support for other retailers

2. **PDF Processing**
   - Basic PDF text extraction
   - No advanced document understanding

3. **Order Matching**
   - Potential for duplicate orders
   - Limited reconciliation with tracking updates

4. **Scalability**
   - May encounter rate limits with high volume
   - Sequential processing of emails

5. **Authentication**
   - No handling of multi-account scenarios
   - Limited session management integration

## Future Improvements

Planned enhancements for the Gmail integration:

1. **Enhanced Retailer Support**
   - Add support for Amazon, Flipkart, etc.
   - Create pluggable retailer extraction modules

2. **Advanced PDF Processing**
   - Integrate with Mistral AI for better extraction
   - OCR capabilities for image-based receipts

3. **Order Lifecycle Management**
   - Track shipping updates
   - Order status reconciliation

4. **Performance Optimization**
   - Parallel processing of emails
   - Incremental sync of new emails only

5. **User Experience**
   - Preview of data before importing
   - Manual correction of extracted information

## Troubleshooting

### Common Issues

1. **Connection Failures**
   - Check that OAuth consent screen is properly configured
   - Verify redirect URI matches exactly
   - Ensure all required scopes are approved

2. **Token Refresh Issues**
   - Check that refresh token is being stored
   - Verify client ID and secret are correct
   - Look for token expiration or revocation

3. **Email Processing Errors**
   - Check email format variations
   - Verify retailer-specific extraction patterns
   - Examine logs for specific parsing failures

### Debugging Tools

1. **Token Status Endpoint**
   - `/api/gmail/token-status` provides details on token health
   - Can force refresh to test token flow

2. **Retry Test Endpoint**
   - `/api/test-retry` simulates various failure scenarios
   - Helps validate retry mechanism

3. **Logs**
   - Processing logs contain detailed error information
   - Retry attempts are logged with contextual data

### Support

For additional help:
- Check the GitHub repository issues
- Contact the development team
- Consider contributing improvements 