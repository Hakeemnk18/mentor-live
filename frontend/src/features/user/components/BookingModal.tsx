import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBooking } from "../../../api/booking.api";
// [OTP DISABLED – early stage] Re-enable when phone verification is needed again
// import { sendOtp, resendOtp, verifyOtp } from "../../../api/auth.api";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import PhoneNumberInput from "./ui/PhoneNumberInput";
import ModalShell from "./ui/ModalShell";
import { errorTextCls, fieldCls, labelCls } from "./ui/formStyles";
import Bear from "./ui/Bear";
import { Check, Spinner } from "./ui/Icons";

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
  // phone = country + number as typed; sent to the API in international format (e.g. +919876543210)
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("IN");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [place, setPlace] = useState("");
  const [school, setSchool] = useState("");
  const [syllabusId, setSyllabusId] = useState(defaultSyllabusId ?? "");
  const [classId, setClassId] = useState(defaultClassId ?? "");

  /* ── Phone verification state ── */
  // [OTP DISABLED – early stage] Re-enable when phone verification is needed again
  // const [otpSent, setOtpSent] = useState(false);
  // const [otp, setOtp] = useState("");
  // const [phoneVerified, setPhoneVerified] = useState(false);

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
    setPhoneCountry("IN");
    setPhoneLocal("");
    setPhoneTouched(false);
    setPlace("");
    setSchool("");
    setSyllabusId(defaultSyllabusId ?? "");
    setClassId(defaultClassId ?? "");
    // [OTP DISABLED – early stage] Re-enable when phone verification is needed again
    // setOtpSent(false);
    // setOtp("");
    // setPhoneVerified(false);
    setApiError(null);
    setFieldErrors({});
    setSuccessMsg(null);
    bookingMutation.reset();
  };

  // [OTP DISABLED – early stage] Re-enable when phone verification is needed again
