import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'
import { Permissions } from "../../../types";

export default async function checkAuthMiddleware(request: NextRequest, response: NextResponse) {
  const token = request.cookies['@worldtrip.token']

  if (request.method === 'GET') {
    return NextResponse.next()
  }

  if (request.method !== 'GET' && !token) {
    return new Response(JSON.stringify({ message: 'Not authenticated.' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const secret = process.env.JWT_SECRET

  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(secret)
  )

  if (!payload) {
    return new Response(JSON.stringify({ message: 'Invalid token.' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const permissions = payload.permissions as Permissions

  if ( request.method === 'POST') {
    if (permissions.images.create) {
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

  if ( request.method === 'DELETE') {
    if (permissions.images.delete) {
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
}