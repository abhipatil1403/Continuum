// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @deno-types="https://deno.land/x/denomailer@1.6.0/mod.ts"
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// Add TypeScript declarations for Deno
declare global {
  interface Window {
    Deno: {
      env: {
        get(key: string): string | undefined;
      };
    };
  }
}

const Deno = window.Deno;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Log request details
    console.log('Processing email request:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Get SMTP credentials
    const smtpUsername = Deno.env.get('SMTP_USERNAME');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');

    if (!smtpUsername || !smtpPassword) {
      console.error('Missing SMTP credentials');
      throw new Error('SMTP credentials not configured');
    }

    // Parse request body
    const text = await req.text();
    console.log('Request body:', text);

    if (!text) {
      throw new Error('Empty request body');
    }

    const body = JSON.parse(text);
    console.log('Parsed body:', body);

    const { to, subject, message } = body;

    if (!to || !subject || !message) {
      throw new Error('Missing required fields');
    }

    console.log('Attempting to send email:', { to, subject });

    // Configure SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: smtpUsername,
          password: smtpPassword,
        }
      }
    });

    // Send email
    await client.send({
      from: smtpUsername,
      to: to,
      subject: subject,
      content: message,
      html: message,
    });

    console.log('Email sent successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error sending email:', {
      message: error.message,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}); 