# Gmail Integration Test Plan

This document outlines a comprehensive test plan for the Gmail integration feature in the Vera application. It covers authentication flows, email processing, error handling, UI components, and security aspects.

## Table of Contents

- [Authentication Testing](#authentication-testing)
- [Email Processing Testing](#email-processing-testing)
- [UI Component Testing](#ui-component-testing)
- [Error Handling Testing](#error-handling-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [End-to-End Scenarios](#end-to-end-scenarios)
- [Test Data Requirements](#test-data-requirements)
- [Test Environment Setup](#test-environment-setup)

## Authentication Testing

### Positive Test Cases

| Test ID | Test Scenario | Test Steps | Expected Result | Status |
|---------|---------------|------------|-----------------|--------|
| AUTH-P-01 | Initial Gmail Connection | 1. Navigate to Gmail Settings<br>2. Click "Connect Gmail"<br>3. Authorize on Google consent screen<br>4. Complete OAuth flow | User redirected back to app with successful connection message. Token stored in database. | |
| AUTH-P-02 | Token Refresh - Automatic | 1. Set up a test account with near-expired token<br>2. Perform any Gmail operation | Token should be automatically refreshed without user interaction. New token expiry visible in token status page. | |
| AUTH-P-03 | Manual Token Refresh | 1. Navigate to token status page<br>2. Click "Force Refresh" button | Token should be refreshed and new expiry date displayed. Success message shown. | |
| AUTH-P-04 | Logout / Disconnect | 1. Navigate to Gmail Settings<br>2. Click "Disconnect" button<br>3. Confirm action | Gmail connection removed. Token deleted from database. Settings page shows disconnected state. | |
| AUTH-P-05 | Reconnection After Disconnect | 1. Disconnect Gmail account<br>2. Reconnect following AUTH-P-01 steps | New connection established with new tokens. All functionality working again. | |

### Negative Test Cases

| Test ID | Test Scenario | Test Steps | Expected Result | Status |
|---------|---------------|------------|-----------------|--------|
| AUTH-N-01 | Connection Rejection | 1. Initiate Gmail connection<br>2. Cancel on Google consent screen | User returned to app with error message indicating connection was canceled. No token stored. | |
| AUTH-N-02 | Invalid Client Credentials | 1. Modify environment variables with invalid client ID/secret<br>2. Attempt to connect | Clear error message shown with troubleshooting steps. No infinite loading or crash. | |
| AUTH-N-03 | Expired Refresh Token | 1. Simulate expired refresh token in database<br>2. Attempt to use Gmail features | User prompted to reconnect Gmail account. Error message explains token expiration. | |
| AUTH-N-04 | Revoked Access | 1. Connect Gmail account<br>2. Revoke access in Google Account settings<br>3. Attempt to use Gmail features | System detects invalid tokens and prompts user to reconnect. Error handled gracefully. | |
| AUTH-N-05 | Multiple Connection Attempts | 1. Start Gmail connection flow<br>2. Before completing, open another tab and start connection again | No duplicate tokens created. System handles race condition gracefully. | |

## Email Processing Testing

### Positive Test Cases

| Test ID | Test Scenario | Test Steps | Expected Result | Status |
|---------|---------------|------------|-----------------|--------|
| EMAIL-P-01 | Process Myntra Emails - HTML content | 1. Have Myntra order confirmation emails in inbox<br>2. Navigate to Gmail Sync page<br>3. Click "Process Emails" button | Orders correctly extracted and displayed. Success count matches actual orders processed. | |
| EMAIL-P-02 | Process Myntra Emails - PDF attachment | 1. Have Myntra emails with PDF attachments<br>2. Initiate email processing | PDF attachments processed correctly. Order info extracted and stored. | |
| EMAIL-P-03 | Mark Processed Emails as Read | 1. Process unread emails with "Mark as Read" option checked | Emails marked as read in Gmail after processing. Confirmation in results. | |
| EMAIL-P-04 | Filter by Date Range | 1. Set custom date range for email processing<br>2. Process emails | Only emails within specified date range processed. | |
| EMAIL-P-05 | Processing with Retry Success | 1. Configure system to simulate temporary failure then success<br>2. Process emails | Emails processed successfully after retries. Retry count visible in logs. | |

### Negative Test Cases

| Test ID | Test Scenario | Test Steps | Expected Result | Status |
|---------|---------------|------------|-----------------|--------|
| EMAIL-N-01 | No Matching Emails | 1. Use an account with no Myntra emails<br>2. Initiate email processing | Appropriate message that no matching emails were found. No errors thrown. | |
| EMAIL-N-02 | Malformed Email Content | 1. Create test emails with malformed HTML<br>2. Process emails | System handles malformed content gracefully. Error logged but processing continues for other emails. | |
| EMAIL-N-03 | Processing Without Connection | 1. Disconnect Gmail account<br>2. Attempt to process emails | Clear error message that Gmail connection is required. User prompted to connect. | |
| EMAIL-N-04 | Corrupted PDF Attachment | 1. Create test email with corrupted PDF<br>2. Process emails | System handles failure gracefully. Logs error but continues processing other emails. | |
| EMAIL-N-05 | Exceeding API Quota | 1. Configure low API quota limit for testing<br>2. Process large number of emails | Rate limiting handled gracefully. User informed of quota limit. Partial results saved. | |
| EMAIL-N-06 | Network Failure During Processing | 1. Start processing emails<br>2. Simulate network interruption<br>3. Restore connection | Retry mechanism handles transient failure. Processing resumes after connection restored. | |

## UI Component Testing

### Positive Test Cases

| Test ID | Test Scenario | Test Steps | Expected Result | Status |
|---------|---------------|------------|-----------------|--------|
| UI-P-01 | GmailSettings Component - Connected State | 1. Connect Gmail account<br>2. Navigate to settings page | Connected state shown. Last sync time visible. Disconnect button available. | |
| UI-P-02 | GmailSettings Component - Disconnected State | 1. Ensure Gmail is disconnected<br>2. View settings component | Disconnected state shown. Connect button displayed prominently. | |
| UI-P-03 | GmailSyncPage - Process Controls | 1. Navigate to sync page<br>2. Verify all processing controls | All options available: max emails, date range, read/unread filter, mark as read. | |
| UI-P-04 | GmailSyncPage - Results Display | 1. Process emails<br>2. View results section | Results shown with counts for processed, successful, and failed emails. List of processed orders visible. | |
| UI-P-05 | GmailTokenStatus - Details Display | 1. Navigate to token status page | Token information displayed correctly: expiry date, connection status, last sync time. | |

### Negative Test Cases

| Test ID | Test Scenario | Test Steps | Expected Result | Status |
|---------|---------------|------------|-----------------|--------|
| UI-N-01 | Loading States | 1. Initiate any operation<br>2. Observe UI during processing | Loading indicators shown. No UI freeze. Buttons disabled during operations. | |
| UI-N-02 | Error State Display | 1. Force an error (e.g., invalid credentials)<br>2. Observe error presentation | Error message clearly displayed. Recovery options provided. | |
| UI-N-03 | Responsive Design | 1. Test UI components on various screen sizes<br>2. Test on mobile devices | Components adapt to different screen sizes. No overflow or cut-off elements. | |
| UI-N-04 | Form Validation | 1. Enter invalid values in email processing form<br>2. Submit form | Validation errors shown. Form prevents submission with invalid data. | |
| UI-N-05 | Empty State Handling | 1. View sync history with no previous syncs | Empty state shown gracefully. No errors or blank screens. | |

## Error Handling Testing

### Positive Test Cases

| Test ID | Test Scenario | Test Steps | Expected Result | Status |
|---------|---------------|------------|-----------------|--------|
| ERR-P-01 | Error Recovery - Authentication | 1. Cause authentication error<br>2. Follow recovery steps | System recovers after re-authentication. Clear recovery path provided. | |
| ERR-P-02 | Retry Mechanism - Transient Failure | 1. Configure system to simulate temporary failure<br>2. Process emails | Retry mechanism activates. Logs show retry attempts. Operation succeeds after retries. | |
| ERR-P-03 | Graceful Failure - Non-retryable Error | 1. Force permanent error condition<br>2. Observe handling | System recognizes non-retryable error. No unnecessary retries. Clear error message. | |
| ERR-P-04 | Partial Success Handling | 1. Set up scenario where some emails process successfully and others fail<br>2. Process emails | Partial success correctly reported. Successfully processed items saved despite failures. | |
| ERR-P-05 | Log Detail for Debugging | 1. Cause various error conditions<br>2. Check log output | Detailed logs with context information. Sufficient information for troubleshooting. | |

### Negative Test Cases

| Test ID | Test Scenario | Test Steps | Expected Result | Status |
|---------|---------------|------------|-----------------|--------|
| ERR-N-01 | Concurrent Request Handling | 1. Initiate multiple email processing requests simultaneously<br>2. Observe behavior | No race conditions. System handles concurrent requests gracefully. | |
| ERR-N-02 | Timeout Handling | 1. Configure very short timeout<br>2. Process operation that will exceed timeout | Timeout handled gracefully. User informed of timeout. No hanging processes. | |
| ERR-N-03 | API Error Handling | 1. Simulate various Gmail API errors<br>2. Observe system response | Each error type handled appropriately. User-friendly messages for each case. | |
| ERR-N-04 | Database Error Handling | 1. Simulate database connectivity issues<br>2. Perform operations requiring database | Graceful handling of database errors. Clear error messages. No data corruption. | |
| ERR-N-05 | Memory Limitation Handling | 1. Process very large emails/attachments<br>2. Observe memory usage and handling | System handles memory constraints. No crashes. Appropriate error messages for resource limits. | |

## Performance Testing

### Test Scenarios

| Test ID | Test Scenario | Test Steps | Expected Result | Status |
|---------|---------------|------------|-----------------|--------|
| PERF-01 | Large Email Volume | 1. Set up account with 100+ matching emails<br>2. Process all emails | System handles large volume without crashing. Performance degradation within acceptable limits. | |
| PERF-02 | Large PDF Attachments | 1. Process emails with large PDF attachments (10MB+)<br>2. Monitor system resources | PDFs processed without memory issues. Performance impact measured and acceptable. | |
| PERF-03 | Concurrent User Testing | 1. Simulate multiple users using Gmail integration simultaneously<br>2. Monitor system performance | System maintains responsiveness. No significant slowdown for any user. | |
| PERF-04 | API Quota Utilization | 1. Process emails with quota monitoring enabled<br>2. Analyze quota usage | Efficient use of API quota. No unnecessary API calls. | |
| PERF-05 | Response Time Benchmarking | 1. Measure response times for key operations<br>2. Compare to defined benchmarks | All operations complete within defined performance targets. | |

## Security Testing

### Test Scenarios

| Test ID | Test Scenario | Test Steps | Expected Result | Status |
|---------|---------------|------------|-----------------|--------|
| SEC-01 | Token Storage Security | 1. Connect Gmail account<br>2. Examine token storage in database | Tokens stored securely. Sensitive fields encrypted. No tokens in logs. | |
| SEC-02 | CSRF Protection | 1. Attempt to forge OAuth callbacks<br>2. Test state parameter validation | CSRF attacks prevented. Invalid state parameters rejected. | |
| SEC-03 | Authorization Scope Limitation | 1. Examine requested OAuth scopes<br>2. Verify minimal permissions | Only necessary scopes requested. No excessive permissions. | |
| SEC-04 | Access Control | 1. Attempt to access another user's Gmail data<br>2. Test API endpoints with different user credentials | Strict user isolation enforced. No cross-user data access possible. | |
| SEC-05 | Logout Security | 1. Disconnect Gmail account<br>2. Verify token revocation<br>3. Test API access after logout | Tokens properly invalidated. No lingering access after disconnect. | |
| SEC-06 | Secure Error Handling | 1. Cause various error conditions<br>2. Examine error messages | Errors don't leak sensitive information. No stack traces in user-facing errors. | |

## End-to-End Scenarios

### Complete Integration Flows

| Test ID | Test Scenario | Test Steps | Expected Result | Status |
|---------|---------------|------------|-----------------|--------|
| E2E-01 | New User Complete Flow | 1. Start with new user account<br>2. Connect Gmail<br>3. Process emails<br>4. View extracted orders<br>5. Disconnect Gmail | Complete flow works from end to end. All steps successful. | |
| E2E-02 | Returning User Flow | 1. Use account with existing Gmail connection<br>2. Process new emails<br>3. View combined results (old + new orders) | Incremental processing works correctly. No duplication of previously processed emails. | |
| E2E-03 | Multiple Sessions | 1. Connect Gmail on mobile device<br>2. Also use on desktop<br>3. Process emails from both devices | Session handling works correctly across devices. No conflicts between sessions. | |
| E2E-04 | Recovery From Error Flow | 1. Cause error during processing<br>2. Follow recovery steps<br>3. Complete processing | Recovery path is clear and effective. Process can be completed after errors. | |
| E2E-05 | Reconnection After Token Expiry | 1. Force token expiry<br>2. Attempt Gmail operation<br>3. Follow reconnection flow | System detects expired token. Reconnection flow is clear and works correctly. | |

## Test Data Requirements

### Required Test Accounts and Data

1. **Test Gmail Accounts:**
   - Account with Myntra order confirmation emails (HTML format)
   - Account with Myntra order emails with PDF attachments
   - Account with non-Myntra emails for filtering tests
   - Account with malformed/unusual email formats
   - Account with large number of emails for volume testing

2. **Sample Email Content:**
   - Various Myntra order confirmation formats
   - Order emails with different product counts
   - Different currency formats
   - HTML emails with varying structures
   - PDF attachments of different sizes

3. **Edge Case Data:**
   - Very large email with many products
   - Email with minimum required fields only
   - Email with special characters in critical fields
   - Emails with image-based content instead of text
   - Non-standard date formats

## Test Environment Setup

### Required Test Environments

1. **Development Environment:**
   - Local development setup with mocked Gmail API responses
   - Test accounts configured in development environment
   - Logging set to verbose for detailed debug information

2. **Staging Environment:**
   - Connected to actual Gmail API but with test accounts only
   - Configured with staging OAuth credentials
   - Full monitoring and logging enabled
   - Database with pre-populated test scenarios

3. **Production-like Environment:**
   - Matches production configuration
   - Uses production-equivalent resources (DB, memory, CPU)
   - Connected to Gmail API with production credentials
   - Used for final verification before actual production deployment

### Environment Configuration

For each environment, ensure the following is properly configured:

- OAuth credentials appropriate for the environment
- Database with test data prepared for specific scenarios
- Logging levels set appropriately for environment
- Network conditions simulated as needed (timeouts, slow connections)
- Infrastructure scaled appropriately for test type

## Test Execution Guidelines

1. **Test Sequence:**
   - Begin with positive authentication tests
   - Proceed to positive email processing tests
   - Test UI components
   - Test error handling and negative cases
   - Perform performance and security testing
   - Complete end-to-end scenarios

2. **Regression Testing:**
   - Re-test basic functionality after any significant change
   - Run full test suite before production deployment
   - Automate critical test cases for CI/CD pipeline

3. **Defect Management:**
   - Document all issues with detailed reproduction steps
   - Classify issues by severity and impact
   - Prioritize fixes based on user impact
   - Verify fixes in isolated environment before integrating

4. **Test Reporting:**
   - Maintain test execution logs
   - Track pass/fail rates for test cases
   - Generate summary reports for stakeholders
   - Document workarounds for known issues 