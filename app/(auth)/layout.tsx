import { HeaderDashboard } from "@/components/dashboard/header-dashboard";

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <HeaderDashboard />
      <div className="relative grid h-[calc(100%-48px)] overflow-hidden">
        {props.children}
      </div>
    </>
  );
}
