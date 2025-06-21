import { Suspense } from "react";
import RenewPolicyClient from "./RenewPolicyClient";

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RenewPolicyClient />
    </Suspense>
  );
}