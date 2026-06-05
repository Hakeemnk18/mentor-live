import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBooking } from "../../../api/booking.api";
import { sendOtp, resendOtp, verifyOtp } from "../../../api/auth.api";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bookingType: "oneToOne" | "pooling";
  mode: "slot" | "chapter";
  facultyId: string;
  slotId?: string | null;
  /**
   * Required when mode = "slot".
   * The SubjectVariant _id the student is booking for — keeps pools separated per subject.
   */
  subjectVariantId?: string;
  chapterId?: string;
  defaultSyllabusId?: string;
  defaultClassId?: string;
};

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingType,
  mode,
  facultyId,
  slotId,
  subjectVariantId,
  chapterId,
  defaultSyllabusId,
  defaultClassId,
}) => {
  const queryClient = useQueryClient();

  /* ── Form state ── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+91");
  const [place, setPlace] = useState("");
  const [school, setSchool] = useState("");
  const [syllabusId, setSyllabusId] = useState(defaultSyllabusId ?? "");
  const [classId, setClassId] = useState(defaultClassId ?? "");

  /* ── Phone verification state ── */
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  /* ── Error / success state ── */
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* ── Booking mutation ── */
  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (data: any) => {
      const msg = data?.message || "Booking submitted successfully!";
      setSuccessMsg(msg);
      toast.success(msg);
      setApiError(null);
      setFieldErrors({});
      
      // Invalidate existing faculty details and slots so the page behind updates
      queryClient.invalidateQueries({ queryKey: ["faculty-detail"] });
      queryClient.invalidateQueries({ queryKey: ["faculty-detail-chapter"] });
      queryClient.invalidateQueries({ queryKey: ["faculty-slots"] });
      queryClient.invalidateQueries({ queryKey: ["slot-details"] });

      setTimeout(() => {
        resetForm();
        onClose();
      }, 2500);
    },
    onError: (err: any) => {
      setSuccessMsg(null);
      if (err?.errors) {
        setFieldErrors(err.errors);
        setApiError(null);
      } else if (err?.message) {
        setApiError(err.message);
        setFieldErrors({});
      } else {
        setApiError("Something went wrong. Please try again.");
        setFieldErrors({});
      }
    },
  });

  const resetForm = () => {
    setName("");
    setPhone("+91");
    setPlace("");
    setSchool("");
    setSyllabusId(defaultSyllabusId ?? "");
    setClassId(defaultClassId ?? "");
    setOtpSent(false);
    setOtp("");
    setPhoneVerified(false);
    setApiError(null);
    setFieldErrors({});
    setSuccessMsg(null);
    bookingMutation.reset();
  };

  /* ── Phone verification logic ── */
  const sendOtpMutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      setSuccessMsg(data.message);
      setOtpSent(true);
      setApiError(null);
      setFieldErrors({});
    },
    onError: (err: any) => {
      setSuccessMsg(null);
      if (err?.message === "Phone number already verified") {
        setPhoneVerified(true);
        setOtpSent(false);
        setApiError(null);
        setFieldErrors({});
      } else if (err?.errors) {
        setFieldErrors(err.errors);
      } else {
        setApiError(err?.message || "Failed to send OTP");
      }
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      setSuccessMsg(data.message);
      setApiError(null);
      setFieldErrors({});
    },
    onError: (err: any) => {
      setSuccessMsg(null);
      if (err?.errors) setFieldErrors(err.errors);
      else setApiError(err?.message || "Failed to resend OTP");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      setSuccessMsg(data.message);
      setPhoneVerified(true);
      setOtpSent(false);
      setApiError(null);
      setFieldErrors({});
    },
    onError: (err: any) => {
      setSuccessMsg(null);
      if (err?.errors) setFieldErrors(err.errors);
      else setApiError(err?.message || "Failed to verify OTP");
    },
  });

  const handleSendOtp = () => {
    if (phone.length >= 7) sendOtpMutation.mutate({ phoneNumber: phone });
  };

  const handleResendOtp = () => {
    if (phone.length >= 7) resendOtpMutation.mutate({ phoneNumber: phone });
  };

  const handleVerifyOtp = () => {
    if (otp.length >= 4) verifyOtpMutation.mutate({ phoneNumber: phone, otp });
  };

  /* ── Submit ── */
  const handleSubmit = () => {
    setApiError(null);
    setFieldErrors({});

    const bookingPayload: any = { facultyId, type: bookingType, mode };
    if (mode === "slot") {
      bookingPayload.slotId = [slotId || ""];
      if (subjectVariantId) bookingPayload.subjectVariantId = subjectVariantId;
    } else if (mode === "chapter" && chapterId) {
      bookingPayload.chapterId = chapterId;
    }

    bookingMutation.mutate({
      user: { name, class: classId, place, phoneNumber: phone, school, syllabus: syllabusId },
      booking: bookingPayload,
    });
  };

  const allFieldsFilled = name.trim() && phone.trim() && place.trim() && school.trim() && syllabusId && classId;
  const canSubmit = allFieldsFilled && phoneVerified && !bookingMutation.isPending;

  if (!isOpen) return null;

  const getFieldError = (field: string) =>
    fieldErrors[`user.${field}`] || fieldErrors[`booking.${field}`] || fieldErrors[field] || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => {
          if (!bookingMutation.isPending) { resetForm(); onClose(); }
        }}
      />

      {/* Modal card — matching BookTutorPage design system */}
      <div className="relative w-full max-w-lg bg-white border-2 border-black shadow-[6px_6px_0px_0px_#111111] max-h-[90vh] overflow-y-auto">
        {/* Header strip */}
        <div className="bg-[#111] px-8 py-5 flex items-center justify-between">
          <div>
            <span className="bg-[#DB313E] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
              {bookingType === "oneToOne" ? "One-on-One" : "Pooling"}
            </span>
            <h2 className="text-white font-extrabold text-xl mt-2">
              {bookingType === "oneToOne" ? "Book One-on-One" : "Join Pooling"}
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              {mode === "chapter" ? "Chapter booking" : "Slot booking"}
            </p>
          </div>
          <button
            onClick={() => { if (!bookingMutation.isPending) { resetForm(); onClose(); } }}
            className="text-gray-500 hover:text-white transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5">
          {/* Success banner */}
          {successMsg && (
            <div className="bg-green-50 border-2 border-green-400 text-green-700 text-sm font-bold px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              {successMsg}
            </div>
          )}

          {/* Error banner */}
          {apiError && (
            <div className="bg-red-50 border-2 border-[#DB313E] text-[#DB313E] text-sm font-bold px-4 py-3">
              {apiError}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-800 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#DB313E] transition"
            />
            {getFieldError("name") && (
              <p className="text-[#DB313E] text-[11px] font-semibold mt-1">{getFieldError("name")}</p>
            )}
          </div>

          {/* Phone + verification */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-800 mb-2">
              Phone Number
              {phoneVerified && (
                <span className="ml-2 text-green-600 text-[10px] inline-flex items-center gap-0.5 normal-case tracking-normal">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  Verified
                </span>
              )}
            </label>
            <div className="flex gap-0">
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  // Prevent removing the +91 prefix
                  const val = e.target.value;
                  if (val.startsWith("+91")) {
                    setPhone(val);
                  } else if (val === "+9" || val === "+" || val === "") {
                    setPhone("+91");
                  }
                  
                  if (phoneVerified) { setPhoneVerified(false); setOtpSent(false); setOtp(""); }
                }}
                placeholder="+91..."
                disabled={phoneVerified}
                className={`flex-1 bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#DB313E] transition ${
                  phoneVerified ? "bg-gray-50 text-gray-400 border-gray-300" : ""
                }`}
              />
              {!phoneVerified && !otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={phone.length < 7 || sendOtpMutation.isPending}
                  className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-2 border-l-0 border-black transition cursor-pointer ${
                    phone.length >= 7 && !sendOtpMutation.isPending
                      ? "bg-[#DB313E] text-white hover:bg-[#c12a36]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {sendOtpMutation.isPending ? "Sending" : "Verify"}
                </button>
              )}
            </div>
            {getFieldError("phoneNumber") && (
              <p className="text-[#DB313E] text-[11px] font-semibold mt-1">{getFieldError("phoneNumber")}</p>
            )}

            {/* OTP row */}
            {otpSent && !phoneVerified && (
              <div className="mt-2">
                <div className="flex gap-0">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    maxLength={6}
                    className="flex-1 bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#DB313E] transition"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otp.length < 4 || verifyOtpMutation.isPending}
                    className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-2 border-l-0 border-black transition cursor-pointer ${
                      otp.length >= 4 && !verifyOtpMutation.isPending
                        ? "bg-[#111] text-white hover:bg-black"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {verifyOtpMutation.isPending ? "..." : "Confirm"}
                  </button>
                </div>
                {getFieldError("otp") && (
                  <p className="text-[#DB313E] text-[11px] font-semibold mt-1">{getFieldError("otp")}</p>
                )}
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendOtpMutation.isPending}
                    className="text-[10px] text-gray-500 hover:text-black hover:underline cursor-pointer transition font-bold"
                  >
                    {resendOtpMutation.isPending ? "Resending..." : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Place + School in a 2-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-800 mb-2">
                Place
              </label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Your city / town"
                className="w-full bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#DB313E] transition"
              />
              {getFieldError("place") && (
                <p className="text-[#DB313E] text-[11px] font-semibold mt-1">{getFieldError("place")}</p>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-800 mb-2">
                School
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Your school name"
                className="w-full bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#DB313E] transition"
              />
              {getFieldError("school") && (
                <p className="text-[#DB313E] text-[11px] font-semibold mt-1">{getFieldError("school")}</p>
              )}
            </div>
          </div>

          {/* Phone not verified hint */}
          {allFieldsFilled && !phoneVerified && (
            <p className="text-center text-[11px] text-amber-600 font-bold uppercase tracking-wider">
              ⚠ Verify your phone number to continue
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || bookingMutation.isSuccess}
            className={`w-full py-3.5 text-sm font-bold uppercase tracking-wider rounded-none transition ${
              canSubmit && !bookingMutation.isSuccess
                ? "bg-[#DB313E] text-white hover:bg-[#c12a36] cursor-pointer"
                : "bg-[#DB313E]/40 text-white/70 cursor-not-allowed"
            }`}
          >
            {bookingMutation.isPending ? (
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : bookingMutation.isSuccess ? (
              "Success!"
            ) : bookingType === "oneToOne" ? (
              "Confirm One-on-One Booking"
            ) : (
              "Join Pool"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
