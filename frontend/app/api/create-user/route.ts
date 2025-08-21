import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only secret
);

export async function POST(request: NextRequest) {
  try {
    const { email, password, metadata } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Validate metadata
    if (!metadata || !metadata.full_name || !metadata.user_type) {
      return NextResponse.json({ error: "Full name and user type are required" }, { status: 400 });
    }

    // Validate user_type
    if (!["admin", "reviewer"].includes(metadata.user_type)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    // Validate committee for reviewers
    if (metadata.user_type === "reviewer" && (!metadata.committee || metadata.committee.trim() === "")) {
      return NextResponse.json({ error: "Committee name is required for reviewers" }, { status: 400 });
    }

    // Create the auth user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: metadata,
      email_confirm: true,     // Auto-confirm the user
    });

    if (error) {
      console.error("Supabase auth error:", error);
      
      // Check if it's a duplicate user error
      if (error.message.includes("User already registered")) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
      }
      
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      user: {
        id: data.user.id,
        email: email,
        full_name: metadata.full_name.trim(),
        user_type: metadata.user_type,
        committee: metadata.user_type === "reviewer" ? metadata.committee.trim() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      message: "User created successfully and auto-confirmed"
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
