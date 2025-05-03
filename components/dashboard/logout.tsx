// app/actions/logout.ts
"use server";

import { signOut } from "next-auth/react";

export async function logout() {
  "use server";
  await signOut();
}
