const records = {
  "CF4F335ADD91642D": {
    documentTitle: "Official Character Preparation Remarks",
    documentReference: "DOC-REF/BJ/20260815/ANKSHAW",
    issuedTo: "Mr. Ankush Shaw",
    character: "Biddut Jalil",
    issuedBy: "Direction and Production Authority",
    dateOfIssue: "15 August 2026",
    status: "Authenticated — Final"
  }
};

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const code = String(body.code || "").trim().toUpperCase();

    if (!code || !records[code]) {
      return Response.json({ valid: false }, { status: 404 });
    }

    return Response.json({
      valid: true,
      record: records[code]
    });
  } catch {
    return Response.json(
      { valid: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
