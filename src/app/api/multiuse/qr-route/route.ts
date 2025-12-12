import { NextRequest, NextResponse } from "next/server";

/**
 * QR Routing Logic for Dental Scan Multi-Use Case Flow
 *
 * Detects flow type (gym/school/charity) from QR parameters
 * Routes user to correct template based on flow
 * Applies output filtering rules per flow type
 *
 * Expected Query Parameters:
 * - flow: "gym" | "school" | "charity"
 * - scanId: string (optional)
 * - school_level: "elementary" | "middle" | "high" (for school flow)
 * - consent_method: "school" | "parent" (for school flow)
 * - parent_contact: string (email or phone, for school flow)
 */

type FlowType = "gym" | "school" | "charity";
type SchoolLevel = "elementary" | "middle" | "high";
type ConsentMethod = "school" | "parent";

/**
 * GET /api/multiuse/qr-route
 *
 * Routes user based on QR parameters and returns appropriate template/config
 * Also supports redirect=1 to send user to the appropriate details page.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const flow = searchParams.get("flow") as FlowType | null;
    const scanId = searchParams.get("scanId") || undefined;
    const schoolLevel = searchParams.get("school_level") as SchoolLevel | null;
    const consentMethod = searchParams.get("consent_method") as ConsentMethod | null;
    const parentContact = searchParams.get("parent_contact") || undefined;

    // Validate flow parameter
    if (!flow || !["gym", "school", "charity"].includes(flow)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid or missing flow parameter. Must be 'gym', 'school', or 'charity'.",
        },
        { status: 400 }
      );
    }

    // Validate school-specific parameters if flow is school
    if (flow === "school") {
      if (!schoolLevel || !["elementary", "middle", "high"].includes(schoolLevel)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "school_level is required for school flow. Must be 'elementary', 'middle', or 'high'.",
          },
          { status: 400 }
        );
      }

      if (!consentMethod || !["school", "parent"].includes(consentMethod)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "consent_method is required for school flow. Must be 'school' or 'parent'.",
          },
          { status: 400 }
        );
      }

      if (consentMethod === "parent" && !parentContact) {
        return NextResponse.json(
          {
            success: false,
            error:
              "parent_contact is required when consent_method is 'parent'.",
          },
          { status: 400 }
        );
      }
    }

    // Build a simple scanRecord object for the response (no DB)
    let scanRecord:
      | {
          id: string;
          flowType: FlowType;
          schoolLevel: SchoolLevel | null;
          consentMethod: ConsentMethod | null;
          minorProtected: boolean | null;
        }
      | null = null;

    if (scanId) {
      scanRecord = {
        id: scanId,
        flowType: flow,
        schoolLevel: schoolLevel || null,
        consentMethod: consentMethod || null,
        minorProtected: flow === "school" ? true : null,
      };
    }

    // Determine routing and filtering rules based on flow
    const routingConfig = getRoutingConfig(flow, {
      schoolLevel: schoolLevel || undefined,
      consentMethod: consentMethod || undefined,
      parentContact,
    });

    // If redirect=1 is present, send to the unified registration page
    const redirectFlag = searchParams.get("redirect");
    if (redirectFlag === "1" && scanId) {
      // Use the unified registration page for all flow types
      const redirectUrl = new URL("/multiusecase/register", request.nextUrl.origin);
      redirectUrl.searchParams.set("scanId", scanId);
      redirectUrl.searchParams.set("flowType", flow);
      
      // Add school-specific parameters if present
      if (flow === "school") {
        if (schoolLevel) redirectUrl.searchParams.set("school_level", schoolLevel);
        if (consentMethod) redirectUrl.searchParams.set("consent_method", consentMethod);
        if (parentContact) redirectUrl.searchParams.set("parent_contact", parentContact);
      }

      return NextResponse.redirect(redirectUrl);
    }

    // Default JSON response (useful for debugging / API calls)
    return NextResponse.json(
      {
        success: true,
        flow,
        scanId: scanRecord?.id || scanId,
        routing: routingConfig,
        scanRecord: scanRecord
          ? {
              id: scanRecord.id,
              flowType: scanRecord.flowType,
              schoolLevel: scanRecord.schoolLevel,
              consentMethod: scanRecord.consentMethod,
              minorProtected: scanRecord.minorProtected,
            }
          : null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("QR routing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "An unexpected error occurred while routing.",
      },
      { status: 500 }
    );
  }
}

/**
 * Get routing configuration based on flow type
 */
function getRoutingConfig(
  flow: FlowType,
  schoolParams?: {
    schoolLevel?: SchoolLevel;
    consentMethod?: ConsentMethod;
    parentContact?: string;
  }
) {
  switch (flow) {
    case "gym":
      return {
        template: "gym-whitening",
        showPathology: false,
        showWhitening: true,
        showSimplifiedStatus: false,
        showPriorityScore: false,
        allowedViews: ["whitening", "brightness", "shade"],
        filteringRules: {
          hidePathology: true,
          hideDetailedResults: true,
          showOnlyWhitening: true,
        },
      };

    case "school":
      const isElementary = schoolParams?.schoolLevel === "elementary";
      return {
        template: `school-${schoolParams?.schoolLevel || "default"}`,
        showPathology: false,
        showWhitening: false,
        showSimplifiedStatus: true,
        showPriorityScore: false,
        ageAppropriateUI: isElementary,
        consentMethod: schoolParams?.consentMethod,
        parentContact: schoolParams?.parentContact,
        allowedViews: ["simplified_status"],
        filteringRules: {
          hidePathology: true,
          hideWhitening: true,
          hideDetailedResults: true,
          showOnlySimplifiedStatus: true,
          ageAppropriateLanguage: isElementary,
        },
      };

    case "charity":
      return {
        template: "charity-priority",
        showPathology: false,
        showWhitening: false,
        showSimplifiedStatus: false,
        showPriorityScore: true,
        allowedViews: ["priority_score"],
        filteringRules: {
          hidePathology: true,
          hideWhitening: true,
          hideDetailedResults: true,
          showOnlyPriorityScore: true,
        },
      };

    default:
      throw new Error(`Unknown flow type: ${flow}`);
  }
}

/**
 * POST /api/multiuse/qr-route
 *
 * Update scan record with flow information and routing preferences.
 * For now, this does NOT touch the database – it just echoes back the data.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      scanId,
      flow,
      school_level,
      consent_method,
      parent_contact,
      brightness_score,
      shade_value,
      ideal_shade,
      simplified_status,
      clinic_recommended,
      original_json,
    } = body;

    if (!scanId) {
      return NextResponse.json(
        {
          success: false,
          error: "scanId is required.",
        },
        { status: 400 }
      );
    }

    if (!flow || !["gym", "school", "charity"].includes(flow)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "flow is required and must be 'gym', 'school', or 'charity'.",
        },
        { status: 400 }
      );
    }

    const scanRecord = {
      id: scanId as string,
      flowType: flow as FlowType,
      schoolLevel: (school_level as SchoolLevel | undefined) ?? null,
      consentMethod: (consent_method as ConsentMethod | undefined) ?? null,
      parentContact: (parent_contact as string | undefined) ?? null,
      brightnessScore: brightness_score ?? null,
      shadeValue: shade_value ?? null,
      idealShade: ideal_shade ?? null,
      simplifiedStatus: simplified_status ?? null,
      clinicRecommended: clinic_recommended ?? null,
      originalJson: original_json ?? null,
    };

    return NextResponse.json(
      {
        success: true,
        scan: scanRecord,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("QR route POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
