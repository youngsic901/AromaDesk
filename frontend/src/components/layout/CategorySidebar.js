import React from "react";
import Accordion from "react-bootstrap/Accordion";

const BRAND_OPTIONS = [
  { code: "CHANEL", label: "샤넬" },
  { code: "DIOR", label: "디올" },
  { code: "GUCCI", label: "구찌" },
  { code: "YSL", label: "입생로랑" },
  { code: "HERMES", label: "에르메스" },
];
const GENDER_OPTIONS = [
  { code: "MALE", label: "남성용" },
  { code: "FEMALE", label: "여성용" },
  { code: "UNISEX", label: "남녀공용" },
];

const CategorySidebar = ({
  selectedBrand,
  setSelectedBrand,
  selectedGender,
  setSelectedGender,
  applyFilters,
  clearFilters,
}) => (
  <div className="card mb-4 border-0">
    <div className="card-header fw-bold bg-white border-bottom">카테고리</div>
    <div className="card-body">
      <div className="mb-4">
        <div className="fw-semibold mb-2">브랜드</div>
        {BRAND_OPTIONS.map((brand) => (
          <div className="form-check mb-2" key={brand.code}>
            <input
              className="form-check-input"
              type="radio"
              name="brand"
              id={`brand-${brand.code}`}
              value={brand.code}
              checked={selectedBrand === brand.code}
              onChange={(e) => setSelectedBrand(e.target.value)}
            />
            <label className="form-check-label" htmlFor={`brand-${brand.code}`}>
              {brand.label}
            </label>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <div className="fw-semibold mb-2">성별</div>
        {GENDER_OPTIONS.map((gender) => (
          <div className="form-check mb-2" key={gender.code}>
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id={`gender-${gender.code}`}
              value={gender.code}
              checked={selectedGender === gender.code}
              onChange={(e) => setSelectedGender(e.target.value)}
            />
            <label
              className="form-check-label"
              htmlFor={`gender-${gender.code}`}
            >
              {gender.label}
            </label>
          </div>
        ))}
      </div>
      <button className="btn btn-primary w-100 mb-2" onClick={applyFilters}>
        필터 적용
      </button>
      <button
        className="btn btn-link w-100 text-secondary"
        style={{ fontSize: 14 }}
        onClick={clearFilters}
      >
        초기화
      </button>
    </div>
  </div>
);

export default CategorySidebar;
