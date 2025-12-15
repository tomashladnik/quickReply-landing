import { randomUUID } from "crypto";

export type ScanCategory = "all_good" | "needs_attention" | "concern";

export const mockSchools = [
  {
    code: "PS123-DSCAN",
    name: "Parkview Elementary",
    classes: ["Grade 3 - Room 2", "Grade 4 - Room 1"],
  },
  {
    code: "WESTVIEW-SCAN",
    name: "Westview Middle School",
    classes: ["Grade 6 - Room 5", "Grade 7 - Room 1"],
  },
  {
    code: "MHS-TOOTH",
    name: "Mountain High School",
    classes: ["Grade 10 - Room 3", "Grade 11 - Room 4"],
  },
];

export const mockChildren = [
  {
    id: "1",
    name: "Emma Doe",
    school: "Parkview Elementary",
    classroom: "Grade 3 - Room 2",
    latestScanDate: "2024-01-15",
    latestResult: "all_good" as ScanCategory,
    parentEmail: "parent@example.com",
  },
  {
    id: "2",
    name: "Lucas Doe",
    school: "Westview Middle School",
    classroom: "Grade 6 - Room 5",
    latestScanDate: "2024-01-10",
    latestResult: "needs_attention" as ScanCategory,
    parentEmail: "parent@example.com",
  },
];

export const mockHistory: Record<
  string,
  { id: string; date: string; result: ScanCategory }[]
> = {
  "1": [
    { id: "scan-1", date: "2024-01-15", result: "all_good" },
    { id: "scan-2", date: "2023-12-15", result: "all_good" },
    { id: "scan-3", date: "2023-11-15", result: "needs_attention" },
  ],
  "2": [
    { id: "scan-4", date: "2024-01-10", result: "needs_attention" },
    { id: "scan-5", date: "2023-12-01", result: "all_good" },
  ],
};

export const mockDentistSharing: Record<
  string,
  {
    status: "not_shared" | "invite_sent" | "active" | "revoked";
    dentistEmail: string | null;
    dentistName: string | null;
    invitedAt: string | null;
    activatedAt: string | null;
  }
> = {};

export function getChildById(id: string) {
  const child = mockChildren.find((c) => c.id === id);
  if (!child) return null;
  const history = mockHistory[id] ?? [];
  return {
    ...child,
    latestScan: history[0] ?? null,
  };
}

export function upsertDentistInvite(childId: string, dentistEmail: string) {
  mockDentistSharing[childId] = {
    status: "invite_sent",
    dentistEmail,
    dentistName: null,
    invitedAt: new Date().toISOString(),
    activatedAt: null,
  };
  return mockDentistSharing[childId];
}

export function updateDentistShareStatus(
  childId: string,
  status: "active" | "revoked"
) {
  const existing = mockDentistSharing[childId];
  if (!existing) {
    mockDentistSharing[childId] = {
      status,
      dentistEmail: null,
      dentistName: null,
      invitedAt: null,
      activatedAt: status === "active" ? new Date().toISOString() : null,
    };
    return mockDentistSharing[childId];
  }
  mockDentistSharing[childId] = {
    ...existing,
    status,
    activatedAt: status === "active" ? new Date().toISOString() : null,
  };
  return mockDentistSharing[childId];
}

export function newChildRecord({
  name,
  school,
  classroom,
  parentEmail,
}: {
  name: string;
  school: string;
  classroom: string;
  parentEmail: string;
}) {
  const id = randomUUID();
  const child = {
    id,
    name,
    school,
    classroom,
    latestScanDate: null as string | null,
    latestResult: null as ScanCategory | null,
    parentEmail,
  };
  mockChildren.push(child);
  return child;
}


