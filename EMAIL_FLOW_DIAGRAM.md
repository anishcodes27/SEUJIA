# Email Automation Flow - Technical Overview

## Complete Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER SIGNS UP                               │
│  (Fills form: Name, Email, Password on /signup page)           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND (app/signup/page.tsx)                     │
│  • Validates form data                                          │
│  • Shows loading state                                          │
│  • Sends POST request to /api/auth/signup                      │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│         BACKEND API (app/api/auth/signup/route.ts)             │
│                                                                 │
│  Step 1: Validate input                                        │
│  ├─ Check all fields present                                   │
│  ├─ Validate password length (min 6 chars)                     │
│  └─ Validate email format                                      │
│                                                                 │
│  Step 2: Check if user exists                                  │
│  ├─ Query Supabase users table                                 │
│  ├─ If exists → Return error "Email already registered"        │
│  └─ If new → Continue                                           │
│                                                                 │
│  Step 3: Create user account                                   │
│  ├─ Hash password (Base64 - upgrade to bcrypt for production) │
│  ├─ Insert into Supabase users table                           │
│  ├─ Generate user ID                                            │
│  └─ Store: name, email, password, created_at                   │
│                                                                 │
│  Step 4: Trigger welcome email (async)                         │
│  ├─ Call sendWelcomeEmail(name, email)                         │
│  ├─ Don't wait for completion                                  │
│  └─ Log any errors (don't fail signup)                         │
│                                                                 │
│  Step 5: Return success                                        │
│  └─ Send user data to frontend                                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ├──────────────┬─────────────────────────────┐
                     ▼              ▼                             ▼
         ┌──────────────────┐  ┌──────────────┐    ┌──────────────────┐
         │   User Stored    │  │ Email Sender │    │  Frontend Gets   │
         │   in Database    │  │  (Async)     │    │    Response      │
         └──────────────────┘  └──────┬───────┘    └────────┬─────────┘
                                      │                      │
                                      ▼                      ▼
                        ┌─────────────────────────┐  ┌──────────────┐
                        │ lib/email/send.ts       │  │ Update State │
                        │ sendWelcomeEmail()      │  │ Redirect to  │
                        │                         │  │  Home Page   │
                        │ • Load template         │  └──────────────┘
                        │ • Insert user name      │
                        │ • Prepare HTML & text   │
                        └────────┬────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────────┐
                    │ lib/email/templates/welcome  │
                    │ getWelcomeEmailHtml(name)    │
                    │                              │
                    │ • Generate HTML email        │
                    │ • Apply honey theme          │
                    │ • Insert personalization     │
                    │ • Add call-to-action button  │
                    └────────┬─────────────────────┘
                             │
                             ▼
                    ┌────────────────────┐
                    │   Resend API       │
                    │   (External)       │
                    │                    │
                    │ • Validate email   │
                    │ • Queue for send   │
                    │ • Process delivery │
                    │ • Track status     │
                    └────────┬───────────┘
                             │
                             ▼
                    ┌────────────────────┐
                    │  Email Delivered   │
                    │  to User's Inbox   │
                    │                    │
                    │  Time: 1-2 mins    │
                    └────────────────────┘
```

---

## Component Breakdown

### 1. Frontend Component
**File:** `app/signup/page.tsx`

**Responsibilities:**
- Display signup form
- Validate user input
- Handle form submission
- Show loading state
- Display error messages
- Redirect on success

**Key Code:**
```typescript
const result = await signup(name, email, password);
if (result.success) {
  router.push('/'); // Redirect to home
} else {
  setError(result.error); // Show error
}
```

---

### 2. Authentication Context
**File:** `context/AuthContext.tsx`

**Responsibilities:**
- Manage user state globally
- Store user in localStorage
- Provide signup/login/logout functions
- Make API calls

**Key Code:**
```typescript
const signup = async (name, email, password) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  setUser(data.user);
  return { success: true };
};
```

---

### 3. Signup API Route
**File:** `app/api/auth/signup/route.ts`

**Responsibilities:**
- Validate input data
- Check for duplicate emails
- Create user in database
- Trigger welcome email
- Return user data

**Key Code:**
```typescript
// Create user
const { data: newUser } = await supabaseAdmin
  .from('users')
  .insert([{ name, email, password }])
  .select()
  .single();

// Send email (async, non-blocking)
sendWelcomeEmail(newUser.name, newUser.email).catch(console.error);

return NextResponse.json({ user: newUser });
```

---

### 4. Email Sender
**File:** `lib/email/send.ts`

**Responsibilities:**
- Initialize Resend client
- Load email templates
- Format email data
- Send via Resend API
- Handle errors

**Key Code:**
```typescript
export async function sendWelcomeEmail(name: string, email: string) {
  const html = getWelcomeEmailHtml(name);
  const text = getWelcomeEmailText(name);
  
  return sendEmail({
    to: email,
    subject: `Welcome to Seujia Honey, ${name}! 🍯`,
    html,
    text
  });
}
```

---

### 5. Email Template
**File:** `lib/email/templates/welcome.ts`

**Responsibilities:**
- Generate HTML email
- Apply honey theme styling
- Insert personalization
- Format for email clients
- Create plain text version

**Key Code:**
```typescript
export function getWelcomeEmailHtml(name: string): string {
  return `
    <html>
      <body style="background: #FEF3C7;">
        <h2>Welcome, ${name}! 🎉</h2>
        <!-- Beautiful HTML template -->
      </body>
    </html>
  `;
}
```

---

## Data Flow

### User Data Structure

**Input (Signup Form):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Database (Supabase users table):**
```json
{
  "id": "uuid-v4-generated",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "base64-encoded-hash",
  "created_at": "2025-11-08T10:30:00Z",
  "updated_at": "2025-11-08T10:30:00Z"
}
```

**Email Data (sent to Resend):**
```json
{
  "from": "Seujia Honey <onboarding@resend.dev>",
  "to": "john@example.com",
  "subject": "Welcome to Seujia Honey, John Doe! 🍯",
  "html": "<html>...[full HTML template]...</html>",
  "text": "Welcome to Seujia Honey, John Doe!..."
}
```

**Response to Frontend:**
```json
{
  "user": {
    "id": "uuid-v4-generated",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-11-08T10:30:00Z"
  },
  "message": "Account created successfully"
}
```

---

## Environment Variables

### Required Variables:

```bash
# Supabase (for user storage)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Resend (for email sending)
RESEND_API_KEY=re_123abc456...

