import { useState } from 'react';

function PopupShow() {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
        <div>
            <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={togglePopup}
            >
                Delete
            </button>
            {showPopup && (
                <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    <div className="bg-white rounded-lg p-8 max-w-md mx-auto z-50">
                        <h4 className="text-xl font-semibold mb-4">Confirm Delete</h4>
                        <p className="mb-4">Are you sure you want to delete?</p>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-white bg-red-500 hover:bg-red-600 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none"
                                onClick={togglePopup}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                                onClick={() => {
                                    // Add delete logic here
                                    togglePopup();
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PopupShow;
