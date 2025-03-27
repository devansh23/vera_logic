# GmailSettings Component

A React component that displays Gmail connection status and provides management options for connecting and disconnecting Gmail integration.

## Features

- **Connection Status Display**: Shows whether Gmail is currently connected
- **Connect/Disconnect Options**: Buttons to connect to or disconnect from Gmail
- **Status Indicator**: Visual indicator of connection status
- **Error Handling**: Comprehensive error display with help options
- **Connection Tips**: Expandable tips section for troubleshooting connection issues
- **Last Synced Information**: Shows when the Gmail account was last synchronized
- **Connection Details**: Expandable section with additional connection information
- **Responsive Design**: Works on all screen sizes with appropriate layouts
- **External Links**: Link to Google account permissions page for direct access management

## Usage

```tsx
import GmailSettings from '@/components/GmailSettings';

// Basic usage
<GmailSettings />
```

## Component States

### Loading State
- Displays a loading spinner while checking the connection status

### Disconnected State
- Shows a message encouraging the user to connect Gmail
- Provides a "Connect Gmail" button using the GmailConnectButton component
- Offers a "Show Tips" button to display connection troubleshooting tips

### Connected State
- Displays a success message indicating Gmail is connected
- Shows a "Disconnect Gmail" button
- Provides an expandable "Connection Details" section with last sync time

### Error State
- Shows a clear error message with the specific error that occurred
- Provides a "Need help?" button to display troubleshooting tips
- Includes a dismiss button to clear the error message

## API Integration

This component interacts with several API endpoints:

- `GET /api/auth/gmail/status` - Retrieves the current Gmail connection status
- `DELETE /api/auth/gmail` - Disconnects the Gmail account
- Leverages the GmailConnectButton component which interacts with `GET /api/auth/gmail`

## Implementation Details

### State Management
The component manages several pieces of state:
- `status`: The current connection status (connected, last sync time)
- `loading`: Whether the connection status is being fetched
- `error`: Any error that occurred during API calls
- `showTips`: Whether the connection tips section is displayed
- `isDisconnecting`: Whether a disconnect operation is in progress
- `settingsExpanded`: Whether the connection details section is expanded

### Session Handling
- Uses NextAuth.js session management via the `useSession` hook
- Refreshes the session data using the `router.refresh()` method when connections change

### Responsive Design
- Uses responsive Tailwind CSS classes for different screen sizes
- Adjusts layout for mobile and desktop views
- Ensures buttons and text remain properly aligned across devices

## Dependencies

- NextAuth.js for session management
- GmailConnectButton component for the connect functionality
- fetch API for making HTTP requests to the backend

## Integration with Gmail API Flow

This component is part of the Gmail API integration flow:

1. User views the Gmail settings to check their connection status
2. If disconnected, they can click "Connect Gmail" to initiate OAuth flow
3. After successful connection, the UI updates to show connected state
4. User can view connection details or disconnect if needed
5. If disconnected, the UI returns to the disconnected state 