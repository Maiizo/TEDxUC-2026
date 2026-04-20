"use client";

import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";

type Attendee = {
  id: string;
  fullName: string;
  email: string;
  registrationNumber: string;
  updatedAt: string;
};

type ScanResponse = {
  success: boolean;
  message: string;
  error?: string;
  data?: {
    registration?: {
      id: string;
      fullName: string;
      email: string;
      registrationNumber: string;
      status: string;
      attendanceStatus: string;
      updatedAt: string;
    };
  };
};

export default function AdminAttendanceScannerPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedRef = useRef("");
  const isVerifyingRef = useRef(false);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scannerReady, setScannerReady] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [decodedQr, setDecodedQr] = useState("");
  const [manualQr, setManualQr] = useState("");
  const [statusMessage, setStatusMessage] = useState("Initializing scanner...");
  const [isVerifying, setIsVerifying] = useState(false);
  const [recentAttendees, setRecentAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    isVerifyingRef.current = isVerifying;
  }, [isVerifying]);

  const stopScanner = useCallback(() => {
    const scanner = scannerRef.current;
    if (!scanner) {
      setScannerReady(false);
      return;
    }

    scanner
      .stop()
      .catch(() => null)
      .finally(() => {
        Promise.resolve(scanner.clear())
          .catch(() => null)
          .finally(() => {
            scannerRef.current = null;
            setScannerReady(false);
          });
      });
  }, []);

  const fetchRecentAttendees = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/attendance");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data?.success && Array.isArray(data?.data?.attendees)) {
        setRecentAttendees(data.data.attendees as Attendee[]);
      }
    } catch {
      // Keep scanner functional even if attendee history fails
    }
  }, []);

  const verifyAndMarkAttendance = useCallback(
    async (qrDataInput?: string) => {
      const qrData = (qrDataInput ?? decodedQr ?? manualQr).trim();
      if (!qrData) {
        setStatusMessage("No QR data found. Scan or paste a QR token first.");
        return;
      }

      setIsVerifying(true);
      setStatusMessage("Verifying QR code...");

      try {
        const res = await fetch("/api/admin/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qrData }),
        });

        const data = (await res.json()) as ScanResponse;

        if (res.status === 401) {
          setStatusMessage("Session expired. Redirecting to admin login...");
          window.location.href = "/admin/login";
          return;
        }

        setStatusMessage(data.message || "Failed to verify QR code");

        if (res.ok) {
          await fetchRecentAttendees();
        }
      } catch {
        setStatusMessage("QR verification failed. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    },
    [decodedQr, manualQr, fetchRecentAttendees]
  );

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setHasCameraPermission(false);
          setScannerError("Camera access is not available in this browser.");
          setStatusMessage("Camera unavailable. Use manual QR input below.");
          return;
        }

        const scanner = new Html5Qrcode("attendance-qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          (qrValue) => {
            const normalized = qrValue.trim();
            if (!normalized || normalized === lastScannedRef.current || isVerifyingRef.current) return;

            lastScannedRef.current = normalized;
            setDecodedQr(normalized);
            setStatusMessage("QR detected. Submitting attendance...");
            void verifyAndMarkAttendance(normalized);
          },
          () => {
            // Ignore scan failures between frames.
          }
        );

        if (!mounted) {
          await scanner.stop().catch(() => null);
          await Promise.resolve(scanner.clear()).catch(() => null);
          return;
        }

        setHasCameraPermission(true);
        setScannerReady(true);
        setStatusMessage("Camera ready. Point it to attendee QR code.");
      } catch (error) {
        if (!mounted) return;
        setHasCameraPermission(false);
        const errorMessage = error instanceof Error ? error.message : "Unknown camera error";
        setScannerError(
          `No camera found or permission denied. Allow camera access to scan. ${errorMessage}`
        );
        setStatusMessage("Camera access denied. Use manual QR input below.");
      }
    };

    startScanner();
    fetchRecentAttendees();

    return () => {
      mounted = false;
      stopScanner();
    };
  }, [fetchRecentAttendees, stopScanner, verifyAndMarkAttendance]);

  const activeQr = decodedQr || manualQr;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              Main Event Attendance Scanner
            </h1>
            <span className="text-xs text-gray-500 border border-gray-700 rounded-full px-2 py-0.5">
              Admin
            </span>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 text-sm text-gray-300 border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <section className="bg-gray-950 border border-gray-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-3">Camera Scanner</h2>

          <div className="rounded-xl overflow-hidden border border-gray-800 bg-black mb-4 aspect-video relative">
            <div id="attendance-qr-reader" className="w-full h-full" />
            {!scannerReady && (
              <div className="absolute inset-0 grid place-items-center text-sm text-gray-400 bg-black/70">
                Starting camera...
              </div>
            )}
          </div>

          {scannerError && (
            <div className="mb-4 p-3 rounded-lg border border-amber-800 bg-amber-950/40 text-amber-300 text-sm">
              {scannerError}
            </div>
          )}

          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/60">
              <p className="text-xs text-gray-400 mb-1">Scanned QR</p>
              <p className="font-mono text-sm break-all text-gray-200">{decodedQr || "No QR detected yet"}</p>
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-1.5">Manual QR token input</label>
              <input
                type="text"
                value={manualQr}
                onChange={(e) => setManualQr(e.target.value)}
                placeholder="Paste QR token here if scanner is unavailable"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600"
              />
            </div>

            <button
              onClick={() => verifyAndMarkAttendance(activeQr)}
              disabled={isVerifying || !activeQr.trim()}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isVerifying ? "Verifying..." : "Manual Verify"}
            </button>

            <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/40 text-sm text-gray-300">
              {statusMessage}
            </div>

            <div className="text-xs text-gray-500">
              Camera permission: {hasCameraPermission === null ? "Checking" : hasCameraPermission ? "Granted" : "Not granted"}
            </div>
          </div>
        </section>

        <section className="bg-gray-950 border border-gray-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-3">Recent Check-ins</h2>

          <div className="space-y-2 max-h-[65vh] overflow-auto pr-1">
            {recentAttendees.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-800 rounded-lg">
                No check-ins yet.
              </p>
            ) : (
              recentAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="border border-gray-800 rounded-lg p-3 bg-gray-900/40"
                >
                  <p className="font-semibold text-sm text-white">{attendee.fullName}</p>
                  <p className="text-xs text-gray-400">{attendee.email}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">{attendee.registrationNumber}</p>
                  <p className="text-xs text-green-400 mt-1">
                    Checked in {new Date(attendee.updatedAt).toLocaleString("id-ID")}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}