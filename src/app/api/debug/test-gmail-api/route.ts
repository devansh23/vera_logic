import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getEmailById, listEmails } from '@/lib/gmail-service';
import { log } from '@/lib/logger';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const retailer = searchParams.get('retailer') || 'Myntra';
    const emailId = searchParams.get('emailId');

    // If email ID is provided, fetch that specific email
    if (emailId) {
      log('Debug: Fetching specific email', { emailId });
      try {
        const email = await getEmailById(session.user.id, emailId);
        
        if (!email) {
          return NextResponse.json({ error: 'Email not found' }, { status: 404 });
        }

        // Extract basic email info and HTML content length
        const emailInfo = {
          id: email.id,
          subject: email.subject,
          from: email.from,
          to: email.to,
          date: email.date,
          hasHtml: Boolean(email.body?.html),
          htmlLength: email.body?.html?.length || 0,
          hasText: Boolean(email.body?.text),
          textLength: email.body?.text?.length || 0,
          // Include a sample of the HTML content
          htmlSample: email.body?.html?.substring(0, 500) + '...'
        };

        return NextResponse.json({
          message: 'Email fetched successfully',
          email: emailInfo
        });
      } catch (error) {
        log('Debug: Error fetching specific email', { error, emailId });
        return NextResponse.json({
          error: 'Failed to fetch email',
          details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
      }
    }
    
    // Otherwise, list emails for the specified retailer
    log('Debug: Listing emails', { retailer });
    try {
      const query = retailer.toLowerCase().includes('myntra')
        ? 'from:myntra subject:order confirmation'
        : retailer.toLowerCase().includes('h&m')
          ? 'from:h&m subject:order confirmation'
          : `from:${retailer} subject:order confirmation`;

      const result = await listEmails(session.user.id, {
        q: query,
        maxResults: 10
      });
      
      return NextResponse.json({
        message: 'Emails listed successfully',
        query,
        count: result.messages.length,
        emails: result.messages.map(email => ({
          id: email.id,
          subject: email.subject,
          from: email.from,
          date: email.date,
          snippet: email.snippet
        }))
      });
    } catch (error) {
      log('Debug: Error listing emails', { error, retailer });
      return NextResponse.json({
        error: 'Failed to list emails',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }
  } catch (error) {
    log('Debug: Unexpected error in test-gmail-api', { error });
    return NextResponse.json({
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 