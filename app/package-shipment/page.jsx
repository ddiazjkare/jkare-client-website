import Package from "../../components/client/Package";
export const dynamic = "force-dynamic";
export const generateMetadata = () => {
  return {
    title: "Package Shipment"
  };
};

const apiCall = async () => {
<<<<<<< HEAD
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ship-env`, { cache: "no-store" });
=======
    const response = await fetch("http://13.201.44.76/api/ship-env", {
      cache: "no-store",
    });
>>>>>>> 741517a7326581be69d3565e9647116001919cf3
  if (!response.ok) {
    throw new Error("Failed to fetch environment data (/api/ship-env).");
  }
  const data = await response.json();
  console.log("Response from /ship-env:", data);
  return data;
};

const Shipment = async () => {
  const data = await apiCall();
  return <Package env={data} />;
};

export default Shipment;