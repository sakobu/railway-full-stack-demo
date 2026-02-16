export function GuidePanel() {
  return (
    <>
      <h1>Create Account</h1>
      <details className="guide" open>
        <summary>What to try</summary>
        <dl className="guide-list">
          <div>
            <dt>Submit empty</dt>
            <dd>Schema errors appear on every field</dd>
          </div>
          <div>
            <dt>Username "admin"</dt>
            <dd>Async field validation - "already taken"</dd>
          </div>
          <div>
            <dt>Mismatched passwords</dt>
            <dd>Cross-field error on confirm password</dd>
          </div>
          <div>
            <dt>Email taken@example.com</dt>
            <dd>Server 422 - error mapped to email field</dd>
          </div>
          <div>
            <dt>Valid submit</dt>
            <dd>Same schema validates server-side</dd>
          </div>
        </dl>
      </details>
    </>
  );
}
