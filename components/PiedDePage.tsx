import Image from "next/image";
import Link from "next/link";
import { BOUTIQUE, EST_PRODUCTION } from "@/lib/config";
import { UNIVERS } from "@/lib/catalogue";

export default function PiedDePage() {
  return (
    <footer className="bg-noir text-creme mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Image src="/logo-sakaba.png" alt="Sakaba Beauty" width={72} height={72} className="rounded-full bg-white" />
          <p className="titre text-xl mt-3 text-or-clair">{BOUTIQUE.slogan}</p>
          <p className="text-sm text-creme/70 mt-2">{BOUTIQUE.adresse}</p>
        </div>
        <div>
          <h2 className="font-semibold text-or-clair mb-3">Boutique</h2>
          <ul className="space-y-1.5 text-sm text-creme/80">
            {UNIVERS.map((u) => (
              <li key={u.slug}>
                <Link href={`/${u.slug}`} className="hover:text-or-clair">{u.nom}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-or-clair mb-3">Sakaba</h2>
          <ul className="space-y-1.5 text-sm text-creme/80">
            <li><Link href="/authenticite" className="hover:text-or-clair">Notre engagement d&apos;authenticité</Link></li>
            <li><Link href="/diagnostic" className="hover:text-or-clair">Diagnostic beauté</Link></li>
            <li><Link href="/marques" className="hover:text-or-clair">Toutes les marques</Link></li>
            <li><Link href="/livraison" className="hover:text-or-clair">Livraison et retrait</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-or-clair mb-3">Paiement</h2>
          <p className="text-sm text-creme/80">Wave · Orange Money · Carte bancaire · Paiement à la livraison</p>
          <a href={BOUTIQUE.instagram} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm font-semibold text-or-clair hover:underline">
            Instagram @sakababeauty
          </a>
        </div>
      </div>
      <div className="border-t border-creme/10 text-center text-xs text-creme/50 py-4 px-4">
        © {new Date().getFullYear()} {BOUTIQUE.nom}
        {!EST_PRODUCTION && " · Version de test — produits et prix d'exemple, non indexée par Google"}
      </div>
    </footer>
  );
}
