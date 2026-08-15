export async function onRequestPost(context) {
  try {
    const auth = context.request.headers.get("Authorization") || "";
    const expected = `Bearer ${context.env.ADMIN_SECRET}`;

    if (auth !== expected) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await context.request.json();

    const code = String(body.code || "").trim().toUpperCase();
    const documentTitle = String(body.documentTitle || "").trim();
    const documentReference = String(body.documentReference || "").trim();
    const holderName = String(body.holderName || "").trim();
    const characterName = String(body.characterName || "").trim();
    const issuedBy = String(body.issuedBy || "").trim();
    const issueDate = String(body.issueDate || "").trim();
    const status = String(body.status || "").trim();

    if (
      !code ||
      !documentTitle ||
      !documentReference ||
      !holderName ||
      !characterName ||
      !issuedBy ||
      !issueDate ||
      !status
    ) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await context.env.DB
      .prepare(`
        INSERT INTO documents
        (code, document_title, document_reference, holder_name,
         character_name, issued_by, issue_date, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `)
      .bind(
        code,
        documentTitle,
        documentReference,
        holderName,
        characterName,
        issuedBy,
        issueDate,
        status
      )
      .run();

    return Response.json({
      success: true,
      message: "Document added successfully"
    });

  } catch (error) {
    return Response.json(
      { success: false, error: "Could not add document" },
      { status: 500 }
    );
  }
}
