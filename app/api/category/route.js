import Category from "../../../models/Category";
export const dynamic = 'force-dynamic';
// export const GET = async (req) => {
//   try {
//     const { searchParams } = new URL(req.url);
//     const num = parseInt(searchParams.get("num"));
    
//     // Fetch a limited number of categories from MongoDB
//     const categories = await Category.find().limit(num);

//     return new Response(JSON.stringify(categories), {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       status: 200
//     });
//   } catch (error) {
//     console.error("er", error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// };

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const num = parseInt(searchParams.get("num"));
    
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'RealProducts', 
          localField: 'name', 
          foreignField: 'category', 
          as: 'products'
        }
      },
      {
        $match: {
          'products.isFeatured': true 
        }
      },
      {
        $limit: num 
      },
      {
        $project: {
          products: 0 
        }
      }
    ]);

    return new Response(JSON.stringify(categories), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error("er", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};