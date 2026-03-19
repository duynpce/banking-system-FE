import { useState } from "react";
import Card from "../../../shared/component/Card";
import InfoItem from "../../../shared/component/InfoItem";
import Button from "../../../shared/component/Button";
import InputWithLabel from "../../../shared/component/InputWithLabel";

type Tab = "Edit Profile" | "Edit Password";

type ProfileForm = {
  phone: string;
  address: string;
  email: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
};

const statCards = [
  { label: "My Balance", value: "$12,750", bg: "bg-yellow-100", text: "text-yellow-500" },
  { label: "Income",     value: "$5,600",  bg: "bg-blue-100",   text: "text-blue-500"   },
  { label: "Expense",    value: "$3,460",  bg: "bg-pink-100",   text: "text-pink-500"   },
];

const CustomerDashboardAccount = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Edit Profile");

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyError, setVerifyError] = useState("");

  const MOCK_PASSWORD = "password123";

  const [profile, setProfile] = useState<ProfileForm>({
    phone: "+1 (555) 000-0000",
    address: "San Jose, California, USA",
    email: "charlenereed@gmail.com",
  });
  const [profileDraft, setProfileDraft] = useState<ProfileForm>(profile);

  const [passwords, setPasswords] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
  });

  const handleEditClick = () => {
    setVerifyPassword("");
    setVerifyError("");
    setShowPasswordModal(true);
  };

  const handleVerifySubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (verifyPassword === MOCK_PASSWORD) {
      setProfileDraft({ ...profile });
      setIsEditing(true);
      setShowPasswordModal(false);
    } else {
      setVerifyError("Incorrect password. Please try again.");
    }
  };

  const handleProfileSave = (e: React.SubmitEvent) => {
    e.preventDefault();
    setProfile(profileDraft);
    setIsEditing(false);
  };

  const inputClass = (disabled: boolean) =>
    `w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
      disabled
        ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-700 border-blue-400 focus:ring-2 focus:ring-blue-300"
    }`;

  const TABS: Tab[] = ["Edit Profile", "Edit Password"];

  return (
    <div className="grid grid-cols-12 gap-5 p-8">

      {statCards.map((card) => (
        <Card
          key={card.label}
          title=""
          className="col-span-4"
          innerClassName="bg-white flex items-center gap-5"
        >
          <span className={`flex items-center justify-center w-14 h-14 rounded-full text-2xl ${card.bg} ${card.text}`}>
            $
          </span>
          <InfoItem title={card.label} value={card.value} />
        </Card>
      ))}

      <Card className="col-span-12 bg-white rounded-3xl p-4" title={""}>

        <nav className="flex gap-8 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "Edit Profile" && (
          <form className="flex flex-col items-center justify-center w-full h-full mb-8 gap-4" onSubmit={handleProfileSave}>

            <InputWithLabel
              label="Phone Number"
              blockClassName="w-1/2"
              className={inputClass(!isEditing)}
              disabled={!isEditing}
              value={profileDraft.phone}
              onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })}
            />
  
            <InputWithLabel
              label="Email"
              type="email"
              blockClassName="w-1/2"
              className={inputClass(!isEditing)}
              disabled={!isEditing}
              value={profileDraft.email}
              onChange={(e) => setProfileDraft({ ...profileDraft, email: e.target.value })}
            />

            <InputWithLabel
              label="Address"
              blockClassName="w-1/2"
              className={inputClass(!isEditing)}
              disabled={!isEditing}
              value={profileDraft.address}
              onChange={(e) => setProfileDraft({ ...profileDraft, address: e.target.value })}
            />

            <div className="w-full gap-3 flex justify-center">
              {isEditing ? (
                <Button type="submit" content="Save" className="w-1/2 rounded-xl px-8 " />              
              ) : (
                <Button type="button" content="Edit" onClick={handleEditClick} className="w-1/2 rounded-xl px-8" />
              )}
            </div>
          </form>
        )}

        {activeTab === "Edit Password" && (
          <form className="flex flex-col items-center justify-center w-full h-full mb-8 gap-4" onSubmit={(e) => e.preventDefault()}>
            
              <InputWithLabel
                label="Current Password"
                type="password"
                placeholder="**********"
                blockClassName="w-1/2 flex "
                className={inputClass(false)}
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />

              <InputWithLabel
                label="New Password"
                type="password"
                placeholder="**********"
                blockClassName="w-1/2 flex"
                className={inputClass(false)}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />

              <Button type="submit" content="Save" className="w-1/2 rounded-xl px-8" />
          </form>
        )}

      </Card>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Verify your identity</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your password to enable editing.</p>

            <form onSubmit={handleVerifySubmit} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Enter password"
                autoFocus
                className={`${inputClass(false)} border-gray-300`}
                value={verifyPassword}
                onChange={(e) => { setVerifyPassword(e.target.value); setVerifyError(""); }}
              />
              {verifyError && <p className="text-sm text-red-500">{verifyError}</p>}

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-5 py-2 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <Button type="submit" content="Confirm" className="rounded-xl px-6" />
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboardAccount;