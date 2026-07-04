// Next.js App Router handler using Handlebars.compile on a template pulled
// from the request body. Tests AST SSTI detection in TypeScript + Next.js
// style. VC082 must fire.

import Handlebars from "handlebars";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const userTpl = body.template;
  const render = Handlebars.compile(userTpl);
  return NextResponse.json({ html: render(body.data) });
}
