const LLCDataAgreementPage = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Data Processing Agreement (DPA)
      </h1>
      <p className="text-sm text-gray-500">Last Updated: December 3, 2025</p>

      <div className="mt-8">
        <p>
          This Data Processing Agreement (&quot;Agreement&quot; or &quot;DPA&quot;) forms part of the Terms and Conditions and governs how ReplyQuick LLC (&quot;ReplyQuick&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) processes personal data on behalf of its customers (&quot;Customer&quot;, &quot;you&quot;, &quot;your&quot;) in connection with ReplyQuick services.
        </p>
        <p className="mt-4">
          This DPA is designed to satisfy the requirements of:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>HIPAA (U.S. Health Insurance Portability and Accountability Act)</li>
          <li>GDPR (EU General Data Protection Regulation, Article 28)</li>
          <li>CCPA/CPRA (California Consumer Privacy Act)</li>
          <li>PIPEDA/PHIPA (Canada)</li>
          <li>LGPD (Brazil)</li>
          <li>Other applicable international privacy laws</li>
        </ul>
        <p className="mt-4">
          If you do not agree to this DPA, you must cease using ReplyQuick services.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          1. Definitions
        </h2>

        <h3 className="mt-6 text-xl font-bold text-gray-900">
          &quot;Personal Data&quot;
        </h3>
        <p>
          Any information relating to an identified or identifiable natural person, including names, phone numbers, email addresses, images, device data, usage logs, audio, or other identifiers.
        </p>

        <h3 className="mt-6 text-xl font-bold text-gray-900">
          &quot;Processing&quot;
        </h3>
        <p>
          Any operation performed on personal data, including collection, storage, transmission, analysis, or deletion.
        </p>

        <h3 className="mt-6 text-xl font-bold text-gray-900">
          &quot;Controller&quot;
        </h3>
        <p>
          The party determining the purpose and means of processing personal data (generally the Customer).
        </p>

        <h3 className="mt-6 text-xl font-bold text-gray-900">
          &quot;Processor&quot;
        </h3>
        <p>
          The party processing personal data on behalf of the Controller (ReplyQuick).
        </p>

        <h3 className="mt-6 text-xl font-bold text-gray-900">
          &quot;Sub-Processor&quot;
        </h3>
        <p>
          Any third party appointed by ReplyQuick to process personal data.
        </p>

        <h3 className="mt-6 text-xl font-bold text-gray-900">
          &quot;Data Protection Laws&quot;
        </h3>
        <p>
          All applicable state, federal, and international privacy laws, including HIPAA, GDPR, CCPA/CPRA, LGPD, PIPEDA, and others.
        </p>

        <h3 className="mt-6 text-xl font-bold text-gray-900">
          &quot;Services&quot;
        </h3>
        <p>
          The ReplyQuick platform, telephony system, AI analysis, messaging features, dashboards, and any related tools or APIs provided to the Customer.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          2. Roles of the Parties
        </h2>
        <ol className="list-decimal pl-6 space-y-2 mt-4">
          <li>Customer is the Data Controller.</li>
          <li>ReplyQuick is the Data Processor.</li>
          <li>For HIPAA-covered entities, ReplyQuick is a Business Associate.</li>
          <li>Sub-processors engaged by ReplyQuick act as Sub-Processors.</li>
        </ol>
        <p className="mt-4">
          ReplyQuick processes personal data solely on documented instructions from the Customer.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          3. Purpose of Processing
        </h2>
        <p>
          ReplyQuick processes personal data only as necessary to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Provide telephony, AI inference, and messaging services</li>
          <li>Deliver missed-call automation and call/text handling</li>
          <li>Run AI-powered scan analysis and reporting</li>
          <li>Manage user accounts and subscriptions</li>
          <li>Maintain system logs, security, and auditing</li>
          <li>Provide support and troubleshooting</li>
          <li>Execute workflows configured by the Customer</li>
          <li>Comply with legal or regulatory requirements</li>
        </ul>
        <p className="mt-4">
          ReplyQuick does not process data for marketing or unrelated purposes.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          4. Customer Instructions
        </h2>
        <p>
          ReplyQuick will process personal data only:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>In accordance with this DPA</li>
          <li>Under Customer instructions</li>
          <li>As required to provide the services</li>
          <li>As required by applicable law</li>
        </ul>
        <p className="mt-4">
          If an instruction violates applicable law, ReplyQuick will notify Customer.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          5. Security Measures
        </h2>
        <p>
          ReplyQuick maintains industry-standard technical and organizational safeguards, including:
        </p>

        <h3 className="mt-6 text-xl font-bold text-gray-900">
          Technical Controls
        </h3>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Encryption in transit (TLS 1.2+) and at rest (AES-256)</li>
          <li>Access controls and role-based permissions</li>
          <li>Secure APIs</li>
          <li>Application firewalls</li>
          <li>Automatic session expiration</li>
          <li>Data redundancy and backups</li>
        </ul>

        <h3 className="mt-6 text-xl font-bold text-gray-900">
          Organizational Controls
        </h3>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Security training for authorized personnel</li>
          <li>Strict access logging</li>
          <li>Multi-factor authentication</li>
          <li>Least-privilege access principles</li>
        </ul>

        <h3 className="mt-6 text-xl font-bold text-gray-900">
          Infrastructure Controls
        </h3>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Secure hosting and physical security via AWS</li>
          <li>Monitoring, logging, and alerting</li>
          <li>Regular penetration testing and vulnerability scanning</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          6. Confidentiality
        </h2>
        <p>
          ReplyQuick ensures that all personnel with access to personal data:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Are authorized</li>
          <li>Are contractually bound to confidentiality</li>
          <li>Receive training on secure handling and privacy laws</li>
          <li>Only access data when necessary</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          7. Sub-Processors
        </h2>
        <p>
          ReplyQuick may engage sub-processors to support service delivery.
        </p>
        <p className="mt-4">
          A current list of sub-processors is maintained at:
        </p>
        <p className="mt-4">
          <a
            href="https://replyquick.ai/subprocessors"
            className="text-blue-600 hover:underline"
          >
            replyquick.ai/subprocessors
          </a>
        </p>
        <p className="mt-4">
          ReplyQuick will:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Notify customers of changes where legally required</li>
          <li>Ensure sub-processors provide equal or greater security</li>
          <li>Enter into binding contracts with each sub-processor</li>
          <li>Remain responsible for their performance</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          8. International Data Transfers
        </h2>
        <p>
          ReplyQuick may transfer data internationally where necessary.
        </p>
        <p className="mt-4">
          All transfers comply with applicable laws, using:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Standard Contractual Clauses (SCCs)</li>
          <li>Adequacy decisions</li>
          <li>HIPAA Business Associate requirements</li>
          <li>LGPD-compliant mechanisms</li>
        </ul>
        <p className="mt-4">
          Sub-processors must maintain equivalent protections.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          9. Data Subject Rights
        </h2>
        <p>
          Where applicable, ReplyQuick will assist Customers in responding to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Access requests</li>
          <li>Correction requests</li>
          <li>Deletion requests</li>
          <li>Restriction or objection requests</li>
          <li>Data portability</li>
        </ul>
        <p className="mt-4">
          ReplyQuick does not respond directly to end-users unless instructed by Customer.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          10. Data Breach Notification
        </h2>
        <p>
          If ReplyQuick becomes aware of a breach affecting personal data, we will notify Customer without undue delay, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Nature of the breach</li>
          <li>Data categories and approximate volume affected</li>
          <li>Likely consequences</li>
          <li>Mitigation and corrective actions</li>
          <li>Contact information for further support</li>
        </ul>
        <p className="mt-4">
          Customer remains responsible for any required notifications to individuals or regulators, except where laws require ReplyQuick to notify directly.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          11. Return or Deletion of Data
        </h2>
        <p>
          Upon termination of services:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mt-4">
          <li>Customer may request data export.</li>
          <li>Customer may request deletion of data.</li>
          <li>ReplyQuick will delete remaining personal data after retention obligations expire.</li>
          <li>
            ReplyQuick may retain minimal records for:
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Compliance</li>
              <li>Security logs</li>
              <li>Legal defense</li>
            </ul>
          </li>
        </ol>
        <p className="mt-4">
          HIPAA and state retention laws may require data retention for 7 years.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          12. Compliance with HIPAA (Business Associate Addendum)
        </h2>
        <p>
          If Customer is a HIPAA Covered Entity or Business Associate:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>This DPA incorporates ReplyQuick&apos;s Business Associate Addendum (BAA)</li>
          <li>ReplyQuick will comply with all HIPAA/HITECH requirements</li>
          <li>PHI will be protected in accordance with HIPAA security rules</li>
        </ul>
        <p className="mt-4">
          The BAA is available at:
        </p>
        <p className="mt-4">
          <a
            href="https://replyquick.ai/baa"
            className="text-blue-600 hover:underline"
          >
            replyquick.ai/baa
          </a>
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          13. Limitation of Liability
        </h2>
        <p>
          ReplyQuick&apos;s liability under this DPA is subject to the limitations in the Terms and Conditions, except where prohibited by HIPAA or GDPR.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          14. Term and Termination
        </h2>
        <p>
          This DPA remains in effect:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>As long as Customer uses ReplyQuick services</li>
          <li>Until all processing is complete</li>
          <li>Until all personal data is deleted or returned</li>
        </ul>
        <p className="mt-4">
          Termination of the main service agreement automatically terminates this DPA.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          15. Governing Law
        </h2>
        <p>
          This Agreement is governed by:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>U.S. federal privacy law (HIPAA, etc.)</li>
          <li>State privacy laws (CCPA/CPRA, etc.)</li>
          <li>GDPR (for EU customers)</li>
          <li>LGPD (for Brazil)</li>
          <li>Any applicable international privacy regulations</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          16. Contact Information
        </h2>
        <p>
          For questions regarding this DPA:
        </p>
        <p className="mt-4">
          Email:{" "}
          <a
            href="mailto:info@replyquick.ai"
            className="text-blue-600 hover:underline"
          >
            info@replyquick.ai
          </a>
        </p>
      </div>
    </div>
  );
};

export default LLCDataAgreementPage;