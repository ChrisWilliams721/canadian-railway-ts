import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
// Fetch with id - Daniel
export async function GET({ params }: { params: { id: Number | String } }) {
    const databaseUrl = process.env.DATABASE_URL || ""; // Set a default value if DATABASE_URL is not defined
    const sql = neon(databaseUrl);
    //PostgresQL
    const id = Number(params.id);
    const response = await sql`SELECT * FROM tasks WHERE id = ${id};`;
    const user = response[0];

    if (!user) {
        return new Response(null, { status: 404 });
    }

    return new Response(JSON.stringify(response), { status: 200 });
}


//Modify a task - Chris
export async function PUT(request: Request, { params }: { params: { id: Number | String } }) {
    const databaseUrl = process.env.DATABASE_URL || ""; // Set a default value if DATABASE_URL is not defined
    const sql = neon(databaseUrl);
    //PostgresQL
    const id = Number(params.id);
    const resquestData = await request.json();
    const response = await sql`UPDATE tasks SET description = ${resquestData.description}, status = ${resquestData.status}, assigned_to = ${resquestData.assigned_to}, created_by = ${resquestData.created_by}, due_date = ${resquestData.due_date}, priority = ${resquestData.priority}, date = ${resquestData.date} WHERE id = ${id};`;
    return new Response(JSON.stringify(response), { status: 200 });
}

//Delete a task - Nathan
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    const { id } = params;
    const taskId = Number(id);

    // Log the ID for debugging
    console.log("Deleting task with ID:", id);

    // Delete the task from the database
    const response = await sql`DELETE FROM tasks WHERE id = ${taskId} RETURNING *;`;

    // Log the response for debugging
    console.log("Delete response:", response);

    if (!response) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to delete task." },
      { status: 500 }
    );
  }
}

