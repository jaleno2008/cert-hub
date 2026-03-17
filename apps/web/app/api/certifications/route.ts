export async function GET() {
  return Response.json([
    { id: 1, name: "MBE" },
    { id: 2, name: "DBE" },
    { id: 3, name: "Small Business" }
  ]);
}