const LoginView = ({ insights, onSubmit }) => (
  <div className="login-page">
    <div className="login-shell">
      <section className="brand-panel" aria-labelledby="brand-heading">
        <div className="badge">Polaris Air Tech Corp</div>
        <h1 id="brand-heading">
          End-to-end visibility for every air conditioner in your network.
        </h1>
        <p className="brand-copy">
          Track procurement, warehouse levels, and service inventory from one
          secure workspace designed for HVAC distributors.
        </p>
        <div className="insights" aria-label="Operational highlights">
          {insights.map((item) => (
            <div key={item.label} className="insight">
              <span>{item.value}</span>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
        <div className="support-card">
          <strong>Need access?</strong>
          <p>
            Contact the Polaris administrator to activate your user profile.
          </p>
        </div>
      </section>

      <section className="form-panel" aria-labelledby="login-heading">
        <div className="form-header">
          <p className="eyebrow">User login</p>
          <h2 id="login-heading">Welcome back</h2>
          <p>Sign in with your Polaris Air Tech email to manage inventory.</p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label htmlFor="email">Corporate email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="captain@polarisairtech.com"
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <div className="form-meta">
            <label className="checkbox">
              <input type="checkbox" name="remember" />
              <span>Keep me signed in</span>
            </label>
            <a className="link" href="#support">
              Forgot password?
            </a>
          </div>

          <button type="submit">Sign in</button>
        </form>

        <div className="terms">
          <p>
            By continuing you agree to Polaris Air Tech&apos;s{" "}
            <a className="link" href="#security">
              security policy
            </a>{" "}
            and
            <a className="link" href="#compliance">
              {" "}
              compliance standards.
            </a>
          </p>
        </div>
      </section>
    </div>
  </div>
);

export default LoginView;
