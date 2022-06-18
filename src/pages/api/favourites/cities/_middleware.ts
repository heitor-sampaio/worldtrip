import { NextResponse } from "next/server";
import * as jose from 'jose'
import { Permissions, User } from "../../../../types";
import { NextApiRequest } from "next";

export default async function checkFavouritesCitiesPermissionsMiddleware(request: NextApiRequest) {
  const token = request.cookies['@worldtrip.token']

  const secret = process.env.JWT_SECRET

  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(secret)
  )

  const user = payload.user as User

  const permissions = user.permissions as Permissions

  if ( request.method === 'PUT') {
    if (!permissions.cities.favourite) {
      return new Response(JSON.stringify({ message: 'Insufficient permissions.' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
      
    return NextResponse.next()
  }

  return new Response(JSON.stringify({ error: `Method '${request.method}' Not Allowed` }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
    },
  })

}