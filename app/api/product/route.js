import { NextResponse } from "next/server";
import Product from "../../../models/Product";

export const dynamic = 'force-dynamic';
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const prescription = searchParams.get("prescription");
    const price = searchParams.get("price");
    const category = searchParams.get("category");
    const query = searchParams.get("query");
    const num = searchParams.get("num");
    let filter = {
      isFeatured: true,
    };

    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (price) {
      const parsedPrice = JSON.parse(price);
      filter.prod_value = parsedPrice;
    }

    if (prescription) {
      filter["key_features.rx_required"] = JSON.parse(prescription);
    }

    if (brand) {
      const brandArray = brand.split(",").map((b) => b.trim());
      filter.brand_name = { $in: brandArray.map((b) => new RegExp(`^${atob(b)}$`, "i")) };
    }

    if (query) {
      filter.prod_name = { $regex: new RegExp(query, "i") };
    }

    const productList = await Product.find(filter).limit(
      num ? parseInt(num) : 0
    );

    return NextResponse.json(productList, { status: 200 });
  } catch (error) {
    console.error("er", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};