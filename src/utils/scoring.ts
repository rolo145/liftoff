import type {
  Category, LeaderboardEntry, Result, Team,
} from "@/types";

export const CATEGORY_LABELS: Record<string, string> = {
  men: "Men + Men",
  women: "Women + Women",
};

export const parseWodTimeToSeconds = (input?: string | null): number | null => {
  if (!input) { return null; }
  const parts = input
    .split(":")
    .map((part) => Number.parseFloat(part.trim()))
    .filter((value) => !Number.isNaN(value));

  if (!parts.length) { return null; }

  if (parts.length === 3) {
    const [hours = 0, minutes = 0, seconds = 0] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    const [minutes = 0, seconds = 0] = parts;
    return minutes * 60 + seconds;
  }

  return parts[0] ?? null;
};

export const formatSecondsToTime = (value?: number | null): string | null => {
  if (value === undefined || value === null || Number.isNaN(value)) { return null; }
  const minutes = Math.floor(value / 60);
  const seconds = Math.round(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const applyEventRanking = (
  entries: LeaderboardEntry[],
  accessor: (entry: LeaderboardEntry) => number,
  direction: "asc" | "desc",
) => {
  const scored = [...entries].sort((a, b) => {
    const valueA = accessor(a);
    const valueB = accessor(b);
    return direction === "desc" ? valueB - valueA : valueA - valueB;
  });
  scored.forEach((entry, index) => {
    entry.totalPoints += index + 1;
  });
};

export const computeLeaderboardByCategory = (
  teams: Team[],
  results: Result[],
): Record<Category, LeaderboardEntry[]> => {
  const grouped: Record<Category, LeaderboardEntry[]> = {
    men: [],
    women: [],
  };

  teams.forEach((team) => {
    const record = results.find((result) => result.teamId === team.id);
    const snatchAthlete1 = record?.snatchAthlete1 ?? 0;
    const snatchAthlete2 = record?.snatchAthlete2 ?? 0;
    const cleanAthlete1 = record?.cleanAthlete1 ?? 0;
    const cleanAthlete2 = record?.cleanAthlete2 ?? 0;
    const snatchTotal = snatchAthlete1 + snatchAthlete2;
    const cleanTotal = cleanAthlete1 + cleanAthlete2;
    const wodSeconds = parseWodTimeToSeconds(record?.wodTime);

    const entry: LeaderboardEntry = {
      teamId: team.id,
      teamName: `${team.athlete1} & ${team.athlete2}`,
      category: team.category,
      categoryLabel: CATEGORY_LABELS[team.category] ?? team.category,
      athletes: [team.athlete1, team.athlete2],
      snatchTotal,
      snatchAthlete1,
      snatchAthlete2,
      cleanTotal,
      cleanAthlete1,
      cleanAthlete2,
      wodSeconds,
      totalPoints: 0,
      rank: 0,
    };

    grouped[team.category]?.push(entry);
  });

  (Object.keys(grouped) as Category[]).forEach((category) => {
    const entries = grouped[category];
    if (!entries.length) { return; }

    applyEventRanking(entries, (entry) => entry.snatchTotal, "desc");
    applyEventRanking(entries, (entry) => entry.cleanTotal, "desc");
    applyEventRanking(
      entries,
      (entry) => (entry.wodSeconds ?? Number.POSITIVE_INFINITY),
      "asc",
    );

    entries
      .sort((a, b) => {
        if (a.totalPoints !== b.totalPoints) {
          return a.totalPoints - b.totalPoints;
        }
        if (a.snatchTotal !== b.snatchTotal) {
          return b.snatchTotal - a.snatchTotal;
        }
        if (a.cleanTotal !== b.cleanTotal) {
          return b.cleanTotal - a.cleanTotal;
        }
        if (a.wodSeconds === null) { return 1; }
        if (b.wodSeconds === null) { return -1; }
        return a.wodSeconds - b.wodSeconds;
      })
      .forEach((entry, index) => {
        entry.rank = index + 1;
      });
  });

  return grouped;
};
