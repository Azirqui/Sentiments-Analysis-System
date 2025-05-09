// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";

// export default function Setup2FAPage() {
//   const [qrCode, setQrCode] = useState<string | null>(null);
//   const [code, setCode] = useState("");
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isVerifying, setIsVerifying] = useState(false);
//   useEffect(() => {
//     const fetchQr = async () => {
//       try {
//         const res = await fetch("/api/auth/two-factor/setup", { method: "GET" });
  
//         if (!res.ok) {
//           const errorText = await res.text(); // Safely read the error
//           toast({
//             variant: "destructive",
//             title: "Error",
//             description: errorText || "Failed to fetch QR code",
//           });
//           return;
//         }
  
//         const data = await res.json();
//         setQrCode(data.qrCodeUrl);
//       } catch (err) {
//         console.error("QR fetch error:", err);
//         toast({
//           variant: "destructive",
//           title: "Network error",
//           description: "Could not connect to the server",
//         });
//       }
//     };
  
//     fetchQr();
//   }, []);
  

//   const handleVerify = async () => {
//     if (!code.trim()) {
//       toast({
//         variant: "destructive",
//         title: "Missing code",
//         description: "Please enter the 6-digit code from your authenticator app.",
//       });
//       return;
//     }

//     setIsVerifying(true);
//     try {
//       const res = await fetch("/api/auth/two-factor/verify", {
//         method: "POST",
//         body: JSON.stringify({ token: code }),
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast({
//           title: "2FA Enabled",
//           description: "Two-factor authentication has been successfully enabled.",
//         });

//         setTimeout(() => {
//           router.push("/home");
//         }, 1000); // wait 1 second before redirect
//       } else {
//         toast({
//           variant: "destructive",
//           title: "Verification failed",
//           description: data.error || "Invalid 2FA code. Try again.",
//         });
//       }
//     } catch (err) {
//       console.error("Verification error:", err);
//       toast({
//         variant: "destructive",
//         title: "Network error",
//         description: "Something went wrong during verification.",
//       });
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
//       <h1 className="text-2xl font-semibold mb-4">Set up Two-Factor Authentication</h1>
//       {qrCode ? (
//         <>
//           <p className="mb-2">Scan this QR code with your authenticator app:</p>
//           <img src={qrCode} alt="2FA QR Code" className="mb-4" />
//           <Input
//             type="text"
//             placeholder="Enter 6-digit code"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             className="mb-4"
//           />
//           <Button onClick={handleVerify}>Verify & Enable 2FA</Button>
//         </>
//       ) : (
//         <p>Loading QR code...</p>
//       )}
//     </div>
//   );
// }

// app/auth/two-factor/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Setup2FAPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchQr = async (force = false) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/auth/two-factor/setup${force ? "?force=true" : ""}`);

      if (!res.ok) {
        const errorText = await res.text();
        toast({
          variant: "destructive",
          title: "Error",
          description: errorText || "Failed to fetch QR code",
        });
        return;
      }

      const data = await res.json();
      setQrCode(data.qrCodeUrl);
    } catch (err) {
      console.error("QR fetch error:", err);
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Could not connect to the server",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQr();
  }, []);

  const handleVerify = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "Missing code",
        description: "Please enter the 6-digit code from your authenticator app.",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/two-factor/verify", {
        method: "POST",
        body: JSON.stringify({ token: code }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "2FA Enabled",
          description: "Two-factor authentication has been successfully enabled.",
        });

        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } else {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: data.error || "Invalid 2FA code. Try again.",
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Something went wrong during verification.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await fetchQr(true);
    setIsRegenerating(false);
    toast({
      title: "QR Code Regenerated",
      description: "A new 2FA QR code has been generated.",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Set up Two-Factor Authentication</h1>

      {loading ? (
        <p>Loading QR code...</p>
      ) : qrCode ? (
        <>
          <p className="mb-2">Scan this QR code with your authenticator app:</p>
          <img src={qrCode} alt="2FA QR Code" className="mb-4" />
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mb-4"
          />
          <div className="flex gap-2">
            <Button onClick={handleVerify} disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify & Enable 2FA"}
            </Button>
            <Button variant="outline" onClick={handleRegenerate} disabled={isRegenerating}>
              {isRegenerating ? "Regenerating..." : "Regenerate QR"}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-red-600">Failed to load QR code.</p>
      )}
    </div>
  );
}
