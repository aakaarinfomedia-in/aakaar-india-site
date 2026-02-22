import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("aakaar");

    // prevent duplicates
    const existing = await db
      .collection("early_access")
      .findOne({ email });

    if (existing) {
      return NextResponse.json(
        { success: true, message: "Already registered" }
      );
    }

    await db.collection("early_access").insertOne({
      email,
      created_at: new Date(),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}