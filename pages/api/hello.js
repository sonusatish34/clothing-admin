// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default function handler(req, res) {
//   res.status(200).json({ name: "John Doe" });
// }

import { NextResponse } from "next/server";

export async function POST(req)
{
      const  data = await req.json()
      console.log(data,'sataa');
      
      return NextResponse.json({ sucess: "true",data });
}