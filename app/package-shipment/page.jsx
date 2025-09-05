import Package from "../../components/client/Package";
export const dynamic = "force-dynamic";
export const generateMetadata = () => {
  return {
    title: "Package Shipment"
  };
};
const apiCall = async () => {
    const response = await fetch(`https://admin.jkare.com/api/ship-env`, {
      cache: "no-store",
    });
  if (!response.ok) {
    throw new Error("Failed to fetch environment data (/api/ship-env).");
  }
  const data = await response.json();
  return data;
};
const Shipment = async () => {
  const data = await apiCall();
  return <Package env={data} />;
};
export default Shipment;