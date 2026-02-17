import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EditProductPage() {
  await getCurrentUser();

  redirect("/inventory");
}
