import { Suspense } from "react";
import ConfirmationClient from "./ConfirmationClient";

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationClient />
    </Suspense>
  );
}