//   /* ── Phone verification logic ── */
//   const sendOtpMutation = useMutation({
//     mutationFn: sendOtp,
//     onSuccess: (data) => {
//       setSuccessMsg(data.message);
//       setOtpSent(true);
//       setApiError(null);
//       setFieldErrors({});
//     },
//     onError: (err: any) => {
//       setSuccessMsg(null);
//       if (err?.message === "Phone number already verified") {
//         setPhoneVerified(true);
//         setOtpSent(false);
//         setApiError(null);
//         setFieldErrors({});
//       } else if (err?.errors) {
//         setFieldErrors(err.errors);
//       } else {
//         setApiError(err?.message || "Failed to send OTP");
//       }
//     },
//   });
//
//   const resendOtpMutation = useMutation({
//     mutationFn: resendOtp,
//     onSuccess: (data) => {
//       setSuccessMsg(data.message);
//       setApiError(null);
//       setFieldErrors({});
//     },
//     onError: (err: any) => {
//       setSuccessMsg(null);
//       if (err?.errors) setFieldErrors(err.errors);
//       else setApiError(err?.message || "Failed to resend OTP");
//     },
//   });
//
//   const verifyOtpMutation = useMutation({
//     mutationFn: verifyOtp,
//     onSuccess: (data) => {
//       setSuccessMsg(data.message);
//       setPhoneVerified(true);
//       setOtpSent(false);
//       setApiError(null);
//       setFieldErrors({});
//     },
//     onError: (err: any) => {
//       setSuccessMsg(null);
//       if (err?.errors) setFieldErrors(err.errors);
//       else setApiError(err?.message || "Failed to verify OTP");
//     },
//   });
//
//   const handleSendOtp = () => {
//     if (phone.length >= 7) sendOtpMutation.mutate({ phoneNumber: phone });
//   };
//
//   const handleResendOtp = () => {
//     if (phone.length >= 7) resendOtpMutation.mutate({ phoneNumber: phone });
//   };
//
//   const handleVerifyOtp = () => {
//     if (otp.length >= 4) verifyOtpMutation.mutate({ phoneNumber: phone, otp });
//   };

  /* class & syllabus of the booking — read at render so values that arrive after the page loads are used */
  const bookingSyllabusId = syllabusId || defaultSyllabusId || "";
  const bookingClassId = classId || defaultClassId || "";

  /* ── Phone validation (works for every country) ── */
  const parsedPhone = parsePhoneNumberFromString(phoneLocal, phoneCountry);
  const phoneValid = !!parsedPhone && parsedPhone.isValid();
  const phoneE164 = phoneValid ? parsedPhone!.number : "";
  const phoneError = phoneTouched && phoneLocal.trim() && !phoneValid ? "Enter a valid phone number for the selected country" : "";

  const handlePhoneChange = (v: string) => {
    // a pasted full number (+971…) switches the country automatically
    if (v.trim().startsWith("+")) {
      const p = parsePhoneNumberFromString(v);
      if (p?.country) {
        setPhoneCountry(p.country);
        setPhoneLocal(p.nationalNumber);
        return;
      }
    }
    setPhoneLocal(v);
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
      user: { name, class: bookingClassId, place, phoneNumber: phoneE164, school, syllabus: bookingSyllabusId },
      booking: bookingPayload,
    });
  };

  const allFieldsFilled = name.trim() && phoneLocal.trim() && place.trim() && school.trim() && bookingSyllabusId && bookingClassId;
  // [OTP DISABLED – early stage] Re-enable when phone verification is needed again
  // const canSubmit = allFieldsFilled && phoneVerified && !bookingMutation.isPending;
  const canSubmit = allFieldsFilled && phoneValid && !bookingMutation.isPending;

  if (!isOpen) return null;

  const getFieldError = (field: string) =>
    fieldErrors[`user.${field}`] || fieldErrors[`booking.${field}`] || fieldErrors[field] || "";

  const closeModal = () => { resetForm(); onClose(); };

  const fieldError = (field: string) =>
    getFieldError(field) ? <p className={errorTextCls}>{getFieldError(field)}</p> : null;

  const isOneToOne = bookingType === "oneToOne";

  return (
    <ModalShell onClose={closeModal} locked={bookingMutation.isPending}>
      {/* Header */}
      <div className="relative overflow-hidden bg-ml-hero text-white px-[26px] pt-[26px] pb-[22px] pr-16 flex flex-col gap-2.5">
        <div
          aria-hidden="true"
          className="absolute w-[300px] h-[300px] -right-[120px] -top-[150px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(146,98,245,.7),rgba(146,98,245,0) 65%)" }}
        />
        <span className="relative self-start px-3 py-1.5 rounded-full bg-ml-coral text-ml-deep text-[11px] font-extrabold tracking-[0.14em] uppercase">
          {isOneToOne ? "One-on-One" : "Pooling"}
        </span>
        <h2 className="relative m-0 font-display font-extrabold text-[28px] leading-tight tracking-[-0.03em]">
          {isOneToOne ? "Book One-on-One" : "Join Pooling"}
        </h2>
        <p className="relative m-0 text-sm font-semibold text-[#C9BFDD]">
          {mode === "chapter" ? "Chapter booking" : "Slot booking"}
        </p>
        {bookingMutation.isSuccess && (
          <div className="absolute right-5 bottom-0 w-[86px] animate-ml-bob" style={{ animationDuration: "2.4s" }}>
            <Bear pose="celebrate" eager />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-[26px] pt-[22px] pb-[26px] flex flex-col gap-3.5">
        {/* Success banner */}
        {successMsg && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[14px] bg-[#DDF3E6] text-[#1E7A4B] text-sm font-bold">
            <Check className="w-4 h-4 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Error banner */}
        {apiError && (
          <div className="px-3.5 py-2.5 rounded-[14px] bg-ml-rose text-ml-red text-sm font-bold">{apiError}</div>
        )}

        {/* Name */}
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Full Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className={fieldCls(getFieldError("name"))}
          />
          {fieldError("name")}
        </label>

        {/* Phone */}
        <div className="flex flex-col gap-1.5" onBlur={() => setPhoneTouched(true)}>
          <label htmlFor="ml-booking-phone" className={labelCls}>
            Phone Number
          </label>
          <PhoneNumberInput
            id="ml-booking-phone"
            country={phoneCountry}
            onCountryChange={setPhoneCountry}
            value={phoneLocal}
            onChange={handlePhoneChange}
            error={phoneError || getFieldError("phoneNumber")}
          />
          {phoneError ? <span className={errorTextCls}>{phoneError}</span> : fieldError("phoneNumber")}
        </div>

        {/* [OTP DISABLED – early stage] Re-enable when phone verification is needed again
        Phone + verification
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ml-booking-phone" className={`${labelCls} flex items-center gap-2`}>
            Phone Number
            {phoneVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DDF3E6] text-[#1E7A4B] text-[11px] tracking-normal normal-case">
                <Check className="w-3 h-3" />
                Verified
              </span>
            )}
          </label>
          <div className="flex gap-2">
            <input
              id="ml-booking-phone"
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
              className={`${fieldCls(getFieldError("phoneNumber"))} flex-1 min-w-0`}
            />
            {!phoneVerified && !otpSent && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={phone.length < 7 || sendOtpMutation.isPending}
                className="flex-shrink-0 h-[52px] px-5 rounded-2xl bg-ml-violet text-white font-extrabold text-sm cursor-pointer transition hover:brightness-110 disabled:bg-[#EEEAF5] disabled:text-[#8E86A3] disabled:cursor-not-allowed"
              >
                {sendOtpMutation.isPending ? "Sending" : "Verify"}
              </button>
            )}
          </div>
          {fieldError("phoneNumber")}

          OTP row
          {otpSent && !phoneVerified && (
            <div className="mt-1.5 p-3.5 rounded-[18px] bg-ml-page flex flex-col gap-2">
              <span className="text-[13px] font-bold text-ml-muted">Enter the code sent to {phone}</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength={6}
                  className={`${fieldCls(getFieldError("otp"))} flex-1 min-w-0 bg-white text-center font-display font-extrabold tracking-[0.3em] text-xl`}
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 4 || verifyOtpMutation.isPending}
                  className="flex-shrink-0 h-[52px] px-5 rounded-2xl bg-ml-deep text-white font-extrabold text-sm cursor-pointer transition hover:brightness-125 disabled:bg-[#EEEAF5] disabled:text-[#8E86A3] disabled:cursor-not-allowed"
                >
                  {verifyOtpMutation.isPending ? "..." : "Confirm"}
                </button>
              </div>
              {fieldError("otp")}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendOtpMutation.isPending}
                className="self-end text-sm font-extrabold text-ml-violet cursor-pointer hover:underline disabled:opacity-60"
              >
                {resendOtpMutation.isPending ? "Resending..." : "Resend code"}
              </button>
            </div>
          )}
        </div>
        */}

        {/* Place + School */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Place</span>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Your city / town"
              className={fieldCls(getFieldError("place"))}
            />
            {fieldError("place")}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>School</span>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Your school name"
              className={fieldCls(getFieldError("school"))}
            />
            {fieldError("school")}
          </label>
        </div>

        {/* [OTP DISABLED – early stage] Re-enable when phone verification is needed again
            Phone not verified hint
        {allFieldsFilled && !phoneVerified && (
          <p className="m-0 px-3.5 py-2.5 rounded-[14px] bg-[#FFF1CC] text-[#8A5A00] text-[13px] font-bold text-center">
            Verify your phone number to continue
          </p>
        )}
        */}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || bookingMutation.isSuccess}
          className={`mt-1 h-14 rounded-[18px] font-extrabold text-base inline-flex items-center justify-center gap-2 transition ${
            canSubmit && !bookingMutation.isSuccess
              ? "bg-ml-violet text-white hover:brightness-110 cursor-pointer"
              : "bg-[#EEEAF5] text-[#8E86A3] cursor-not-allowed"
          }`}
        >
          {bookingMutation.isPending ? (
            <><Spinner /> Submitting...</>
          ) : bookingMutation.isSuccess ? (
            "Success!"
          ) : isOneToOne ? (
            "Confirm One-on-One Booking"
          ) : (
            "Join Pool"
          )}
        </button>
        {/* [OTP DISABLED – early stage] Re-enable when phone verification is needed again
        <span className="text-xs font-semibold text-ml-muted text-center">
          You'll verify your mobile number with a one-time OTP.
        </span>
        */}
        <span className="text-xs font-semibold text-ml-muted text-center">
          We&apos;ll contact you on this number to confirm your class.
        </span>
      </div>
    </ModalShell>
  );
};

export default BookingModal;
