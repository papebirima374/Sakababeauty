// Montant en francs CFA : « 12 500 F ». Sans dépendance, utilisable partout.
export function formatPrix(montant: number) {
  return `${new Intl.NumberFormat("fr-FR").format(montant).replace(/ | /g, " ")} F`;
}
