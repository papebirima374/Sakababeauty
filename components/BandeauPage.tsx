import Link from "next/link";

// Bandeau de titre noir et or, commun aux pages de la boutique.
export default function BandeauPage({
  surtitre,
  titre,
  texte,
  ariane,
  children,
}: {
  surtitre?: string;
  titre: React.ReactNode;
  texte?: React.ReactNode;
  ariane?: { href?: string; nom: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-noir text-creme">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 90% at 85% 0%, rgba(197,151,53,0.32), transparent 70%), radial-gradient(35% 60% at 0% 100%, rgba(227,199,126,0.10), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
        {ariane && ariane.length > 0 && (
          <nav className="text-xs text-creme/60 mb-4" aria-label="Fil d'Ariane">
            {ariane.map((a, i) => (
              <span key={a.nom}>
                {i > 0 && <span className="mx-1.5 text-or">/</span>}
                {a.href ? <Link href={a.href} className="hover:text-or-clair">{a.nom}</Link> : <span className="text-creme/90">{a.nom}</span>}
              </span>
            ))}
          </nav>
        )}
        {surtitre && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-or-clair">{surtitre}</p>}
        <h1 className="titre text-4xl sm:text-5xl md:text-6xl leading-[1.05] mt-2 text-balance">{titre}</h1>
        {texte && <p className="mt-3 max-w-2xl text-creme/75 md:text-lg">{texte}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
