export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const code = String(body.code || "").trim().toUpperCase();

    if (!code) {
      return Response.json({ valid: false }, { status: 400 });
    }

    const result = await context.env.DB
      .prepare(`
        SELECT
          code,
          document_title,
          document_reference,
          holder_name,
          character_name,
          issued_by,
          issue_date,
          status
        FROM documents
        WHERE code = ?
        LIMIT 1
      `)
      .bind(code)
      .first();

    if (!result) {
      return Response.json({ valid: false }, { status: 404 });
    }

    return Response.json({
      valid: true,
      record: {
        documentTitle: result.document_title,
        documentReference: result.document_reference,
        issuedTo: result.holder_name,
        character: result.character_name,
        issuedBy: result.issued_by,
        dateOfIssue: result.issue_date,
        status: result.status
      }
    });

  } catch (error) {
    return Response.json(
      {
        valid: false,
        error: "Verification service error"
      },
      { status: 500 }
    );
  }
}
