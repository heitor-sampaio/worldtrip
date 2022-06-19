import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'
import { Permissions, User } from "../../../types";

export default async function checkCitiesPermissionsMiddleware(request: NextRequest, response: NextResponse) {
  const token = request.cookies['@worldtrip.token']

  const secret = process.env.JWT_SECRET

  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(secret)
  )

  const user = payload.user as User

  const permissions = user.permissions as Permissions

  if ( request.method === 'POST') {
    if (permissions.countries.create) {
      return NextResponse.next()
    } else {
      return new Response(JSON.stringify({ message: 'Not authorized.' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

  return new Response(JSON.stringify({ error: `Method '${request.method}' Not Allowed` }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}