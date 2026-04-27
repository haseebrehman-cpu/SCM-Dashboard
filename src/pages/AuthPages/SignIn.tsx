import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Signin | SCM - Dashboard"
        description="This is Signin page for SCM"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
