# Gmail Integration Documentation

Welcome to the Gmail integration documentation for the Vera application. This directory contains comprehensive documentation covering all aspects of the Gmail integration feature.

## Documentation Overview

| Document | Description |
|----------|-------------|
| [Gmail Integration](./gmail-integration.md) | Main documentation file explaining the architecture, setup, features, and limitations of the Gmail integration |
| [Gmail Integration Examples](./gmail-integration-examples.md) | Code examples demonstrating how to use various features of the Gmail integration |
| [Gmail Integration Testing](./gmail-integration-testing.md) | Testing strategies, unit test examples, and mocking approaches for the Gmail integration |
| [Gmail Integration Test Plan](./gmail-integration-test-plan.md) | Comprehensive test plan with detailed scenarios for manual testing of all aspects of the integration |
| [Gmail Integration Checklist](./gmail-integration-checklist.md) | Deployment checklist covering security, privacy, and operational considerations |

## Quick Start

To get started with the Gmail integration:

1. Configure your Google Cloud Platform project with OAuth credentials
2. Set up the required environment variables:
   ```
   GMAIL_CLIENT_ID=your_client_id
   GMAIL_CLIENT_SECRET=your_client_secret
   GMAIL_REDIRECT_URI=https://your-domain.com/api/auth/gmail/callback
   ```
3. Implement the Gmail connection UI component in your application
4. Use the API endpoints to process emails and extract order information

## Key Features

- **OAuth Authentication**: Secure Gmail access using Google's OAuth 2.0
- **Automatic Token Refresh**: Keeps authentication valid without user intervention
- **Email Processing**: Extracts order information from retailer emails
- **Retry Mechanism**: Handles transient failures during processing
- **Monitoring**: Token status monitoring and processing history

## Architecture Overview

The Gmail integration employs a layered architecture:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   UI Layer      │      │   API Layer     │      │  Gmail API      │
│                 │      │                 │      │                 │
│ ┌─────────────┐ │      │ ┌─────────────┐ │      │                 │
│ │GmailSettings│ │◄────►│ │Auth Endpoints│ │◄────►│                 │
│ └─────────────┘ │      │ └─────────────┘ │      │                 │
│                 │      │                 │      │                 │
│ ┌─────────────┐ │      │ ┌─────────────┐ │      │                 │
│ │GmailSyncPage│ │◄────►│ │Email Process │ │◄────►│                 │
│ └─────────────┘ │      │ │  Endpoints   │ │      │                 │
│                 │      │ └─────────────┘ │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                        ▲                        ▲
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Service Layer  │      │   Data Layer    │      │ External APIs   │
│                 │      │                 │      │                 │
│ ┌─────────────┐ │      │ ┌─────────────┐ │      │ ┌─────────────┐ │
│ │Gmail Service│ │◄────►│ │Gmail Tokens │ │      │ │  Mistral AI  │ │
│ └─────────────┘ │      │ └─────────────┘ │      │ │  (PDF Proc)  │ │
│                 │      │                 │      │ └─────────────┘ │
│ ┌─────────────┐ │      │ ┌─────────────┐ │      │                 │
│ │EmailProcessor│ │◄────►│ │  Orders     │ │      │                 │
│ └─────────────┘ │      │ └─────────────┘ │      │                 │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/gmail/url` | GET | Get OAuth authorization URL |
| `/api/auth/gmail/callback` | GET | OAuth callback handler |
| `/api/auth/gmail/status` | GET | Check connection status |
| `/api/auth/gmail/disconnect` | POST | Revoke Gmail access |
| `/api/gmail/process-myntra-emails` | POST | Process emails from Myntra |
| `/api/gmail/token-status` | GET/POST | Check/refresh token status |
| `/api/gmail/sync-history` | GET | Get email processing history |

## Type System

The Gmail integration uses a comprehensive type system to ensure type safety:

- `GmailToken`: Authentication token information
- `GmailConnectionStatus`: Connection status details
- `EmailMessage`: Structure of an email message
- `EmailAttachment`: Structure of email attachments
- `EmailSearchOptions`: Options for searching emails

## Testing

For comprehensive testing of the Gmail integration:

1. Follow the [Testing Strategy](./gmail-integration-testing.md) for automated tests
2. Execute the [Test Plan](./gmail-integration-test-plan.md) for manual verification
3. Ensure all test cases pass before deployment

## Contributing

When contributing to the Gmail integration, please:

1. Ensure all tests pass with `npm test`
2. Follow the testing strategies outlined in [Gmail Integration Testing](./gmail-integration-testing.md)
3. Use the type system consistently
4. Update documentation when adding new features

## Security Considerations

Before deploying to production, review the [Gmail Integration Checklist](./gmail-integration-checklist.md) to ensure all security and privacy considerations are addressed. 