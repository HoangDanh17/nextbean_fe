export async function POST(request: Request) {
  console.log("Da vao post set token in cookie");
  const body = await request.json();
  const sessionToken = body.sessionToken as string;
  console.log("in post: token: ", sessionToken);
  if (!sessionToken) {
    return new Response(
      JSON.stringify({ message: "Không nhận được session token" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Secure`,
      // "Content-Type": "application/json"
    }
  });
}
