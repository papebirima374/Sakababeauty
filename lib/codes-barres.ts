// Codes-barres internes (EAN-13 commençant par « 2 », plage réservée aux codes
// propres à un magasin). Servent tant que les vrais codes des produits n'ont
// pas été récupérés depuis le logiciel actuel de Sakaba.
export function ean13Interne(n: number) {
  const base = `20000${String(n).padStart(7, "0")}`;
  const somme = [...base].reduce((t, c, i) => t + Number(c) * (i % 2 ? 3 : 1), 0);
  return base + ((10 - (somme % 10)) % 10);
}
