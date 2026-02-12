"use client";
import React from 'react';

const Page = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 mt-32">
      <h1 className="text-2xl font-bold mb-4 font-montserrat">Patient Resources</h1>
      <img
        src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/patient-resources1.png"
        alt="Patient Resources Page 1"
        className="w-full mb-4"
        />
      <img
        src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/patient-resources2.png"
        alt="Patient Resources Page 2"
        className="w-full"
      />
    </div>
  );
};

export default Page;
