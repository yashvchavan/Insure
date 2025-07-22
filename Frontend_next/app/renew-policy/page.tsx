import { Suspense } from "react";
import RenewPolicyClient from "./RenewPolicyClient";

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <RenewPolicyClient />
    </Suspense>
  );
}