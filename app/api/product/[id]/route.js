import { NextResponse } from "next/server";
import { removeStopWords } from "../../../../lib/helperFunction";
import Product from "../../../../models/Product";

function getUniqueObjects(arr) {
  const uniqueObjects = [];
  const seenObjects = new Set();

  for (const obj of arr) {
    const serializedObj = JSON.stringify(obj);

    if (!seenObjects.has(serializedObj)) {
      uniqueObjects.push(obj);
      seenObjects.add(serializedObj);
    }
  }

  return uniqueObjects;
}

export const GET = async (req, ctx) => {
  try {
    const product = await Product.findOne({ _id: ctx.params.id });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const jsonRes = await fetch(
      "https://s3.ap-south-1.amazonaws.com/jkare.data/expanded_stopwords.json"
    );
    const { stopwords: stopWords } = await jsonRes.json();

    const filteredText = removeStopWords(product.prod_name, stopWords);

    const keywords = filteredText.trim().split(" ").filter(Boolean);
    const regexPattern = keywords.map((word) => `\\b${word}\\b`).join("|");
    const query = {
      _id: { $ne: ctx.params.id }, 
      prod_name: { $regex: regexPattern, $options: "i" }, 
    };

    const relatedProducts = await Product.find(query).limit(10); // Limit to avoid excessive results

    const uniqueRelatedProducts = getUniqueObjects(relatedProducts);

    return NextResponse.json(
      { product, relatedProducts: uniqueRelatedProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /products/:id:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
};

export const PUT = async (req, ctx) => {
  try {
    let { quantity } = await req.json(); // Get quantity to reduce
    const productId = ctx.params.id; // Get product ID from request params
    quantity = parseInt(quantity);

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { message: "Invalid quantity value" },
        { status: 400 }
      );
    }

    // Find the product and check stock availability
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stockQuantity < quantity) {
      return NextResponse.json(
        { message: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Update stock quantity by decrementing the given value
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      { $inc: { stockQuantity: -quantity } }, // Reduce stock quantity
      { new: true } // Return updated product
    );

    return NextResponse.json(
      { message: "Stock updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
