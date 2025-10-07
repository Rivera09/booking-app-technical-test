import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    const accessToken = (await auth0.getSession())?.tokenSet.accessToken;

    const apiUrl = `${process.env.API_BASE_URL}/${slug}`;

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    const body = await req.json();

    const accessToken = (await auth0.getSession())?.tokenSet.accessToken;

    const apiUrl = `${process.env.API_BASE_URL}/${slug}`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: (err as { status: number })?.status || 500 }
    );
  }
}
