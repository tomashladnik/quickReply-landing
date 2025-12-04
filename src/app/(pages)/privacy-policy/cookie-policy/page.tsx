const CookiePolicyPage = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        COOKIE POLICY
      </h1>
      <p className="text-sm text-gray-500">Last updated: December 3, 2025</p>

      <div className="mt-8">
        <p>
          This Cookie Policy explains how ReplyQuick LLC (&quot;ReplyQuick&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar technologies on our website, applications, demo links, and platforms.
        </p>
        <p className="mt-4">
          By using our Services, you consent to the use of cookies as described in this policy.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files placed on your device to store data that can be retrieved by our servers or those of third parties.
        </p>
        <p className="mt-4">
          Cookies help us:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Secure the platform</li>
          <li>Enable user login sessions</li>
          <li>Analyze usage</li>
          <li>Improve performance</li>
          <li>Provide support and diagnostics</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">2. Types of Cookies We Use</h2>
        
        <h3 className="mt-6 text-xl font-bold text-gray-900">Essential Cookies</h3>
        <p>
          Required for the platform to function.
        </p>
        <p className="mt-4">
          These enable:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Login authentication</li>
          <li>Page navigation</li>
          <li>Security features</li>
          <li>Form submissions</li>
        </ul>
        <p className="mt-4">
          You cannot disable these.
        </p>

        <h3 className="mt-6 text-xl font-bold text-gray-900">Performance & Analytics Cookies</h3>
        <p>
          Used to analyze how users interact with the Services.
        </p>
        <p className="mt-4">
          May include:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Page views</li>
          <li>Button clicks</li>
          <li>Error logs</li>
          <li>Session performance</li>
        </ul>
        <p className="mt-4">
          Tools may include:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Supabase logs</li>
          <li>Vercel analytics</li>
          <li>GA4 (if enabled)</li>
        </ul>

        <h3 className="mt-6 text-xl font-bold text-gray-900">Functionality Cookies</h3>
        <p>
          Used to remember user preferences, such as:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Dark/light mode</li>
          <li>Saved fields</li>
          <li>Local settings</li>
          <li>UI preferences</li>
        </ul>

        <h3 className="mt-6 text-xl font-bold text-gray-900">Marketing Cookies (Optional)</h3>
        <p>
          We currently do not use third-party marketing cookies for advertising.
        </p>
        <p className="mt-4">
          If this changes, this policy will be updated.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">3. How to Manage Cookies</h2>
        <p>
          Most browsers allow you to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Block cookies</li>
          <li>Delete cookies</li>
          <li>Disable tracking</li>
          <li>Receive alerts when cookies are used</li>
        </ul>
        <p className="mt-4">
          Disabling essential cookies may cause parts of the platform to stop working.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">4. Third-Party Cookies</h2>
        <p>
          Some cookies may be placed by third-party providers that help us operate our Services, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Supabase</li>
          <li>Vercel</li>
          <li>Stripe</li>
          <li>AssemblyAI</li>
          <li>Twilio / Telnyx</li>
          <li>Cloudflare</li>
          <li>Session security providers</li>
        </ul>
        <p className="mt-4">
          These providers may use cookies for their own functionality, security, or analytics.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">5. Updates</h2>
        <p>
          We may update this Cookie Policy.
        </p>
        <p className="mt-4">
          The &quot;Last updated&quot; date will be revised accordingly.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">6. Contact Us</h2>
        <p>
          For questions about this policy:
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

export default CookiePolicyPage;
