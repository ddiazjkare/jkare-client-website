export default async function handler(req, res) {
  // We expect query params from the client
  const {
    address_line_1,
    address_line_2,
    city_locality,
    state_province,
    postal_code,
    country_code,
  } = req.query;

  // Build the Shippo validation URL
  const url = new URL("http://api.goshippo.com/v2/addresses/validate");
  url.searchParams.set("address_line_1", address_line_1 || "");
  url.searchParams.set("address_line_2", address_line_2 || "");
  url.searchParams.set("city_locality", city_locality || "");
  url.searchParams.set("state_province", state_province || "");
  url.searchParams.set("postal_code", postal_code || "");
  url.searchParams.set("country_code", country_code || "US");

  try {
    // Call Shippo with your test token:
    const shippoResponse = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: "ShippoToken shippo_test_525d0eadb185a2d9a69d3656dee2bbe4472a7476",
        "Content-Type": "application/json",
      },
    });

    if (!shippoResponse.ok) {
      return res.status(400).json({ error: "Shippo validation failed." });
    }

    const data = await shippoResponse.json();
    // Return Shippo’s JSON directly to the client
    return res.status(200).json(data);
  } catch (error) {
    console.error("Shippo Validation Error:", error);
    return res.status(500).json({ error: "Server Error." });
  }
}
