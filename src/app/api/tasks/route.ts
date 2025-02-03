import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

//Fetch All tasks - Mark
export async function GET() {
  const databaseUrl = process.env.DATABASE_URL || ""; // Set a default value if DATABASE_URL is not defined
  const sql = neon(databaseUrl);
  //PostgresQL
  const response = await sql`SELECT * FROM tasks;`;
  return new Response(JSON.stringify(response), { status: 200 });
}

// Add task - Daniel
export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    // Insert the task into the database
    const response = await sql`
      INSERT INTO tasks (title, description, status, assigned_to, created_by, start_date, start_time, end_date, end_time, priority)
      VALUES (${requestData.title}, ${requestData.description}, ${requestData.status}, ${requestData.assigned_to}, ${requestData.created_by}, ${requestData.start_date}, ${requestData.start_time}, ${requestData.end_date}, ${requestData.end_time}, ${requestData.priority})
      RETURNING *;
    `;

    // Log the response for debugging
    console.log("Insert response:", response);

    // Return the newly created task
    return NextResponse.json(response[0], { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to create task.", },
      { status: 500 }
    );
  }
}

// Modify task - Mark
export async function PUT(request: Request) {
  const databaseUrl = process.env.DATABASE_URL || ""; // Set a default value if DATABASE_URL is not defined
  const sql = neon(databaseUrl);
  //PostgresQL
  const requestData = await request.json();
  const response = await sql`

        UPDATE tasks SET
            description = ${requestData.description}, 
            status = ${requestData.status},
            assigned_to = ${requestData.assigned_to},
            created_by = ${requestData.created_by},
            due_date = ${requestData.due_date},
            priotity = ${requestData.priotity},
            WHERE id = ${requestData.id};`;

  return new Response(JSON.stringify(response), { status: 200 });
}

//Delete all tasks - Nathan Delete all tasks from table. Keep table.

export async function DELETE() {
  const databaseUrl = process.env.DATABASE_URL || ""; // Set a default value if DATABASE_URL is not defined
  const sql = neon(databaseUrl);

  const response = await sql`DELETE FROM schedules;`;

  return new Response(null, { status: 200 });
}
