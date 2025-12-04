import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
 * GET /api/dental-scan/qr-route
 * 
 * Routes user based on QR parameters and returns appropriate template/config
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
          error: "Invalid or missing flow parameter. Must be 'gym', 'school', or 'charity'.",
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
            error: "school_level is required for school flow. Must be 'elementary', 'middle', or 'high'.",
          },
          { status: 400 }
        );
      }

      if (!consentMethod || !["school", "parent"].includes(consentMethod)) {
        return NextResponse.json(
          {
            success: false,
            error: "consent_method is required for school flow. Must be 'school' or 'parent'.",
          },
          { status: 400 }
        );
      }

      if (consentMethod === "parent" && !parentContact) {
        return NextResponse.json(
          {
            success: false,
            error: "parent_contact is required when consent_method is 'parent'.",
          },
          { status: 400 }
        );
      }
    }

    // Create or update scan record if scanId is provided
    let scanRecord = null;
    if (scanId) {
      scanRecord = await (prisma as any).scan.upsert({
        where: { id: scanId },
        update: {
          flowType: flow,
          schoolLevel: schoolLevel || null,
          consentMethod: consentMethod || null,
          parentContact: parentContact || null,
          minorProtected: flow === "school" ? true : null,
          updatedAt: new Date(),
        },
        create: {
          id: scanId,
          demoScanId: scanId,
          flowType: flow,
          schoolLevel: schoolLevel || null,
          consentMethod: consentMethod || null,
          parentContact: parentContact || null,
          minorProtected: flow === "school" ? true : false,
          reportDeliveryStatus: "pending",
          status: "pending",
        },
      });
    }

    // Determine routing and filtering rules based on flow
    const routingConfig = getRoutingConfig(flow, {
      schoolLevel: schoolLevel || undefined,
      consentMethod: consentMethod || undefined,
      parentContact,
    });

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
 * POST /api/dental-scan/qr-route
 * 
 * Update scan record with flow information and routing preferences
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
          error: "flow is required and must be 'gym', 'school', or 'charity'.",
        },
        { status: 400 }
      );
    }

    // Build update data object
    const updateData: any = {
      flowType: flow,
      updatedAt: new Date(),
    };

    // Add flow-specific fields
    if (flow === "school") {
      if (school_level) updateData.schoolLevel = school_level;
      if (consent_method) updateData.consentMethod = consent_method;
      if (parent_contact) updateData.parentContact = parent_contact;
      updateData.minorProtected = true;
    }

    // Add common fields if provided
    if (brightness_score !== undefined) updateData.brightnessScore = brightness_score;
    if (shade_value !== undefined) updateData.shadeValue = shade_value;
    if (ideal_shade !== undefined) updateData.idealShade = ideal_shade;
    if (simplified_status !== undefined) updateData.simplifiedStatus = simplified_status;
    if (clinic_recommended !== undefined) updateData.clinicRecommended = clinic_recommended;
    if (original_json !== undefined) updateData.originalJson = original_json;

    // Update or create scan record
    const scanRecord = await (prisma as any).scan.upsert({
      where: { id: scanId },
      update: updateData,
      create: {
        id: scanId,
        demoScanId: scanId,
        ...updateData,
        status: "pending",
        reportDeliveryStatus: "pending",
      },
    });

    return NextResponse.json(
      {
        success: true,
        scan: {
          id: scanRecord.id,
          flowType: scanRecord.flowType,
          schoolLevel: scanRecord.schoolLevel,
          consentMethod: scanRecord.consentMethod,
          brightnessScore: scanRecord.brightnessScore,
          shadeValue: scanRecord.shadeValue,
          simplifiedStatus: scanRecord.simplifiedStatus,
          clinicRecommended: scanRecord.clinicRecommended,
        },
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

