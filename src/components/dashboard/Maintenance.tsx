import React, { useState } from "react";

const Maintenance = ({
  onMaintainance = false,
}: {
  onMaintainance: boolean;
}) => {
  const [showDialog, setShowDialog] = useState(onMaintainance);

  if (showDialog) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-[60%] max-h-[200%] overflow-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">⚠️ Maintenance Mode</h2>
          <p className="mb-6 text-lg">
            We are under maintenance, check back later!
          </p>
          <button
            onClick={() => setShowDialog(false)}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
};

export default Maintenance;
