import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db("aakaar");

    await db.collection("mindmeter_logs").insertOne({
      sleep: body.sleep,
      meetings: body.meetings,
      stress: body.stress,
      decision_score: body.decisionScore,
      meeting_risk: body.meetingRisk,
      created_at: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("aakaar");

    const logs = await db
      .collection("mindmeter_logs")
      .find({})
      .sort({ created_at: -1 })
      .limit(7)
      .toArray();

    const totalCount = await db
      .collection("mindmeter_logs")
      .countDocuments();

    return NextResponse.json({ logs, totalCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}