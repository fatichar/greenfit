import { permanentRedirect } from "next/navigation";

export default function DevicesRedirectPage() {
  permanentRedirect("/shop/kitchen");
}