# Email configuration
EMAIL_FROM=Seujia Honey <onboarding@resend.dev>

# App URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Where They're Used:

| Variable | Used In | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase/admin.ts` | Connect to database |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.ts` | Admin access |
| `RESEND_API_KEY` | `lib/email/send.ts` | Send emails |
| `EMAIL_FROM` | `lib/email/send.ts` | Sender address |
| `NEXT_PUBLIC_APP_URL` | Email template | Shop button link |

---

## Error Handling

### Signup API Errors:

```typescript
// Missing fields
if (!name || !email || !password) {
  return NextResponse.json(
    { error: 'Missing required fields' },
    { status: 400 }
  );
}

// Password too short
if (password.length < 6) {
  return NextResponse.json(
    { error: 'Password must be at least 6 characters' },
    { status: 400 }
  );
}

// Email already exists
if (existingUser) {
  return NextResponse.json(
    { error: 'Email already registered' },
    { status: 400 }
  );
}

// Database error
if (error) {
  console.error('Supabase error:', error);
  return NextResponse.json(
    { error: 'Failed to create user' },
    { status: 500 }
  );
}
```

### Email Sending Errors:

```typescript
// Email fails but signup succeeds
sendWelcomeEmail(name, email).catch((emailError) => {
  // Log but don't fail the signup
  console.error('Failed to send welcome email:', emailError);
});
```

**Why?** User signup is more important than email delivery. If email fails, user can still use the account.

---

## Performance Considerations

### Async Email Sending

Email is sent **asynchronously** (non-blocking):

```typescript
// ✅ Good: Don't wait for email
sendWelcomeEmail(name, email).catch(console.error);
return NextResponse.json({ user: newUser });

// ❌ Bad: Wait for email (slower)
await sendWelcomeEmail(name, email);
return NextResponse.json({ user: newUser });
```

**Benefits:**
- Faster signup response (< 500ms vs 2-3 seconds)
- Email failures don't block signup
- Better user experience

### Email Delivery Time

- **Queue:** Instant (< 100ms)
- **Processing:** 1-2 seconds
- **Delivery:** 30 seconds - 2 minutes
- **Inbox appearance:** 1-2 minutes total

---

## Security Considerations

### Current Implementation:
- ✅ Input validation
- ✅ Duplicate email check
- ⚠️ Basic password encoding (Base64)
- ✅ Server-side processing
- ✅ Environment variables for secrets

### Before Production:
- 🔒 Implement bcrypt password hashing
- 🔒 Add rate limiting
- 🔒 Implement CSRF protection
- 🔒 Add email verification
- 🔒 Sanitize user inputs

---

## Monitoring & Debugging

### Console Logs:

```typescript
// In signup API
console.log('New user created:', newUser.id);
console.error('Supabase error:', error);
console.error('Failed to send welcome email:', emailError);

// In email sender
console.log('Email sent successfully:', data);
console.error('Error sending email:', error);
```

### Check Points:

1. **Signup successful?** → Check browser console
2. **User in database?** → Check Supabase Table Editor
3. **Email sent?** → Check Resend Dashboard
4. **Email received?** → Check inbox/spam

---

## Testing Checklist

### Unit Testing:
- [ ] Form validation works
- [ ] API validates input correctly
- [ ] Duplicate email detected
- [ ] User created in database
- [ ] Email function called

### Integration Testing:
- [ ] Complete signup flow works
- [ ] Email actually sends
- [ ] Email arrives in inbox
- [ ] Links in email work
- [ ] Mobile responsive

### Edge Cases:
- [ ] Empty form fields
- [ ] Invalid email format
- [ ] Password too short
- [ ] Duplicate signup attempt
- [ ] Network error during signup
- [ ] Resend API down
- [ ] Invalid API key

---

## Success Metrics

### Track These KPIs:

1. **Signup Success Rate**
   - Target: > 95%
   - Measure: Successful signups / Attempts

2. **Email Delivery Rate**
   - Target: > 98%
   - Measure: Delivered / Sent

3. **Email Open Rate**
   - Target: > 20%
   - Measure: Opens / Delivered

4. **Email Click Rate**
   - Target: > 5%
   - Measure: Clicks / Opens

5. **Time to First Email**
   - Target: < 2 minutes
   - Measure: Signup time → Inbox time

---

## Future Enhancements

### Potential Additions:

1. **Email Verification**
   - Send verification link
   - Confirm email before account activation

2. **Drip Campaign**
   - Day 1: Welcome email ✅
   - Day 3: Product recommendations
   - Day 7: Special discount offer

3. **Personalization**
   - Track user interests
   - Send relevant product suggestions
   - Birthday emails with offers

4. **A/B Testing**
   - Test different subject lines
   - Test different CTAs
   - Measure conversion rates

5. **Advanced Analytics**
   - Heat maps of email clicks
   - Conversion tracking
   - ROI measurement

---

**System is ready to send welcome emails! 📧🍯**
