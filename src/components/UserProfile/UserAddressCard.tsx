import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

export default function UserAddressCard() {
  const [address, setAddress] = useState({
    street: "155 Service Rd N, I-9/3 I 9/3 I-9, Islamabad,",
    city: "Islamabad",
    state: "Islamabad Capital Territory",
    zipCode: "44000",
    country: "Pakistan",
  });

  const { isOpen, closeModal } = useModal();

  const handleSave = () => {
    // Handle save logic here
    closeModal();
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
              Address Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Street Address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {address.street}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  City
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {address.city}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  State/Province
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {address.state}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  ZIP/Postal Code
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {address.zipCode}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Country
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {address.country}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="p-6">
          <h3 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
            Edit Address
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Street Address
              </label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Country
              </label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
