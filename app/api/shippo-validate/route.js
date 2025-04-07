export async function GET(request) {
  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);
  const params = {
    name: searchParams.get("name") || "",
    organization: searchParams.get("organization") || "",
    address_line_1: searchParams.get("address_line_1") || "",
    address_line_2: searchParams.get("address_line_2") || "",
    city_locality: searchParams.get("city_locality") || "",
    state_province: searchParams.get("state_province") || "",
    postal_code: searchParams.get("postal_code") || "",
    country_code: searchParams.get("country_code") || "US"
  };

  // Build initial response object with current input states
  const responseData = {
    input: params,
    validation: {
      is_complete: false,
      fields: {
        name: { valid: null, message: "" },
        address_line_1: { valid: null, message: "" },
        city_locality: { valid: null, message: "" },
        state_province: { valid: null, message: "" },
        postal_code: { valid: null, message: "" },
        country_code: { valid: true, message: "" }
      },
      shippo_response: null
    }
  };

  // Basic field presence validation
  responseData.validation.fields.name.valid = params.name.length > 0;
  responseData.validation.fields.address_line_1.valid = params.address_line_1.length > 0;
  responseData.validation.fields.city_locality.valid = params.city_locality.length > 0;
  responseData.validation.fields.state_province.valid = params.state_province.length > 0;
  responseData.validation.fields.postal_code.valid = params.postal_code.length > 0;

  // Check if we have minimum required fields for Shippo validation
  const hasRequiredFields = 
    params.address_line_1.length > 0 &&
    params.city_locality.length > 0 &&
    params.state_province.length > 0 &&
    params.postal_code.length > 0;

  if (hasRequiredFields) {
    // Build the Shippo validation URL
    const url = new URL("https://api.goshippo.com/v2/addresses/validate");
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });

    try {
      const shippoResponse = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      const data = await shippoResponse.json();
      
      // Update validation based on Shippo response
      if (shippoResponse.ok) {
        responseData.validation.is_complete = data.is_complete;
        responseData.validation.shippo_response = data;
        
        // Update individual field validations based on Shippo response
        if (data.validation_results) {
          const results = data.validation_results;
          responseData.validation.fields.address_line_1 = {
            valid: results.address_line_1?.is_valid ?? true,
            message: results.address_line_1?.messages?.[0] ?? ""
          };
          // Add similar updates for other fields as per Shippo's response structure
        }
      }
    } catch (error) {
      console.error("Shippo Validation Error:", error);
      responseData.validation.fields.address_line_1.message = "Validation service unavailable";
    }
  }

  // Return response regardless of Shippo validation status
  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}