import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="React.js User Profile Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js User Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="User Profile" />
      <div className="grid grid-cols-1 gap-6">
        <UserMetaCard />
        <UserInfoCard />
        <UserAddressCard />
      </div>
    </>
  );
}
