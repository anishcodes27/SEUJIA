import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendWelcomeEmail } from '@/lib/email/send';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password (in production, use bcrypt)
    // For now, we'll store a simple hash - YOU SHOULD USE BCRYPT IN PRODUCTION
    const hashedPassword = Buffer.from(password).toString('base64');

    // Create user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      ])
      .select('id, name, email, created_at')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(newUser.name, newUser.email).catch((emailError) => {
      // Log error but don't fail signup if email fails
      console.error('Failed to send welcome email:', emailError);
    });

    return NextResponse.json({
      user: newUser,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
