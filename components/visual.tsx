export function Visual({ kind }: { kind: string }) {
  if (kind === "warehouse" || kind === "property")
    return (
      <div className={`photo-visual ${kind}`}>
        <img
          src={`/images/${kind}.jpg`}
          alt={
            kind === "warehouse"
              ? "An organized distribution warehouse"
              : "Modern building facade in sunlight"
          }
          draggable="false"
        />
        <div className="photo-caption">
          <span>
            WAYLINE / {kind === "warehouse" ? "DISTRIBUTION" : "PROPERTY"}
          </span>
          <strong>
            {kind === "warehouse"
              ? "From order.\nTo onward."
              : "Everything,\naccounted for."}
          </strong>
        </div>
      </div>
    );
  if (kind === "pilot")
    return (
      <div className="pilot-visual">
        <span className="diagram-label">THE FIRST STEP</span>
        <div className="pilot-type">
          One
          <br />
          <em>better</em>
          <br />
          workflow.
        </div>
        <div className="pilot-bottom">
          <span>DISCOVER / DEFINE / DELIVER</span>
          <span>01—03</span>
        </div>
      </div>
    );
  if (kind === "insurance")
    return (
      <div className="insurance-visual">
        <div className="paper paper-back" />
        <div className="paper">
          <span className="paper-brand">WAYLINE / RENEWALS</span>
          <div className="paper-rule" />
          <span className="paper-label">RENEWAL WORKFLOW</span>
          <strong>
            A clear path.
            <br />A human decision.
          </strong>
          <div className="paper-check">
            <i>✓</i> Information collected
          </div>
          <div className="paper-check">
            <i>✓</i> Required fields validated
          </div>
          <div className="paper-check">
            <i>✓</i> Portal work coordinated
          </div>
          <div className="review-stamp">
            READY FOR HUMAN REVIEW<span>LICENSED STAFF STAY IN CONTROL</span>
          </div>
        </div>
        <span className="visual-footnote">
          EXCEPTIONS INCLUDED. PEOPLE IN CONTROL.
        </span>
      </div>
    );
  if (kind === "freight")
    return (
      <div className="freight-visual">
        <span className="diagram-label">DELIVERY → DOCUMENTS → BILLING</span>
        <div className="shipping-label">
          <div className="shipping-heading">
            <span>WAYLINE</span>
            <span>PROOF OF DELIVERY</span>
          </div>
          <strong>DELIVERED.</strong>
          <div className="shipping-line">
            <span>01 / CAPTURE</span>
            <b>Documents received</b>
          </div>
          <div className="shipping-line">
            <span>02 / VERIFY</span>
            <b>Shipment details checked</b>
          </div>
          <div className="shipping-line">
            <span>03 / PREPARE</span>
            <b>Billing packet complete</b>
          </div>
          <div className="barcode" />
          <small>A TRACEABLE PATH TO COMPLETE.</small>
        </div>
      </div>
    );
  return (
    <div className="flow-visual">
      <div className="diagram-top">
        <span>WAYLINE</span>
        <span>
          THE EXECUTION LAYER <i />
        </span>
      </div>
      <div className="flow-intro">
        Different systems.
        <br />
        <em>One continuous flow.</em>
      </div>
      <div className="flow-sources">
        <span>
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 6 9 7 9-7" />
          </svg>
          Email
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7" />
          </svg>
          Documents
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 9h18M7 6h1M10 6h1" />
          </svg>
          Portals
        </span>
      </div>
      <div className="connector-lines">
        <i />
        <i />
        <i />
      </div>
      <div className="flow-engine">
        <div className="engine-symbol">
          W<span>↗</span>
        </div>
        <div>
          <strong>Orchestrated. Not improvised.</strong>
          <span>CAPTURE · VALIDATE · EXECUTE</span>
        </div>
        <span className="engine-pulse" />
      </div>
      <div className="flow-outcomes">
        <span>
          <i>✓</i> Completed work
        </span>
        <span>
          <i>↗</i> Human review
        </span>
      </div>
      <div className="diagram-bottom">
        <span>VISIBLE. AUDITABLE. RECOVERABLE.</span>
        <span>BUILT AROUND YOUR STACK</span>
      </div>
    </div>
  );
}
