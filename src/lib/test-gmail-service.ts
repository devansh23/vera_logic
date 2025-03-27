// Test file to verify Gmail service module imports correctly
import * as GmailService from './gmail-service';
import { log } from './logger';

// Log the module to verify it's loaded properly
log('Gmail Service Module Loaded', { 
  moduleKeys: Object.keys(GmailService),
  exported: {
    interfaces: ['EmailMessage', 'Attachment', 'EmailSearchOptions'],
    functions: [
      'initializeGmailClient',
      'listEmails',
      'getEmailById',
      'getAttachment',
      'markEmailAsRead',
      'getLabels'
    ]
  }
});

// Export the module for testing
export default GmailService; 