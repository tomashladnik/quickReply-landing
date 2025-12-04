/**
 * Dental Scan Result Filtering Utilities
 * 
 * Applies flow-specific filtering rules to scan results:
 * - Gym: Whitening only (no pathology)
 * - School: Simplified status only (no pathology, no whitening)
 * - Charity: Priority score only (no pathology, no whitening)
 * - Partners: Full pathology access
 */

export type FlowType = "gym" | "school" | "charity" | "partner";

export type SchoolLevel = "elementary" | "middle" | "high";

export interface FilteredScanResult {
  // Whitening data (gym flow only)
  whitening?: {
    brightnessScore: number | null;
    shadeValue: string | null;
    idealShade: string | null;
  } | null;
  
  // Pathology data (partner access only)
  pathology?: any | null;
  
  // Simplified status (school flow only)
  simplifiedStatus?: string | null;
  
  // Priority score (charity flow only)
  priorityScore?: number | null;
  
  // Clinic recommendations
  clinicRecommended?: boolean | null;
  
  // Metadata
  metadata?: {
    flowType?: string | null;
    schoolLevel?: string | null;
    consentMethod?: string | null;
    minorProtected?: boolean | null;
    createdAt?: Date | null;
    completedAt?: Date | null;
  };
  
  // Messages
  message?: string;
}

/**
 * Filter scan results based on flow type and access level
 */
export function filterResultsByFlow(
  scan: any,
  flow: FlowType,
  hasPartnerAccess: boolean = false
): FilteredScanResult {
  // Partners get full access to everything
  if (hasPartnerAccess) {
    return {
      pathology: extractPathology(scan.originalJson || scan.resultJson),
      whitening: {
        brightnessScore: scan.brightnessScore ? Number(scan.brightnessScore) : null,
        shadeValue: scan.shadeValue,
        idealShade: scan.idealShade,
      },
      simplifiedStatus: scan.simplifiedStatus,
      priorityScore: extractPriorityScore(scan.originalJson || scan.resultJson),
      clinicRecommended: scan.clinicRecommended,
      metadata: {
        flowType: scan.flowType,
        schoolLevel: scan.schoolLevel,
        consentMethod: scan.consentMethod,
        minorProtected: scan.minorProtected,
        createdAt: scan.createdAt,
        completedAt: scan.completedAt,
      },
    };
  }

  // Apply flow-specific filtering
  switch (flow) {
    case "gym":
      return {
        whitening: {
          brightnessScore: scan.brightnessScore !== null && scan.brightnessScore !== undefined 
            ? Number(scan.brightnessScore) 
            : null,
          shadeValue: scan.shadeValue || null,
          idealShade: scan.idealShade || null,
        },
        pathology: null,
        simplifiedStatus: null,
        priorityScore: null,
        message: "Gym flow: Showing whitening information only.",
      };

    case "school":
      return {
        simplifiedStatus: scan.simplifiedStatus || null,
        message: getAgeAppropriateMessage(scan.schoolLevel || "elementary"),
        pathology: null,
        whitening: null,
        priorityScore: null,
        metadata: {
          schoolLevel: scan.schoolLevel || null,
          consentMethod: scan.consentMethod || null,
        },
      };

    case "charity":
      return {
        priorityScore: extractPriorityScore(scan.originalJson || scan.resultJson),
        message: "Charity flow: Showing priority score only.",
        pathology: null,
        whitening: null,
        simplifiedStatus: null,
      };

    default:
      return {
        message: "Limited access: Contact clinic for full results.",
        pathology: null,
        whitening: null,
        simplifiedStatus: null,
        priorityScore: null,
      };
  }
}

/**
 * Extract pathology data from JSON
 */
function extractPathology(json: any): any | null {
  if (!json || typeof json !== "object") return null;
  
  return {
    findings: json.findings || [],
    confidenceScores: json.confidenceScores || {},
    recommendations: json.recommendations || [],
    detailedAnalysis: json.detailedAnalysis || null,
  };
}

/**
 * Extract priority score from JSON
 */
function extractPriorityScore(json: any): number | null {
  if (!json || typeof json !== "object") return null;
  
  return (
    json.priorityScore ||
    json.priority_score ||
    json.priority ||
    json.urgencyScore ||
    json.urgency_score ||
    null
  );
}

/**
 * Get age-appropriate message for school flow
 */
function getAgeAppropriateMessage(schoolLevel: string): string {
  const messages: Record<string, string> = {
    elementary: "Your smile looks great! Keep brushing your teeth every day! 😊",
    middle: "Your dental scan shows good oral health. Continue your daily dental care routine.",
    high: "Your scan results indicate healthy teeth. Maintain regular dental hygiene practices.",
  };
  
  return messages[schoolLevel] || messages.elementary;
}

/**
 * Validate flow type
 */
export function isValidFlowType(flow: string): flow is FlowType {
  return ["gym", "school", "charity", "partner"].includes(flow);
}

/**
 * Check if user role has partner access
 */
export function hasPartnerAccess(role: string): boolean {
  return ["nurse", "parent", "nonprofit", "clinic"].includes(role.toLowerCase());
}

