import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'

export default async function checkAuthMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  const authenticatedRoutes = [
    {route: '/users', methods: ['GET', 'PUT', 'DELETE']},
    {route: '/users/roles', methods: ['GET', 'POST', 'PUT', 'DELETE']},
    {route: '/users/permissions', methods: ['GET', 'POST', 'PUT', 'DELETE']},

    {route: '/cities', methods: ['POST', 'PUT', 'DELETE']},
    {route: '/continents', methods: ['POST', 'PUT', 'DELETE']},
    {route: '/favourites/cities', methods: ['GET', 'POST', 'PUT', 'DELETE']},
    {route: '/images', methods: ['GET', 'POST', 'PUT', 'DELETE']},

  ]

  const desiredRoute = request.nextUrl.pathname

  const needAuthentication = authenticatedRoutes.find(route => 
    `/api${route.route}` === desiredRoute && route.methods.includes(request.method)
  )

  if (!needAuthentication) {
    return response
  }

  const token = request.cookies['@worldtrip.token']

  if (!token) {
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

  return response
}