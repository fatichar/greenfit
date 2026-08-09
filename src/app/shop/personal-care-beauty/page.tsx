import { redirect } from "next/navigation";

/** Old beauty URL — wellness is the current category. */
export default function PersonalCareBeautyRedirectPage() {
  redirect("/shop/wellness");
}
