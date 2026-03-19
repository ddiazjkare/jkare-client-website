import Package from "../../components/client/Package";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/authOptions";
export const generateMetadata = () => {
  return {
    title: "Package Shipment"
  };
};
const getEnvData = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ship-env`, {
      cache: "no-store",
    });
    if (!response.ok) {
      console.warn(`Ship env fetch failed: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn("Error fetching ship env:", error.message);
    return null;
  }
};
const getUserData = async (userEmail) => {
  if (!userEmail) return null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/info/${userEmail}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};
const Shipment = async () => {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "";
  const [envData, userData] = await Promise.all([
    getEnvData(),
    getUserData(userEmail)
  ]);
  return <Package env={envData} userData={userData} />;
};
export default Shipment;
