export async function GET(request) {
  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";
  const organization = searchParams.get("organization") || "";
  const address_line_1 = searchParams.get("address_line_1") || "";
  const address_line_2 = searchParams.get("address_line_2") || "";
  const city_locality = searchParams.get("city_locality") || "";
  const state_province = searchParams.get("state_province") || "";
  const postal_code = searchParams.get("postal_code") || "";
  const country_code = searchParams.get("country_code") || "US";

  // Build the Shippo validation URL
  const url = new URL("https://api.goshippo.com/v2/addresses/validate");
  url.searchParams.set("name", name);
  url.searchParams.set("organization", organization);
  url.searchParams.set("address_line_1", address_line_1);
  url.searchParams.set("address_line_2", address_line_2);
  url.searchParams.set("city_locality", city_locality);
  url.searchParams.set("state_province", state_province);
  url.searchParams.set("postal_code", postal_code);
  url.searchParams.set("country_code", country_code);

  try {
    // Call Shippo API with the provided token
    const shippoResponse = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!shippoResponse.ok) {
      return new Response(JSON.stringify({ error: "Shippo validation failed." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await shippoResponse.json();
    // Return Shippo’s response directly to the client
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Shippo Validation Error:", error);
    return new Response(JSON.stringify({ error: "Server Error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}