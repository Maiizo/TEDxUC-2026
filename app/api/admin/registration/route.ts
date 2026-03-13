// 1. import NextResponse to send HTTP responses (like 200 OK or 500 Error)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // pake findmany buat get ALL regist
    const allRegistrations = await prisma.registration.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // send  data back as JSON with a 200 Success status
    return NextResponse.json(allRegistrations, { status: 200 });

  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registration data" }, 
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    // read the JSON data sent from the frontend 
    const body = await request.json();
    
    // ambil the fields yg dibutuhkan dari body
    const { fullName, email, phoneNumber, gender, age, eventId } = body;

    // basic validation
    if (!fullName || !email || !eventId) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 } 
      );
    }

    // generate random regist number (harus unique unique)
    const newRegNumber = `REG-${Math.floor(Math.random() * 1000000)}`;

    // 3. Tell Prisma to create a new row in the database
    const newRegistration = await prisma.registration.create({
      data: {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        gender: gender,
        age: Number(age), 
        eventId: eventId, 
        registrationNumber: newRegNumber, 
        // status, foodAllergy, and attendanceStatus have default values in your schema, 
        // so we don't strictly need to provide them here!
      },
    });

    // 4. Send the newly created database entry back as proof of success
    return NextResponse.json(newRegistration, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Failed to create registration" }, 
      { status: 500 }
    );
  }
}