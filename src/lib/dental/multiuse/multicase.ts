/**
 * Multi-Use Case Logic for Dental Scans
 * 
 * Handles flow-specific routing, simplified status derivation, and consent management
 * for gym, school, and charity use cases.
 */

export type FlowType = "gym" | "school" | "charity";

export type SimplifiedStatus =
  | "Healthy"
  | "Needs Attention"
  | "Concern"
  | "Low"
  | "Medium"
  | "High";

export type ConsentMethod = "school" | "parent";

export type MinorUiVariant =
  | "BLOCK_NO_CONSENT"
  | "MINIMAL_PARENT_ROUTING"
  | "SHOW_SIMPLIFIED_ONLY"
  | "ADULT_FULL";

export interface RoutingInput {
  flowType: FlowType;
  isMinor: boolean;
  consentMethod?: ConsentMethod;
  hasSchoolConsentOnFile?: boolean;
}

export interface RoutingDecision {
  uiVariant: MinorUiVariant;
  deliverFullReportTo: "parent" | "school" | "none";
  allowPathologyInUi: boolean;
}

/**
 * Derive simplified status for school flow
 * Maps ML results to: Healthy / Needs Attention / Concern
 */
export function deriveSchoolSimplifiedStatus(mlJson: any): SimplifiedStatus {
  const overall = String(mlJson.overall_status || "").toLowerCase();
  
  if (overall.includes("high") || overall.includes("severe")) {
    return "Concern";
  }
  
  if (overall.includes("moderate") || overall.includes("attention")) {
    return "Needs Attention";
  }
  
  if (overall.includes("healthy") || overall.includes("normal")) {
    return "Healthy";
  }
  
  // fallback
  return "Needs Attention";
}

/**
 * Derive charity care priority score
 * Maps severity to: Low / Medium / High
 */
export function deriveCharityCarePriority(mlJson: any): SimplifiedStatus {
  const severity = String(mlJson.overall_status || "").toLowerCase();
  
  if (severity.includes("high") || severity.includes("severe")) {
    return "High";
  }
  
  if (severity.includes("moderate")) {
    return "Medium";
  }
  
  return "Low";
}

/**
 * Decide routing for minors based on consent method
 * Enforces strict rules: minors never see pathology in UI
 */
export function decideMinorRouting(input: RoutingInput): RoutingDecision {
  const {
    flowType,
    isMinor,
    consentMethod = "parent",
    hasSchoolConsentOnFile = false,
  } = input;

  // Adults
  if (!isMinor) {
    return {
      uiVariant: "ADULT_FULL",
      deliverFullReportTo: flowType === "charity" ? "school" : "none",
      allowPathologyInUi: true,
    };
  }

  // Minors – never pathology in UI
  if (consentMethod === "school") {
    if (!hasSchoolConsentOnFile) {
      return {
        uiVariant: "BLOCK_NO_CONSENT",
        deliverFullReportTo: "none",
        allowPathologyInUi: false,
      };
    }

    return {
      uiVariant: "SHOW_SIMPLIFIED_ONLY",
      deliverFullReportTo: "school",
      allowPathologyInUi: false,
    };
  }

  // Parent route (or default)
  return {
    uiVariant: "MINIMAL_PARENT_ROUTING",
    deliverFullReportTo: "parent",
    allowPathologyInUi: false,
  };
}

