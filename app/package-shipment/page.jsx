import Package from "../../components/client/Package";
export const dynamic = "force-dynamic";
export const generateMetadata = () => {
  return {
    title: "Package Shipment"
  };
};

const apiCall = async () => {
    const response = await fetch("http://13.201.44.76/api/ship-env", {
      cache: "no-store",
    });
  if (!response.ok) {
    throw new Error("Failed to fetch environment data (/api/ship-env).");
  }
  return await response.json();
};

const Shipment = async () => {
  const data = await apiCall();
  return <Package env={data} />;
};

export default Shipment;