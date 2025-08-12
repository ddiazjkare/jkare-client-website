import Package from "../../components/client/Package";
export const dynamic = "force-dynamic";
export const generateMetadata = () => {
  return {
    title: "Package Shipment"
  };
};

const apiCall = async () => {
    const response = await fetch("http://13.127.44.70/api/ship-env", {
      cache: "no-store",
    });
  if (!response.ok) {
    throw new Error("Failed to fetch environment data (/api/ship-env).");
  }
  const data = await response.json();
  // console.log("Response from /ship-env:", data);
  return data;
};

const Shipment = async () => {
  const data = await apiCall();
  return <Package env={data} />;
};


export default Shipment;