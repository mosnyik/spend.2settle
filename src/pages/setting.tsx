import Link from "next/link";
import React from "react";
import Settings from "../components/settings/SettingsPage";
import Layout from "../components/Layout";

const Setting = () => {
  return (
    // <div className="p-4">
    //   <Link href="/" legacyBehavior>
    //     <a className="inline-block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    //       Return Home
    //     </a>
    //   </Link>
    //   <h2 className="flex flex-col justify-center items-center font-bold font-Poppins text-black text-2xl">
    //     <br />
    //     <span className="animate-pulse text-blue-500 text-5xl">
    //       <b>Settings</b>
    //     </span>
    //   </h2>

    // </div>
    <div>
      <Layout>
        <Settings />
      </Layout>
    </div>
  );
};

export default Setting;
