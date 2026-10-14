import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import MobileBookingBar from "@/components/ui/MobileBookingBar";
import LightboxProvider from "@/components/ui/LightboxProvider";
import CheckAvailabilityProvider from "@/components/ui/CheckAvailabilityProvider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LightboxProvider>
      <CheckAvailabilityProvider>
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
        <MobileBookingBar />
      </CheckAvailabilityProvider>
    </LightboxProvider>
  );
}
