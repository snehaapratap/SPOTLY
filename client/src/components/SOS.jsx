/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  FiAlertCircle,
  FiX,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const SOS = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Emergency contact numbers
  const emergencyContacts = [
    { name: "Police", number: "100" },
    { name: "Ambulance", number: "108" },
    { name: "Women Helpline", number: "1091" },
    { name: "Fire", number: "101" },
    { name: "Disaster Management", number: "108" },
  ];

  // Personal emergency contacts
  const [personalContacts, setPersonalContacts] = useState(() => {
    const saved = localStorage.getItem("emergencyContacts");
    return saved ? JSON.parse(saved) : [{ name: "", number: "", relation: "" }];
  });

  useEffect(() => {
    if (isOpen && !location) {
      getCurrentLocation();
    }
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem("emergencyContacts", JSON.stringify(personalContacts));
  }, [personalContacts]);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
        },
        (error) => {
          setError("Unable to retrieve your location");
          console.error("Error getting location:", error);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  const handleEmergencyCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const openGoogleMaps = () => {
    if (location) {
      const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(mapsUrl, "_blank");
    }
  };

  const shareLocationViaSMS = (contact) => {
    if (location) {
      const message = `Emergency! I need help! My current location is: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.location.href = `sms:${contact.number}?body=${encodeURIComponent(
        message
      )}`;
    }
  };

  const shareLocationViaWhatsApp = (contact) => {
    if (location) {
      const message = `Emergency! I need help! My current location is: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(
        `https://wa.me/${contact.number}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    }
  };

  const handleAddContact = () => {
    setPersonalContacts([
      ...personalContacts,
      { name: "", number: "", relation: "" },
    ]);
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...personalContacts];
    newContacts[index][field] = value;
    setPersonalContacts(newContacts);
  };

  const handleRemoveContact = (index) => {
    const newContacts = personalContacts.filter((_, i) => i !== index);
    setPersonalContacts(newContacts);
  };

  // Contact Management Modal
  const ContactManagementModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      >
        <button
          onClick={() => setIsContactModalOpen(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <FiX className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-xl font-bold">Manage Emergency Contacts</h2>

        {personalContacts.map((contact, index) => (
          <div key={index} className="mb-4 space-y-2 rounded-lg border p-4">
            <input
              type="text"
              placeholder="Contact Name"
              value={contact.name}
              onChange={(e) =>
                handleContactChange(index, "name", e.target.value)
              }
              className="w-full rounded border p-2"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={contact.number}
              onChange={(e) =>
                handleContactChange(index, "number", e.target.value)
              }
              className="w-full rounded border p-2"
            />
            <input
              type="text"
              placeholder="Relation"
              value={contact.relation}
              onChange={(e) =>
                handleContactChange(index, "relation", e.target.value)
              }
              className="w-full rounded border p-2"
            />
            {personalContacts.length > 1 && (
              <button
                onClick={() => handleRemoveContact(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={handleAddContact}
          className="mt-4 w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          Add Contact
        </button>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      {/* SOS Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 rounded-full bg-red-600 p-4 text-white shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiAlertCircle className="h-8 w-8" />
      </motion.button>

      {/* Emergency Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-6 w-6" />
              </button>

              <h2 className="mb-6 text-center text-2xl font-bold text-red-600">
                Emergency SOS
              </h2>

              {/* Personal Emergency Contacts */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Personal Emergency Contacts
                  </h3>
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiUsers className="h-5 w-5" />
                  </button>
                </div>
                {personalContacts.map((contact, index) =>
                  contact.name && contact.number ? (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">
                            {contact.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {contact.relation}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEmergencyCall(contact.number)}
                            className="rounded-full p-2 text-green-600 hover:bg-green-50"
                          >
                            <FiPhone className="h-6 w-6" />
                          </button>
                          <button
                            onClick={() => shareLocationViaWhatsApp(contact)}
                            className="rounded-full p-2 text-green-600 hover:bg-green-50"
                          >
                            <FaWhatsapp className="h-6 w-6" />
                          </button>
                          <button
                            onClick={() => shareLocationViaSMS(contact)}
                            className="rounded-full p-2 text-green-600 hover:bg-green-50"
                          >
                            <FiMessageSquare className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>

              {/* Emergency Services */}
              <div className="mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Emergency Services
                </h3>
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">
                          {contact.name}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEmergencyCall(contact.number)}
                        className="rounded-full p-2 text-red-600 hover:bg-red-50"
                      >
                        <FiPhone className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={openGoogleMaps}
                className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
              >
                Open Maps
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Management Modal */}
      {isContactModalOpen && <ContactManagementModal />}
    </>
  );
};

export default SOS;
