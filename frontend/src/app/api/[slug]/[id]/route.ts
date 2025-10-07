import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; slug: string } }
) {
  const { id, slug } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const accessToken = (await auth0.getSession())?.tokenSet.accessToken;

    const apiUrl = `${process.env.API_BASE_URL}/${slug}/${id}`;

    const res = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete booking: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
}
