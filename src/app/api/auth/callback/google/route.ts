import { oauth2googleClient } from "@/features/google-oauth/client";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { google } from "googleapis";
import prisma from "@/db";
import { user } from "@/generated/prisma/client";
import { createJwt, expiresAt } from "@/lib/jwt";
import { createGoogleUser } from "@/lib/create-google-user";
import { createDodoCustomer } from "@/dodo/create-customer";

export const GET = async (req: NextRequest) => {
  const s = new URLSearchParams(req.url);
  const code = s.get("code");

  if (!code)
    return NextResponse.json(
      { error: "code not found" },
      { status: 400 },
    );

  const { tokens } = await oauth2googleClient.getToken(code);
  oauth2googleClient.setCredentials(tokens);

  const oauth2 = google.oauth2({
    version: "v2",
    auth: oauth2googleClient,
  });

  const { data } = await oauth2.userinfo.get();

  if (!data)
    return NextResponse.json(
      { error: "error getting user info" },
      { status: 400 },
    );

  if (!data.email || !data.name)
    return NextResponse.json(
      { error: "missing required data" },
      { status: 400 },
    );

  const existing =await prisma.user.findUnique({where:{email:data.email}})

  let user:user|null = existing;


  //create new user
  if (!existing) {
    try {
      user = await createGoogleUser({
        email: data.email,
        name: data.name,
        picture: data.picture,
        expiryDate: tokens.expiry_date,
        refreshToken: tokens?.refresh_token||"",
        scope: tokens.scope,
      });
    } catch (error) {
         console.error(error);
      user = await prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });
      if (!user) {
        user = await createGoogleUser({
          email: data.email,
          name: data.name,
          picture: data.picture,
          expiryDate: tokens.expiry_date,
          scope: tokens.scope,
        });
      }
    }
  }
  //login user
  else {
    const account  = await prisma.account.findFirst({where:{
      user_id:existing.id,
      type:"GOOGLE"
    }});
    if(!account){
       await prisma.account.create({data:{
      user_id:existing.id,
      type:"GOOGLE",
        expires_at: new Date(tokens.expiry_date||0),
        scope: tokens.scope!,
        refresh_token:"not-found"
    }});
    }
    if(!existing.dodo_customer_id){
      await createDodoCustomer(existing.email,existing.name)
      await prisma.usage.create({
        data:{user_id:existing.id}
      })
    }
  }

  if (!user )
    return NextResponse.json(
      { error: "user not found" },
      { status: 403 },
    );

  const ua = userAgent(req);

  const session = await prisma.session.create({
    data: {
      user_id: user?.id,
      expires_at: expiresAt,
      ua: JSON.stringify(ua) || "{}",
    },
  });

  const token = createJwt({
    userId: user.id,
    sessionId: session.id,
  });

  const response = NextResponse.redirect(
    new URL(
      existing ? "/onboard" : "/generate",
      req.nextUrl.origin,
    ),
  );

  response.cookies.set("autoflow-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return response;
};