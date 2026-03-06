import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFacultyById, getFacultyAvailableSlots } from "../../../api/faculty.api";

type SlotData = {
  id: string;
  isAvailable: boolean;
  time: string;
  pool: any[];
  poolLimit: number;
};

type FacultyData = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  demoClass?: string;
  image?: string;
  price: number;
  slot?: SlotData;
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const FacultyDetailsPage: React.FC = () => {
  const location = useLocation();
  const { facultyId = "" } = (location.state ?? {}) as { facultyId?: string };

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  /* ── Fetch faculty details ── */
  const { data: faculty, isLoading, isError } = useQuery<FacultyData>({
    queryKey: ["faculty-detail", facultyId],
    queryFn: () => getFacultyById(facultyId),
    enabled: !!facultyId,
  });

  /* ── Fetch available slots ── */
  const { data: slots } = useQuery({
    queryKey: ["faculty-slots", facultyId],
    queryFn: () => getFacultyAvailableSlots(facultyId),
    enabled: !!facultyId,
  });

  const availableSlots = slots ?? [];
  const currentSlot = faculty?.slot;
  const poolCount = currentSlot?.pool?.length ?? 0;
  const poolLimit = currentSlot?.poolLimit ?? 5;

  // Price tiers for pooling visualization
  const priceTiers = [
    { count: 1, label: `${faculty?.price ?? 0}`, suffix: "/each" },
    { count: 2, label: `${Math.round((faculty?.price ?? 0) / 2)}`, suffix: "/each" },
    { count: 3, label: `${Math.round((faculty?.price ?? 0) / 3)}`, suffix: "/each" },
    { count: 4, label: `${Math.round((faculty?.price ?? 0) / 4)}`, suffix: "/each" },
    { count: 5, label: `${Math.round((faculty?.price ?? 0) / 5)}`, suffix: "/each" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-[#F5F5F5]">
        <div className="bg-[#111] h-[200px]" />
        <div className="max-w-5xl mx-auto px-5 md:px-8 -mt-20">
          <div className="animate-pulse">
            <div className="w-36 h-36 rounded-full bg-gray-300 border-4 border-white" />
            <div className="mt-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !faculty) {
    return (
      <div className="min-h-[80vh] bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-medium">Something went wrong</p>
          <p className="text-gray-400 text-sm mt-1">Couldn't load faculty details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-[#F5F5F5]">
      {/* ── Black hero strip ── */}
      <div className="bg-[#111] h-[200px] md:h-[220px]" />

      {/* ── Profile header (overlapping hero) ── */}
      <div className="max-w-5xl mx-auto px-5 md:px-8 -mt-24">
        <div className="flex items-end gap-6 mb-10">
          {/* Avatar */}
          <div className="w-36 h-36 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
            {faculty.image ? (
              <img
                src={faculty.image}
                alt={faculty.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            )}
          </div>

          {/* Name + badges */}
          <div className="pb-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white [text-shadow:_0_2px_4px_rgba(0,0,0,0.8),_0_0_8px_rgba(0,0,0,0.6)]">
              {faculty.name}
            </h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="bg-[#DB313E] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {faculty.qualifications[0] ?? "Faculty"}
              </span>
              {/* <span className="text-gray-400 text-sm">
                {faculty.description?.match(/\d+\s*years?/i)?.[0] ?? ""} experience
              </span> */}
            </div>
          </div>
        </div>

        {/* ── Main content grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-16">
          {/* LEFT COLUMN (3/5) */}
          <div className="lg:col-span-3 space-y-10">
            {/* Introduction */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-[#DB313E] rounded-full" />
                <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wide">
                  Introduction
                </h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed pl-3">
                {faculty.description}
              </p>
            </div>

            {/* Qualifications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-[#DB313E] rounded-full" />
                <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wide">
                  Qualifications
                </h2>
              </div>
              <div className="flex flex-wrap gap-3 pl-3">
                {faculty.qualifications.map((q, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md border border-gray-200"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>

            {/* Demo Class */}
            {faculty.demoClass && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-[#DB313E] rounded-full" />
                  <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wide">
                    Demo Class
                  </h2>
                </div>
                <a
                  href={faculty.demoClass}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#DB313E] text-sm font-semibold hover:underline pl-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Demo Class
                </a>
              </div>
            )}

            {/* Available Slots */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-[#DB313E] rounded-full" />
                <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wide">
                  Available Slots
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 pl-3">
                {availableSlots.length === 0 && (
                  <p className="text-gray-400 text-sm">No available slots at the moment.</p>
                )}
                {availableSlots.map((s) => {
                  const isSelected = selectedSlotId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSlotId(s.id)}
                      className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#DB313E] text-white shadow-sm"
                          : "bg-[#DB313E]/10 text-[#DB313E] hover:bg-[#DB313E]/20"
                      }`}
                    >
                      {formatTime(s.time)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Pooling Card (2/5) */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-8">
              {/* Pooling status */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Pooling status:{" "}
                <span className="text-[#DB313E]">{poolCount}</span>
                <span className="text-gray-400"> / {poolLimit} students joined</span>
              </h3>

              {/* Price tiers */}
              <div className="flex gap-2 mb-4">
                {priceTiers.map((tier, i) => {
                  const isActive = i < poolCount;
                  return (
                    <div key={i} className="flex-1">
                      <div
                        className={`h-2 rounded-full mb-1 ${
                          isActive ? "bg-[#DB313E]" : "bg-gray-200"
                        }`}
                      />
                      <p className="text-[10px] font-bold text-gray-700 text-center">
                        {tier.label}
                        <span className="text-gray-400 font-normal">{tier.suffix}</span>
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Pool avatars */}
              {poolCount > 0 && (
                <div className="flex gap-2 mb-5">
                  {Array.from({ length: poolCount }).map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-3">
                <button className="w-full py-3 bg-[#DB313E] text-white text-sm font-bold rounded-md hover:bg-[#c12a36] transition cursor-pointer">
                  Book This Tutor for ₹{faculty.price}/hr
                </button>
                <button className="w-full py-3 border-2 border-[#DB313E] text-[#DB313E] text-sm font-bold rounded-md hover:bg-[#DB313E]/5 transition cursor-pointer">
                  Join For Pooling
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetailsPage;
