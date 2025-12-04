import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  filterResultsByFlow,
  hasPartnerAccess,
  isValidFlowType,
} from "@/lib/dental/multiuse/filtering";

/**
 * Filtered Results API for Dental Scan Multi-Use Case Flow
 * 
 * Returns scan results filtered based on flow type:
 * - Gym: Whitening only (no pathology)
 * - School: Simplified status only (no pathology, no whitening)
 * - Charity: Priority score only (no pathology, no whitening)
 * - Partners (nurse/parent/nonprofit): Full pathology
 */

type FlowType = "gym" | "school" | "charity" | "partner";

/**
 * GET /api/dental-scan/results
 * 
 * Get filtered scan results based on flow type and scanId
 * 
 * Query Parameters:
 * - scanId: string (required)
 * - flow: "gym" | "school" | "charity" | "partner" (optional, defaults to scan record flow)
 * - role: "patient" | "nurse" | "parent" | "nonprofit" | "clinic" (for partner access)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scanId = searchParams.get("scanId");
    const flow = searchParams.get("flow") as FlowType | null;
    const role = searchParams.get("role") || "patient";

    if (!scanId) {
      return NextResponse.json(
        {
          success: false,
          error: "scanId is required.",
        },
        { status: 400 }
      );
    }

    // Fetch scan record
    const scan = await (prisma as any).scan.findUnique({
      where: { id: scanId },
    });

    if (!scan) {
      return NextResponse.json(
        {
          success: false,
          error: "Scan not found.",
        },
        { status: 404 }
      );
    }

    // Determine flow type (use provided flow or scan's flow type)
    const effectiveFlow: FlowType =
      flow && isValidFlowType(flow)
        ? flow
        : isValidFlowType(scan.flowType || "")
        ? (scan.flowType as FlowType)
        : "partner";

    // Check if user has partner access (full pathology)
    const userHasPartnerAccess =
      effectiveFlow === "partner" || hasPartnerAccess(role);

    // Apply filtering based on flow type
    const filteredResult = filterResultsByFlow(
      scan,
      effectiveFlow,
      userHasPartnerAccess
    );

    return NextResponse.json(
      {
        success: true,
        scanId: scan.id,
        flow: effectiveFlow,
        role,
        hasFullAccess: userHasPartnerAccess,
        result: filteredResult,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get scan results error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}

