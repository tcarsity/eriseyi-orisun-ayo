import { useMemo, useState } from "react";

export const useBirthDate = () => {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(0, i))
    );
  }, []);

  const days = useMemo(() => {
    if (!month) return [];
    const monthIndex = months.indexOf(month);
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [month]);

  return { month, setMonth, day, setDay, months, days };
};
