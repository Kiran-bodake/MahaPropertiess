import { NextResponse } from "next/server";

export async function GET() {

  const response = NextResponse.json({
    message: "Cookies cleared"
  });

  response.cookies.delete("propvista-access-token");
  response.cookies.delete("admin_token");

  return response;
}