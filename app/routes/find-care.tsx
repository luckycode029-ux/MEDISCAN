import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  IconArrowLeft,
  IconSearch,
  IconStar,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";
import type { Route } from "./+types/find-care";
import styles from "./find-care.module.css";
import { CLINICS, DOCTORS, SPECIALTIES } from "~/data/clinics";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Find Care | MediScan AI" }];
}

export default function FindCare() {
  const navigate = useNavigate();
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredClinics = CLINICS.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = !activeSpecialty || c.specialties.includes(activeSpecialty);
    return matchSearch && matchSpecialty;
  });

  const filteredDoctors = DOCTORS.filter((d) => {
    const matchSpecialty = !activeSpecialty || d.specialty.toLowerCase().includes(activeSpecialty.toLowerCase());
    return matchSpecialty;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>
          <IconArrowLeft size={20} />
        </Link>
        <h1 className={styles.headerTitle}>Find Care</h1>
        <p className={styles.headerSub}>Clinics & specialists near you</p>
        <div className={styles.searchBar}>
          <IconSearch size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search clinics or specialists..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.body}>
        {/* Specialties */}
        <div className={styles.specialtiesWrap}>
          {SPECIALTIES.map((s) => (
            <button
              key={s.label}
              className={`${styles.specialtyChip} ${activeSpecialty === s.label ? styles.active : ''}`}
              onClick={() => setActiveSpecialty(activeSpecialty === s.label ? null : s.label)}
            >
              <div
                className={styles.specialtyIconWrap}
                style={{ background: s.color + "20" }}
              >
                <span>{s.icon}</span>
              </div>
              <span className={styles.specialtyLabel}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Clinics */}
        <div>
          <h2 className={styles.sectionTitle}>Nearby Hospitals</h2>
          {filteredClinics.map((clinic) => (
            <div key={clinic.id} style={{ marginBottom: 'var(--space-4)' }}>
              <div className={styles.clinicCard}>
                <div
                  className={styles.clinicCardTop}
                  style={{ background: clinic.imageColor }}
                >
                  <div
                    className={styles.clinicAvatar}
                    style={{ background: clinic.imageColor }}
                  >
                    {clinic.name[0]}
                  </div>
                  <span className={`${styles.clinicOpenBadge} ${clinic.isOpen ? styles.open : styles.closed}`}>
                    {clinic.isOpen ? `Open until ${clinic.openUntil}` : "Closed"}
                  </span>
                </div>
                <div className={styles.clinicCardBody}>
                  <h3 className={styles.clinicName}>{clinic.name}</h3>
                  <p className={styles.clinicType}>{clinic.type}</p>
                  <div className={styles.clinicMeta}>
                    <span className={`${styles.metaItem} ${styles.ratingItem}`}>
                      <IconStar size={13} fill="currentColor" /> {clinic.rating} ({clinic.reviewCount})
                    </span>
                    <span className={styles.metaItem}>
                      <IconMapPin size={13} /> {clinic.distance}
                    </span>
                  </div>
                  <div className={styles.specialtyTags}>
                    {clinic.specialties.map((sp) => (
                      <span key={sp} className={styles.specialtyTag}>{sp}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Doctors */}
        <div>
          <h2 className={styles.sectionTitle}>Available Doctors</h2>
          {filteredDoctors.map((doc) => (
            <div key={doc.id} style={{ marginBottom: 'var(--space-4)' }}>
              <div className={styles.doctorCard}>
                <div
                  className={styles.doctorAvatar}
                  style={{ background: doc.imageColor }}
                >
                  {doc.name.split(" ")[1]?.[0] ?? "D"}
                </div>
                <div className={styles.doctorInfo}>
                  <div className={styles.doctorNameRow}>
                    <h3 className={styles.doctorName}>{doc.name}</h3>
                    {doc.badge && <span className={styles.bestMatchBadge}>{doc.badge}</span>}
                  </div>
                  <p className={styles.doctorSpecialty}>{doc.specialty}</p>
                  <p className={styles.doctorClinic}>{doc.clinicName}</p>
                  <div className={styles.doctorMeta}>
                    <span className={styles.doctorMetaItem}>★ {doc.rating}</span>
                    <span className={styles.doctorMetaItem}>{doc.experience} yrs exp</span>
                    <span className={styles.doctorMetaItem}>₹{doc.fee} fee</span>
                  </div>
                  <button
                    className={styles.bookDoctorBtn}
                    onClick={() => navigate(`/book/${doc.id}`)}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
