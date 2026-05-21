import { useState } from "react";
import { Link, useParams } from "react-router";
import { IconArrowLeft, IconCalendar, IconClock } from "@tabler/icons-react";
import type { Route } from "./+types/book";
import styles from "./book.module.css";
import { DOCTORS } from "~/data/clinics";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Book Appointment | MediScan AI" }];
}

const DAYS = [
  { name: "Mon", num: 19 },
  { name: "Tue", num: 20 },
  { name: "Wed", num: 21 },
  { name: "Thu", num: 22 },
  { name: "Fri", num: 23 },
  { name: "Sat", num: 24 },
];

export default function Book() {
  const { doctorId } = useParams();
  const doctor = DOCTORS.find((d) => d.id === doctorId) ?? DOCTORS[0];

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const canConfirm = selectedDay !== null && selectedSlot !== null && patientName.trim();

  const confirm = () => {
    if (canConfirm) setConfirmed(true);
  };

  if (confirmed) {
    const day = DAYS[selectedDay!];
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div style={{ height: 40 }} />
          <h1 className={styles.headerTitle}>Appointment Booked</h1>
        </div>
        <div className={`${styles.body} ${styles.successWrap}`}>
          <div className={styles.successIconWrap}>✅</div>
          <h2 className={styles.successTitle}>You’re all set!</h2>
          <p className={styles.successSub}>
            Your appointment has been confirmed. We’ll send you a reminder before your visit.
          </p>

          <div className={styles.bookingCard}>
            <div className={styles.bookingHeader}>
              <span className={styles.bookingHeaderIcon}>📅</span>
              <h3 className={styles.bookingHeaderTitle}>Appointment Details</h3>
            </div>
            <div className={styles.bookingBody}>
              <div className={styles.bookingRow}>
                <span className={styles.bookingLabel}>Doctor</span>
                <span className={styles.bookingValue}>{doctor.name}</span>
              </div>
              <div className={styles.bookingRow}>
                <span className={styles.bookingLabel}>Specialty</span>
                <span className={styles.bookingValue}>{doctor.specialty}</span>
              </div>
              <div className={styles.bookingRow}>
                <span className={styles.bookingLabel}>Hospital</span>
                <span className={styles.bookingValue}>{doctor.clinicName}</span>
              </div>
              <div className={styles.bookingRow}>
                <span className={styles.bookingLabel}>Date</span>
                <span className={styles.bookingValue}>{day.name}, May {day.num}</span>
              </div>
              <div className={styles.bookingRow}>
                <span className={styles.bookingLabel}>Time</span>
                <span className={styles.bookingValue}>{selectedSlot}</span>
              </div>
              <div className={styles.bookingRow}>
                <span className={styles.bookingLabel}>Patient</span>
                <span className={styles.bookingValue}>{patientName}</span>
              </div>
              <div className={styles.bookingRow}>
                <span className={styles.bookingLabel}>Consultation Fee</span>
                <span className={styles.bookingValue}>₹{doctor.fee}</span>
              </div>
            </div>
          </div>

          <Link to="/" className={styles.homeBtn}>Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/find-care" className={styles.backBtn}>
          <IconArrowLeft size={20} />
        </Link>
        <h1 className={styles.headerTitle}>Book Appointment</h1>
        <p className={styles.headerSub}>OPD consultation scheduling</p>
      </div>

      <div className={styles.body}>
        {/* Doctor Summary */}
        <div className={styles.doctorCard}>
          <div className={styles.doctorAvatar} style={{ background: doctor.imageColor }}>
            {doctor.name.split(" ")[1]?.[0] ?? "D"}
          </div>
          <div>
            <h2 className={styles.doctorName}>{doctor.name}</h2>
            <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
            <p className={styles.doctorMeta}>{doctor.clinicName} · ₹{doctor.fee} fee</p>
          </div>
        </div>

        {/* Date Picker */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            <IconCalendar size={18} color="var(--color-primary)" /> Select Date
          </h3>
          <div className={styles.daysRow}>
            {DAYS.map((day, idx) => (
              <button
                key={idx}
                className={`${styles.dayBtn} ${selectedDay === idx ? styles.selected : ''}`}
                onClick={() => setSelectedDay(idx)}
              >
                <span className={styles.dayName}>{day.name}</span>
                <span className={styles.dayNum}>{day.num}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            <IconClock size={18} color="var(--color-primary)" /> Select Time
          </h3>
          <div className={styles.slotsGrid}>
            {doctor.availableSlots.map((slot) => (
              <button
                key={slot}
                className={`${styles.slotBtn} ${selectedSlot === slot ? styles.selected : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Details */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>👤 Patient Details</h3>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Full Name *</label>
            <input
              type="text"
              placeholder="Enter patient name"
              className={styles.formInput}
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Age</label>
            <input
              type="number"
              placeholder="Age"
              className={styles.formInput}
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
            />
          </div>
        </div>

        <button className={styles.confirmBtn} onClick={confirm} disabled={!canConfirm}>
          Confirm Appointment
        </button>
      </div>
    </div>
  );
}
