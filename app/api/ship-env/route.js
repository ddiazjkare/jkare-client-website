import ShipEnv from "../../../models/ShipEnv";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const info = await ShipEnv.findById("67eff0c38ee5d99c1f424274");

    if (!info) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json(info);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async req => {
  try{
    const body = await req.json();
    const updatedDoc = await ShipEnv.findByIdAndUpdate(
      "67eff0c38ee5d99c1f424274",
      { $set: body }, 
      {
        new: true,
        runValidators: true
      }
    );
    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}