
import { useEffect, useRef, useState, memo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

function PrescriptionModal({ cart, isModalOpen, setIsModalOpen, email }) {
  const [uploadLater, setUploadLater] = useState(false);
  const [sameFileForAll, setSameFileForAll] = useState(false);
  const [insuranceOption, setInsuranceOption] = useState("no-insurance");
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(true);
  const [sameFile, setSameFile] = useState(null);

  const [prescriptionItems, setPrescriptionItems] = useState(
    cart.length ? cart.filter((i) => i.prescription) : []
  );

  const fileInputRefs = useRef([]);
  const sameRef = useRef(null);
  const router = useRouter();

  /* ----------  Disable / enable checkout  ---------- */
  const checkDisabled = (later, same) => {
    const perItemReady =
      fileInputRefs.current.length &&
      fileInputRefs.current.every((f) => f && f.value !== "");
    setIsCheckoutDisabled(
      !(perItemReady || same || later || prescriptionItems.length === 0)
    );
  };

  useEffect(() => {
    checkDisabled(uploadLater, sameFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileInputRefs, uploadLater, sameFile, prescriptionItems, isModalOpen]);

  if (!isModalOpen) return null;

  /* ----------  Helpers  ---------- */
  const clearList = () => {
    fileInputRefs.current.forEach((f) => f && (f.value = ""));
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPrescriptionItems((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          file: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            filePreview: reader.result,
          },
        };
        return updated;
      });
    };
    reader.readAsDataURL(file);
    fileInputRefs.current[index] = file;
  };

  const sameUploadHandler = () => {
    setSameFileForAll((prev) => !prev);
    setUploadLater(false);
    clearList();
    if (sameFileForAll) {
      setSameFile(null);
      sameRef.current && (sameRef.current.value = "");
    } else {
      setPrescriptionItems((prev) => prev.map(({ file, ...rest }) => rest));
    }
  };

  const sameFileUploader = (e) => setSameFile(e.target.files[0]);

  const updloadLaterHandler = () => {
    setUploadLater((prev) => !prev);
    clearList();
    setSameFileForAll(false);
    setSameFile(null);
    sameRef.current && (sameRef.current.value = "");
    setPrescriptionItems((prev) => prev.map(({ file, ...rest }) => rest));
  };

  const handleInsuranceUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setInsuranceFile({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        filePreview: reader.result,
      });
    reader.readAsDataURL(file);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCheckoutDisabled(true);
  };

  /* ----------  Checkout  ---------- */
  const checkoutHandler = async () => {
    if (
      insuranceOption === "upload" &&
      (!insuranceFile || selectedInsurance === "")
    ) {
      alert("Please select an insurance company and upload a file.");
      return;
    }

    let metadata = {};
    let file = "";
    const metaProd = {};
    const lineItems = [];

    if (prescriptionItems.length) {
      metadata.prescription_required = true;
      metadata.prescription_items = {};
      metadata.prescription_status = sameFile
        ? "Received"
        : prescriptionItems.every((p) => p.file)
          ? "Received"
          : "Pending";
    } else {
      metadata.prescription_required = false;
      metadata.prescription_status = "";
    }

    if (sameFileForAll && sameFile) {
      const fd = new FormData();
      fd.set("profile", sameFile);
      const imgRes = await fetch("/api/user/image", { method: "POST", body: fd });
      const { secureUrl } = await imgRes.json();
      file = secureUrl;
    }

    for (const item of cart) {
      metaProd[item.title] = item.product_id;
      if (item.prescription) {
        const itemToUpdate = prescriptionItems.find(
          (c) => c.product_id === item.product_id
        );
        if (itemToUpdate?.file) {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: JSON.stringify({ ...itemToUpdate.file }),
          });
          const { fileURL } = await res.json();
          file = fileURL;
        }
        metadata.prescription_items[item.product_id] = file;
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
            images: item.images,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: parseInt(item.quantity, 10),
        adjustable_quantity: { enabled: true },
      });
    }

    if (metadata.prescription_items)
      metadata.prescription_items = JSON.stringify(metadata.prescription_items);
    metadata.products = JSON.stringify(metaProd);

    if (insuranceOption === "upload") {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify(insuranceFile),
      });
      const { fileURL } = await res.json();
      metadata.insurance_file = fileURL;
      metadata.insurance_company = selectedInsurance;
    }

    const totalCartValue = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const checkoutObj = {
      line_items: lineItems,
      metadata,
      total_amount: totalCartValue,
      ...(email && { email }),
    };

    localStorage.setItem("checkoutStorage", JSON.stringify(checkoutObj));
    router.push("/package-shipment");
    setIsModalOpen(false);
  };

  /* ----------  JSX  ---------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="h-[50vh] w-[95vw] max-w-5xl overflow-y-auto rounded-lg bg-white p-4 sm:p-6">
        {/* ──────────────────────────  PRESCRIPTION  ───────────────────────── */}
        {prescriptionItems.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold sm:text-lg">
                Upload Prescription
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition p-1 text-lg"
                aria-label="Close modal"
              >
                {/* simple “×” but you can swap in an icon if you like */}
                ×
              </button>
            </div>

            {/* Desktop table */}
            <div
              className={`hidden max-h-64 overflow-y-auto md:block ${prescriptionItems.length > 3 ? "overflow-y-auto" : ""
                }`}
            >
              <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm">
                <thead className="sticky top-0 bg-white text-[0.65rem] sm:text-xs">
                  <tr>
                    <th className="border p-2">S.no</th>
                    <th className="border p-2">Image</th>
                    <th className="border p-2">Product</th>
                    <th className="border p-2">Price&nbsp;($)</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Upload</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptionItems.map((item, idx) => (
                    <tr key={item.product_id} className="text-center">
                      <td className="border p-2">{idx + 1}.</td>
                      <td className="border p-2">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="h-8 w-8 rounded-lg object-contain"
                        />
                      </td>
                      <td className="border p-2">{item.title}</td>
                      <td className="border p-2">
                        {item.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">
                        <input
                          type="file"
                          ref={(el) => (fileInputRefs.current[idx] = el)}
                          disabled={uploadLater || sameFileForAll}
                          onChange={(e) => handleFileChange(idx, e)}
                          className="file:h-8 file:cursor-pointer file:rounded file:border file:border-gray-400 file:bg-white file:px-3 file:text-xs hover:file:bg-customBlue hover:file:text-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
              {prescriptionItems.map((item, idx) => (
                <div
                  key={item.product_id}
                  className="flex items-center justify-between rounded-lg border border-gray-300 p-3 text-xs"
                >
                  <div className="flex flex-1 items-center space-x-2">
                    <span className="font-semibold">{idx + 1}.</span>
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-10 w-10 flex-shrink-0 rounded-lg object-contain"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.title}</p>
                      <p className="text-[0.65rem] text-gray-500">
                        $
                        {item.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        &nbsp;x&nbsp;{item.quantity}
                      </p>
                    </div>
                  </div>

                  <label className="ml-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-400 hover:bg-customBlue hover:text-white">
                    <ArrowUpTrayIcon className="h-4 w-4" />
                    <input
                      type="file"
                      className="hidden"
                      ref={(el) => (fileInputRefs.current[idx] = el)}
                      disabled={uploadLater || sameFileForAll}
                      onChange={(e) => handleFileChange(idx, e)}
                    />
                  </label>
                  {item.file && (
                    <p className="mt-1 w-2/3 truncate text-[0.65rem] text-gray-600">
                      {item.file.fileName}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Checkboxes */}
            {prescriptionItems.length > 1 && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={sameFileForAll}
                    onChange={sameUploadHandler}
                  />
                  <span className="ml-2">
                    Use the same prescription for all items
                  </span>
                </label>
                {sameFileForAll && (
                  <p className="text-xs text-red-500">
                    Upload at least one file to use the same prescription for
                    all items
                  </p>
                )}


                {sameFileForAll && (
                  <input
                    type="file"
                    ref={sameRef}
                    onChange={sameFileUploader}
                    className="file:h-8 file:cursor-pointer file:rounded file:border file:border-gray-400 file:bg-white file:px-3 text-xs hover:file:bg-customBlue hover:file:text-white"
                  />
                )}
              </div>
            )}

            <label className="mt-3 inline-flex items-center text-xs sm:text-sm">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={uploadLater}
                onChange={updloadLaterHandler}
              />
              <span className="ml-2">Upload the prescription later</span>
            </label>
          </>
        )}

        {/* ───────────────────────────  INSURANCE  ────────────────────────── */}
        <div className="mt-6 text-xs sm:text-sm">
          <h2 className="mb-3 text-base font-semibold sm:text-lg">
            Choose insurance option
          </h2>

          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                value="upload"
                name="insurance"
                checked={insuranceOption === "upload"}
                onChange={() => setInsuranceOption("upload")}
              />
              <span className="ml-2">Upload Insurance</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                value="no-insurance"
                name="insurance"
                checked={insuranceOption === "no-insurance"}
                onChange={() => setInsuranceOption("no-insurance")}
              />
              <span className="ml-2">I don't have insurance</span>
            </label>
          </div>

          {insuranceOption === "upload" && (
            <div className="mt-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
              <select
                value={selectedInsurance}
                onChange={(e) => setSelectedInsurance(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 p-2 text-xs sm:text-sm"
              >
                <option value="" disabled>
                  Select Insurance Company
                </option>
                {insuranceCompanies.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                type="file"
                onChange={handleInsuranceUpload}
                className="file:h-8 file:cursor-pointer file:rounded file:border file:border-gray-400 file:bg-white file:px-3 text-xs hover:file:bg-customBlue hover:file:text-white"
              />
            </div>
          )}
        </div>

        {/* ────────────────────────────  BUTTONS  ─────────────────────────── */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            className={`rounded-lg px-4 py-2 text-sm text-white transition ${isCheckoutDisabled
              ? "cursor-not-allowed bg-gray-400"
              : "bg-customBlue hover:bg-customPink"
              }`}
            onClick={checkoutHandler}
            disabled={isCheckoutDisabled}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

const insuranceCompanies = [
  "State Farm",
  "Geico",
  "Progressive",
  "Allstate",
  "Liberty Mutual",
  "USAA",
  "Farmers Insurance",
  "Nationwide",
  "American Family Insurance",
  "Travelers",
  "MetLife",
  "Chubb",
  "Hartford",
  "CNA Financial",
  "Aflac",
  "Mutual of Omaha",
  "New York Life",
  "Northwestern Mutual",
  "Prudential Financial",
  "Guardian Life",
  "MassMutual",
  "Cigna",
  "Humana",
  "Blue Cross Blue Shield",
  "UnitedHealthcare",
  "Aetna",
  "Anthem",
  "Colonial Life",
  "American National Insurance",
  "Principal Financial",
  "Pacific Life",
  "Lincoln Financial",
  "Protective Life",
  "Ameritas",
  "EmblemHealth",
  "American Fidelity",
  "Plymouth Rock Assurance",
  "Erie Insurance",
  "Kemper",
  "Lemonade",
  "SafeAuto",
  "Mercury Insurance",
  "Amica Mutual Insurance",
  "Markel Corporation",
  "Western & Southern Financial",
  "Horace Mann",
  "OneBeacon",
  "Selective Insurance Group",
  "Alfa Insurance",
  "Acadia Insurance",
  "Esurance",
];

export default memo(PrescriptionModal);
