import { useEffect, useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import {
  fetchProductColors,
  fetchLensColors,
} from "../../services/productService";

const GENDERS = ["Men", "Women", "Kids", "Unisex"];
const MATERIALS = ["Metal", "Plastic", "Titanium", "TR90", "Acetate"];
const SHAPES = [
  "Round",
  "Rectangle",
  "Square",
  "Cat-Eye",
  "Aviator",
  "Oval",
  "Geometric",
  "Oversized",
  "Clubmaster",
  "Rimless",
  "Wayfarer",
  "Browline",
];
const LENS_TYPES = [
  "Single Vision",
  "Bifocal",
  "Progressive",
  "Blue Cut",
  "Computer Glasses",
  "Anti-Glare",
  "UV Protection",
  "Photochromic",
  "High Index",
];

const FILTER_KEYS = [
  "gender",
  "material",
  "lensType",
  "shape",
  "color",
  "lensColor",
  "minPrice",
  "maxPrice",
];

export default function FilterSidebar({ filters, onChange }) {
  const [colors, setColors] = useState([]);
  const [lensColors, setLensColors] = useState([]);

  useEffect(() => {
    Promise.allSettled([fetchProductColors(), fetchLensColors()]).then(
      ([colorsResult, lensColorsResult]) => {
        if (colorsResult.status === "fulfilled") setColors(colorsResult.value);
        if (lensColorsResult.status === "fulfilled")
          setLensColors(lensColorsResult.value);
      },
    );
  }, []);

  function toggleValue(key, value) {
    onChange(key, filters[key] === value ? "" : value);
  }

  const hasActiveFilters = FILTER_KEYS.some((key) => filters[key]);

  function clearAll() {
    FILTER_KEYS.forEach((key) => onChange(key, ""));
  }

  return (
    <aside className="flex flex-col space-y-6">
      <div className="flex items-center justify-between border-b border-navy-100 pb-4 dark:border-navy-800">
        <p className="font-display text-base font-bold text-navy-900 dark:text-navy-50">
          Filters
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-navy-600 transition hover:text-navy-700 dark:text-navy-400"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-3 text-xs font-bold text-navy-900 dark:text-navy-50">
            Price Range
          </p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-navy-400 dark:text-navy-500">
                ₹
              </span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) => onChange("minPrice", e.target.value)}
                className="w-full rounded-lg border-2 border-navy-200 bg-white py-2.5 pl-8 pr-3 text-sm font-medium text-navy-700 outline-none transition hover:border-navy-300 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-100"
              />
            </div>
            <span className="text-sm font-medium text-navy-400 dark:text-navy-600">
              to
            </span>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-navy-400 dark:text-navy-500">
                ₹
              </span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) => onChange("maxPrice", e.target.value)}
                className="w-full rounded-lg border-2 border-navy-200 bg-white py-2.5 pl-8 pr-3 text-sm font-medium text-navy-700 outline-none transition hover:border-navy-300 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-100"
              />
            </div>
          </div>
        </div>

        <FilterGroup
          title="Gender"
          options={GENDERS}
          activeValue={filters.gender}
          onSelect={(v) => toggleValue("gender", v)}
        />
        <FilterGroup
          title="Frame material"
          options={MATERIALS}
          activeValue={filters.material}
          onSelect={(v) => toggleValue("material", v)}
        />
        <FilterGroup
          title="Lens type"
          options={LENS_TYPES}
          activeValue={filters.lensType}
          onSelect={(v) => toggleValue("lensType", v)}
        />
        <FilterGroup
          title="Shape"
          options={SHAPES}
          activeValue={filters.shape}
          onSelect={(v) => toggleValue("shape", v)}
        />
        <LensColorFilter
          colors={lensColors}
          activeValue={filters.lensColor}
          onSelect={(v) => toggleValue("lensColor", v)}
        />
        {colors.length > 0 && (
          <FilterGroup
            title="Color"
            options={colors}
            activeValue={filters.color}
            onSelect={(v) => toggleValue("color", v)}
          />
        )}
      </div>
    </aside>
  );
}

function LensColorFilter({ colors, activeValue, onSelect }) {
  const COMMON_LENS_COLORS = [
    "Gray",
    "Brown",
    "Green",
    "Blue",
    "Purple",
    "Pink",
    "Red",
    "Yellow",
    "Clear",
    "Tinted",
    "Mirrored",
    "Gradient",
  ];

  const availableColors = COMMON_LENS_COLORS.filter((c) => colors.includes(c));

  if (availableColors.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-navy-900 dark:text-navy-50">
        Lens Color
      </p>
      <div className="flex flex-wrap gap-2">
        {availableColors.map((color) => {
          const active = activeValue === color;
          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-navy-800 text-white dark:bg-navy-200 dark:text-navy-900"
                  : "border border-navy-200 text-navy-700 hover:border-navy-300 dark:border-navy-700 dark:text-navy-300"
              }`}
            >
              {color}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterGroup({ title, options, activeValue, onSelect }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-navy-900 dark:text-navy-50">
        {title}
      </p>
      <div className="flex flex-col gap-1">
        {options.map((option) => {
          const active = activeValue === option;
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`group flex items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition ${
                active
                  ? "bg-navy-50 text-navy-900 dark:bg-navy-900/20 dark:text-navy-50"
                  : "text-navy-600 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800"
              }`}
            >
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition ${
                  active
                    ? "border-navy-700 bg-navy-700 text-white"
                    : "border-navy-300 bg-transparent group-hover:border-navy-400 dark:border-navy-600"
                }`}
              >
                {active && <IconCheck size={14} strokeWidth={3} />}
              </span>
              <span className="flex-1 text-left">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
