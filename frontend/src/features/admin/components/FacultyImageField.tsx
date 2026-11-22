import { useRef, useState } from "react";
import ShapeCropModal from "./ShapeCropModal";
import { FACULTY_PHOTO } from "./cropShapes";

type Props = {
  /** Current preview (uploaded URL in edit mode, or the cropped file's object URL). */
  value: string | null;
  /** Faculty name, used in the card preview. */
  name?: string;
  error?: string;
  /** Called with the CROPPED file only — the original pick is never uploaded. */
  onChange: (file: File, previewUrl: string) => void;
  onError: (message: string) => void;
};

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Faculty photo upload with a 7:5 cropper that matches the user-side faculty card,
 * plus live previews of the card and the profile photo.
 */
export default function FacultyImageField({ value, name, error, onChange, onError }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  const pick = () => fileRef.current?.click();

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
        {/* Upload / preview box — exact card shape */}
        <div className="w-full sm:w-[230px] shrink-0">
          <div
            role="button"
            tabIndex={0}
            aria-label={value ? "Change faculty photo" : "Upload faculty photo"}
            onClick={pick}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), pick())}
            className={`relative w-full aspect-[7/5] rounded-2xl border-2 border-dashed overflow-hidden flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6D35D9]/25 ${
              error
                ? "border-red-400 bg-red-50"
                : value
                ? "border-transparent bg-[#F4F1FA]"
                : "border-[#E4DDF2] bg-[#FAF8FE] hover:border-[#6D35D9]/60"
            }`}
          >
            {value ? (
              <img src={value} alt="faculty preview" className="w-full h-full object-cover" draggable={false} />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center text-[#8A80A3] px-2">
                <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6D35D9] shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M12 15V3m0 0L8.25 6.75M12 3l3.75 3.75" />
                  </svg>
                </span>
                <span className="text-xs font-medium text-[#2A1650]">Upload photo</span>
                <span className="text-[11px]">{FACULTY_PHOTO.ratioLabel.replace(/\s/g, "")} · {FACULTY_PHOTO.recommended}</span>
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={pick}
              className="h-8 px-3 rounded-full bg-[#F4F1FA] text-[#6D35D9] text-xs font-semibold hover:bg-[#EDE6FB] cursor-pointer"
            >
              {value ? "Change" : "Upload"}
            </button>
            {rawSrc && (
              <button
                type="button"
                onClick={() => setCropOpen(true)}
                className="h-8 px-3 rounded-full bg-[#F4F1FA] text-[#6D35D9] text-xs font-semibold hover:bg-[#EDE6FB] cursor-pointer"
              >
                Crop
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {/* How it looks on the website */}
        {value && (
          <div className="flex-1 min-w-0 rounded-2xl border border-[#E4DDF2] bg-[#FAF8FE] p-3.5">
            <p className="text-xs font-semibold text-[#2A1650]/80 mb-2.5">How it looks on the website</p>
            <div className="flex items-end gap-4">
              {/* Faculty card */}
              <div className="w-[128px] shrink-0">
                <div className="rounded-[14px] bg-white overflow-hidden shadow-[0_10px_22px_-14px_rgba(42,22,80,.45)]">
                  <div className="aspect-[7/5]">
                    <img src={value} alt="" className="w-full h-full object-cover" draggable={false} />
                  </div>
                  <div className="px-2 py-2 space-y-1">
                    <p className="text-[9px] font-bold text-[#2A1650] truncate">{name?.trim() || "Faculty name"}</p>
                    <div className="h-1 w-3/4 rounded-full bg-[#FFD3CE]" />
                    <div className="h-1 w-full rounded-full bg-[#EFE9FA]" />
                    <div className="h-1 w-2/3 rounded-full bg-[#EFE9FA]" />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 text-center mt-1.5">Faculty card</p>
              </div>

              {/* Profile page photo (square, tilted) */}
              <div className="w-[76px] shrink-0">
                <div className="mx-auto w-[64px] aspect-square rounded-[18px] -rotate-[4deg] overflow-hidden shadow-[0_10px_18px_-10px_rgba(10,0,40,.6)] bg-[#F4F1FA]">
                  <img src={value} alt="" className="w-full h-full object-cover rotate-[4deg] scale-110" draggable={false} />
                </div>
                <p className="text-[11px] text-gray-400 text-center mt-2.5">Profile</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 leading-snug">
              The card shows the full photo. The profile photo is square, so keep the face in the centre.
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          if (file.size > MAX_BYTES) {
            onError("Image must be under 5 MB");
            return;
          }
          setRawSrc(URL.createObjectURL(file));
          setCropOpen(true);
        }}
      />

      {cropOpen && rawSrc && (
        <ShapeCropModal
          key={rawSrc}
          open
          image={rawSrc}
          spec={FACULTY_PHOTO}
          onClose={() => setCropOpen(false)}
          onCropComplete={(file) => onChange(file, URL.createObjectURL(file))}
        />
      )}
    </div>
  );
}
