const cols = [
  { title: "Product", links: ["Platform", "Pricing", "Docs", "Changelog"] },
  { title: "Solutions", links: ["KYC Verification", "Remote Hiring", "Financial Services", "Government"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] },
];

const Footer = () => (
  <footer className="border-t border-border py-16">
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/veriastra-logo.png" alt="Veriastra logo" className="h-6 w-6 object-contain brightness-0 invert" />
            <span className="font-bold text-foreground tracking-widest uppercase text-sm">Veriastra</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Real-time identity verification powered by multimodal AI. Trust, Verified in Real Time.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-foreground mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xs text-muted-foreground">© 2026 Veriastra. All rights reserved.</span>
        <span className="text-xs text-muted-foreground font-mono-data">SOC 2 Type II · ISO 27001 · GDPR Compliant</span>
      </div>
    </div>
  </footer>
);

export default Footer;
