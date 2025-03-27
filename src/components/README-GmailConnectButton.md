# GmailConnectButton Component

A reusable React component for connecting to Gmail through OAuth authentication.

## Features

- **Customizable appearance**: Multiple variants (primary, secondary, outline) and sizes (small, medium, large)
- **Loading state management**: Visual feedback during the connection process
- **Error handling**: Callback functions for handling success and error states
- **Responsive design**: Works on all device sizes
- **Accessibility**: Includes proper ARIA labels and keyboard support

## Installation

This component is built into the Vera application. No additional installation is required.

## Usage

```tsx
import GmailConnectButton from '@/components/GmailConnectButton';

// Basic usage
<GmailConnectButton />

// With callbacks
<GmailConnectButton 
  onSuccess={() => console.log('Connected to Gmail!')}
  onError={(error) => console.error('Error connecting to Gmail:', error)}
/>

// With custom styling
<GmailConnectButton 
  variant="outline"
  size="large"
  className="w-full my-4"
/>
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | The visual style of the button |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | The size of the button |
| `className` | `string` | `''` | Additional CSS classes to apply to the button |
| `onSuccess` | `() => void` | `undefined` | Callback function called when Gmail connection is successful |
| `onError` | `(error: string) => void` | `undefined` | Callback function called when Gmail connection fails |

## How It Works

1. The component initializes a connection to Gmail by making an API call to `/api/auth/gmail`
2. It opens a popup window with the Google OAuth consent screen
3. Upon successful authentication, the popup window sends a message back to the parent window
4. The component listens for this message and triggers the `onSuccess` callback
5. If any errors occur, the `onError` callback is triggered with the error message

## Error Handling

The component handles several error scenarios:

- User not authenticated to the application
- Popup window blocked by the browser
- OAuth errors (user denying permissions, etc.)
- API errors

## Requirements

This component requires:

- NextAuth.js for session management
- A properly configured Google OAuth client in the Google Cloud Console
- API routes for Gmail authentication (`/api/auth/gmail`)
- Success and error pages for OAuth callback 