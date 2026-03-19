import { NextResponse } from "next/server";
import { removeStopWords } from "../../../../lib/helperFunction";
import Product from "../../../../models/Product";

/**
 * Remove duplicate objects from array
 * @param {Array} arr - Array of objects
 * @returns {Array} Unique objects
 */
function getUniqueObjects(arr) {
  if (!Array.isArray(arr)) return [];
  
  const uniqueObjects = [];
  const seenObjects = new Set();

  for (const obj of arr) {
    try {
      const serializedObj = JSON.stringify(obj);
      if (!seenObjects.has(serializedObj)) {
        uniqueObjects.push(obj);
        seenObjects.add(serializedObj);
      }
    } catch (error) {
      console.warn("Failed to serialize object:", error);
    }
  }

  return uniqueObjects;
}

/**
 * Validate MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @returns {boolean}
 */
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * GET /api/product/:id - Fetch product details with related products
 */
export const GET = async (req, ctx) => {
  try {
    // Validate product ID format
    const productId = ctx?.params?.id;
    if (!productId || !isValidObjectId(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    // Fetch product from database
    const product = await Product.findOne({ _id: productId }).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch stopwords with error handling
    let relatedProducts = [];
    try {
      const jsonRes = await fetch(
        "https://s3.ap-south-1.amazonaws.com/jkare.data/expanded_stopwords.json",
        { 
          cache: "force-cache", // Cache stopwords for performance
          next: { revalidate: 86400 } // Revalidate once per day
        }
      );

      if (jsonRes.ok) {
        const { stopwords: stopWords } = await jsonRes.json();

        // Extract keywords from product name
        const filteredText = removeStopWords(product.prod_name, stopWords);
        const keywords = filteredText.trim().split(" ").filter(Boolean);

        // Only fetch related products if we have keywords
        if (keywords.length > 0) {
          const regexPattern = keywords
            .map((word) => `\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`) // Escape special regex characters
            .join("|");

          const query = {
            _id: { $ne: productId }, 
            prod_name: { $regex: regexPattern, $options: "i" }, 
          };

          relatedProducts = await Product.find(query)
            .select("_id prod_name price image stockQuantity") // Select only needed fields
            .limit(10)
            .lean();
        }
      } else {
        console.warn(`Failed to fetch stopwords: ${jsonRes.status}`);
      }
    } catch (error) {
      console.warn("Error fetching related products (non-critical):", error.message);
      // Continue without related products
    }

    const uniqueRelatedProducts = getUniqueObjects(relatedProducts);

    return NextResponse.json(
      { 
        product, 
        relatedProducts: uniqueRelatedProducts 
      },
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  } catch (error) {
    console.error("Error in GET /api/product/:id:", error);
    
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === "development";
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        ...(isDevelopment && { details: error.message })
      },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  }
};

/**
 * PUT /api/product/:id - Update product stock quantity
 */
export const PUT = async (req, ctx) => {
  try {
    // Validate product ID format
    const productId = ctx?.params?.id;
    if (!productId || !isValidObjectId(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const quantity = parseInt(body?.quantity, 10);

    // Validate quantity
    if (isNaN(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid quantity value. Must be a positive integer." },
        { status: 400 }
      );
    }

    // Prevent excessive quantity updates (security measure)
    if (quantity > 1000) {
      return NextResponse.json(
        { error: "Quantity exceeds maximum allowed value" },
        { status: 400 }
      );
    }

    // Find the product and check stock availability
    const product = await Product.findOne({ _id: productId }).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check stock availability
    if (!product.stockQuantity || product.stockQuantity < quantity) {
      return NextResponse.json(
        { 
          error: "Insufficient stock",
          available: product.stockQuantity || 0,
          requested: quantity
        },
        { status: 400 }
      );
    }

    // Update stock quantity by decrementing the given value
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, stockQuantity: { $gte: quantity } }, // Additional safety check
      { $inc: { stockQuantity: -quantity } },
      { new: true, lean: true }
    );

    // Double-check update succeeded
    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Stock update failed. Please try again." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        message: "Stock updated successfully", 
        product: updatedProduct 
      },
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  } catch (error) {
    console.error("Error in PUT /api/product/:id:", error);
    
    const isDevelopment = process.env.NODE_ENV === "development";
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        ...(isDevelopment && { details: error.message })
      },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  }
};
