// Typography corrections only. Resident quotations and English fields are excluded.
export function correctFrenchCopy(text: string, kind: 'bibliography' | 'resources' | 'introduction'): string {
    if (kind === 'introduction') return text.replaceAll('Images 1 à 3:', 'Images 1 à 3 :').replaceAll('Image 4:', 'Image 4 :');
    if (kind === 'bibliography') return text
        .replace(/\b(Octobre|Février|Juin|Août|Novembre|Mai|Mars|Avril|Automne)(?= \d{4})/g, word => word.toLowerCase())
        .replace(/^\(publié le (15 janvier 2025|19 octobre 2023)\)/, ' (publié le $1)')
        .replaceAll('habitat sain/ The Pleasure', 'habitat sain / The Pleasure')
        .replaceAll('" Plaisir', '"Plaisir').replaceAll('Housing "', 'Housing"')
        .replaceAll('London:', 'London :').replaceAll('Paris: Archicity', 'Paris : Archicity')
        .replaceAll('Gailhoustet—Galerie', 'Gailhoustet — Galerie')
        .replaceAll('Logement social:', 'Logement social :');
    return text
        .replace(/ +([.,])/g, '$1')
        .replaceAll(':Les astuces', ': Les astuces')
        .replaceAll('A Bordeaux', 'À Bordeaux')
        .replaceAll('30000 €', '30 000 €')
        .replaceAll('calendrier:', 'calendrier :').replaceAll('campagne:', 'campagne :')
        .replaceAll(', and ', ' et ').replaceAll(' and ', ' et ')
        .replace(/\bEtat\b/g, 'État').replaceAll('Ile-de-France', 'Île-de-France')
        .replaceAll('Elysée', 'Élysée').replaceAll('mise en oeuvre', 'mise en œuvre')
        .replaceAll('“A qui', '“À qui').replaceAll('“A quoi', '“À quoi').replaceAll('“A Saint-Maur', '“À Saint-Maur')
        .replaceAll('logements sociaux?', 'logements sociaux ?');
}
