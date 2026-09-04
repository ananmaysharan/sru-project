// Retained bibliography content from SRU_FR_TRANSLATION_MASTERDOC.docx.
// Extract with scripts/extract-bibliography.py. Preserve source wording and link spans.
// Crossed-out text is omitted; APUR/Freeman deletion punctuation is cleaned up.
export type BibliographySegment = { text: string; href?: string; italic?: boolean; bold?: boolean };
export type BibliographySection = { title: string; items: { segments: BibliographySegment[] }[] };

export const bibliographySectionsFr: BibliographySection[] = [
    {
        title: "Articles scientifiques",
        items: [
            {"segments":[{"text":"Monkkonen, Paavo, Magda Maaoui, et Aurora Echevarria. \""},{"text":"Fair housing or the right to housing? Comparing policies and frames in France, the United States, and Mexico","href":"https://www.anderson.ucla.edu/sites/default/files/document/2025-10/2025-09wp.pdf"},{"text":"\", "},{"text":"UCLA Ziman Center for Real Estate Working Papers","italic":true},{"text":", Octobre 2025."}]},
            {"segments":[{"text":"Whitney Airgood-Obrycki, Magda Maaoui, et Sophia Wedeen. \""},{"text":"Rental Deserts, Segregation, and Zoning","href":"https://www.tandfonline.com/doi/full/10.1080/07352166.2025.2455606?scroll=top&needAccess=true"},{"text":"\", "},{"text":"Journal of Urban Affairs","italic":true},{"text":", Février 2025."}]},
            {"segments":[{"text":"Lance Freeman et Magda Maaoui. \""},{"text":"Inclusionary Zoning in New York and Paris: Trojan horse or Antidote to Gentrification?","href":"https://www.lincolninst.edu/es/publications/working-papers/inclusionary-zoning-in-new-york-paris"},{"text":"\", "},{"text":"Lincoln Institute of Land Policy Working Paper","italic":true},{"text":", Juin 2022."}]},
            {"segments":[{"text":"Maaoui, Magda. \""},{"text":"The SRU Law, twenty years later: evaluating the legacy of France's most important social housing program","href":"https://www.tandfonline.com/doi/abs/10.1080/02673037.2021.1941790"},{"text":"\", "},{"text":"Housing Studies","italic":true},{"text":", Août 2021."}]},
            {"segments":[{"text":"Maaoui, Magda. \""},{"text":"In Search of the Grand Paris: an Interview with Pierre Mansat on the Eve of the June 2020 municipal elections","href":"https://metropolitics.org/In-Search-of-Grand-Paris-Pierre-Mansat-on-the-Eve-of-the-June-2020-Municipal.html"},{"text":"\", "},{"text":"Metropolitics - Métropolitiques","italic":true},{"text":", Juin 2020."}]}
        ],
    },
    {
        title: "Chapitres d’ouvrages collectifs",
        items: [
            {"segments":[{"text":"Maaoui, Magda. 2026. \" Plaisir d'habiter : la vision de Renée Gailhoustet en faveur d'un habitat sain/ The Pleasure of Living: Renée Gailhoustet's Vision of Healthy Housing \", in "},{"text":"Renée Gailhoustet","italic":true},{"text":" [éditrice : Barrington-Leach], London: Architectural Association Publications."}]},
            {"segments":[{"text":"Maaoui, Magda (2020). \"The SRU Law: When French Zoning Says No to Inclusion\" [Cas d’étude], in "},{"text":"Zoning: A Guide for 21st-Century Planning","href":"https://www.routledge.com/Zoning-A-Guide-for-21st-Century-Planning/Sclar-Baird-Zars-Fischer-Stahl/p/book/9781138593886","italic":true},{"text":" [éditeurs : Sclar, Stahl, Baird-Zars], Routledge."}]},
            {"segments":[{"text":"Maaoui, Magda, et al. (Préface). "},{"text":"Pour en finir avec le petit Paris","href":"https://archicity.fr/edition-pour-en-finir-avec-le-petit-paris/","italic":true},{"text":", Paris: Archicity, Novembre 2024."}]}
        ],
    },
    {
        title: "Rapports et études d’urbanisme",
        items: [
            {"segments":[{"text":"Contribution au rapport de synthèse de l’APUR \"Inégalités sociales et territoriales de santé dans la Métropole du Grand Paris\", Paris, Octobre 2023."}]},
            {"segments":[{"text":"Contribution au rapport de l’APUR \"Recours aux soins et aux dispositifs de prévention : Inégalités sociales et territoriales de santé dans la Métropole du Grand Paris\", Paris, Octobre 2023."}]},
            {"segments":[{"text":"Contribution au rapport de l’APUR \""},{"text":"Actions en santé publique : sensibilisation, promotion et prévention","href":"https://www.apur.org/sites/default/files/inegalites_sante_volet02_actions-sante-publique.pdf?token=txqATjHG"},{"text":"\", Paris, Mai 2023."}]},
            {"segments":[{"text":"Contribution au rapport de l’APUR \"L'offre de soins dans la Métropole du Grand Paris : Inégalités sociales et territoriales de santé\", Paris, Mars 2023."}]}
        ],
    },
    {
        title: "Articles de presse",
        items: [
            {"segments":[{"text":"Maaoui, Magda, Krista Sykes, Chris Herbert, Susanne Schindler, et Becca Heilman. \""},{"text":"Social Housing, Reconsidered","href":"https://www.harvarddesignmagazine.org/articles/social-housing-reconsidered/"},{"text":"\". "},{"text":"Harvard Design Magazine Digital","italic":true},{"text":", Avril 2026."}]},
            {"segments":[{"text":"Maaoui, Magda. \""},{"text":"The Pleasure of Living: Lessons from France for US Social Housing","href":"https://www.jchs.harvard.edu/blog/pleasure-living-lessons-france-us-social-housing"},{"text":"\", "},{"text":"Housing Perspectives - Joint Center for Housing Studies","italic":true},{"text":" (publié le 7 avril 2026)."}]},
            {"segments":[{"text":"Maaoui, Magda et al. (Tous Grands Parisiens). \""},{"text":"Nous pensons qu'il est temps d'élire un ou une maire du Grand Paris","href":"https://www.lemonde.fr/idees/article/2026/01/29/elections-municipales-2026-nous-pensons-qu-il-est-temps-d-elire-un-ou-une-maire-du-grand-paris_6664644_3232.html"},{"text":"\", "},{"text":"Le Monde","italic":true},{"text":" (édito publié le 29 janvier 2026)."}]},
            {"segments":[{"text":"Maaoui, Magda. \""},{"text":"Social contract: Parisian social housing","href":"https://www.architectural-review.com/buildings/housing/social-contract-parisian-social-housing"},{"text":"\", "},{"text":"The Architectural Review","italic":true},{"text":" (Numéro France publié le 30 juin 2022). [Top 20 des articles Architectural Review lus en 2022]"}]},
            {"segments":[{"text":"Maaoui, Magda. \"Logement social : La Loi SRU menacée par le projet 3DS ?\", "},{"text":"Bondy Blog","italic":true},{"text":" (publié le 17 décembre 2021)."}]},
            {"segments":[{"text":"Pierre Mansat, Maaoui, Magda et al. \""},{"text":"La Métropole du Grand Paris paraît inopérante pour gérer un espace de 12 millions d'habitants","href":"https://www.lemonde.fr/idees/article/2021/06/24/la-metropole-du-grand-paris-parait-inoperante-pour-gerer-un-espace-de-12-millions-d-habitants_6085440_3232.html"},{"text":"\". "},{"text":"Le Monde","italic":true},{"text":" (édito publié le 24 juin 2021)."}]},
            {"segments":[{"text":"Pierre Mansat, Maaoui, Magda et al. \"Élections régionales en Île-de-France : 'Les débats de fond concernant l'avenir de la région métropolitaine parisienne ne sont jamais abordés'\". "},{"text":"Le Monde","italic":true},{"text":" (édito publié le 25 avril 2021)."}]},
            {"segments":[{"text":"Maaoui, Magda. \""},{"text":"La cité confinée à la lumière de la rythmanalyse","href":"https://www.bondyblog.fr/societe/la-cite-confinee-a-la-lumiere-de-la-rythmanalyse/"},{"text":"\", "},{"text":"Bondy Blog","italic":true},{"text":" (édito publié le 11 mai 2020)."}]},
            {"segments":[{"text":"Pierre Mansat, Maaoui, Magda et al. \""},{"text":"Avec le Grand Paris, le temps de la citoyenneté métropolitaine est venu","href":"https://www.lemonde.fr/idees/article/2020/02/19/avec-le-grand-paris-le-temps-de-la-citoyennete-metropolitaine-est-venu_6030028_3232.html"},{"text":"\". "},{"text":"Le Monde","italic":true},{"text":" (édito publié le 19 février 2020)."}]},
            {"segments":[{"text":"Maaoui, Magda. \""},{"text":"Les Misérables aux Oscars, pour mettre les mauvais cultivateurs des quartiers au banc des accusés","href":"https://www.bondyblog.fr/culture/les-miserables-aux-oscars-pour-mettre-les-mauvais-cultivateurs-des-quartiers-au-banc-des-accuses/"},{"text":"\", "},{"text":"Bondy Blog","italic":true},{"text":" (édito publié le 8 février 2020)."}]},
            {"segments":[{"text":"Maaoui, Magda. \""},{"text":"Changing Peripheries: the Obduracy of Buildings (and People who live in them)","href":"https://issuu.com/gsapp_hp/docs/urbanmag"},{"text":"\", "},{"text":"URBAN Magazine","italic":true},{"text":", Columbia University GSAPP: Volume 29, Automne 2019."}]}
        ],
    },
    {
        title: "Podcasts",
        items: [
            {"segments":[{"text":"Épisode du podcast "},{"text":"Housing After Dark","href":"https://open.spotify.com/episode/1gY0oTV7r6UvB1jdTnFaky"},{"text":" \"Drawing lessons from the French model of housing provision to address California's housing crisis\""}]},
            {"segments":[{"text":"Entretien dans le podcast "},{"text":"Housing Voice","italic":true},{"text":" sur l’héritage, après vingt ans, de la loi SRU française relative à l’obligation de construire des logements sociaux \""},{"text":"Social Housing in France","href":"https://www.lewis.ucla.edu/2022/02/16/episode-20-social-housing-in-france-with-magda-maaoui/"},{"text":"\" - UCLA Lewis Center"}]}
        ],
    },
    {
        title: "Expositions",
        items: [
            {"segments":[{"text":"Exposition","href":"https://www.aaschool.ac.uk/publicprogramme/whatson/renee-gailhoustet-a-thousand-and-one-ways-of-living"},{"text":" coordonnée par l’agence d’architecture NVBL, organisée en parallèle du lancement du livre consacré à Renée Gailhoustet—Galerie d’exposition de l’Architectural Association, Londres."}]}
        ],
    },
    {
        title: "Couverture médiatique de mon travail",
        items: [
            {"segments":[{"text":"\""},{"text":"Back gardens in the sky! The riotous, post-apocalyptic buildings of 'eco-brutalist' Renée Gailhoustet","href":"https://www.theguardian.com/artanddesign/2026/feb/10/riotous-post-apocalyptic-eco-brutalist-renee-gailhoustet"},{"text":"\", "},{"text":"The Guardian","italic":true},{"text":" (publié le 10 février 2026)."}]},
            {"segments":[{"text":"\""},{"text":"Full-scale paper replica of Renée Gailhoustet apartment installed at London's Architectural Association","href":"https://www.dezeen.com/2026/01/23/renee-gailhoustet-exhibition-architectural-association/"},{"text":"\", "},{"text":"Dezeen","italic":true},{"text":" (publié le 23 janvier 2026)."}]},
            {"segments":[{"text":"\""},{"text":"Discover Renée Gailhoustet and her radical approach to socially engaged housing","href":"https://www.wallpaper.com/architecture/renee-gailhoustet-exhibition-aa-london-uk"},{"text":"\", "},{"text":"Wallpaper","italic":true},{"text":" (publié le 23 janvier 2026)."}]},
            {"segments":[{"text":"\""},{"text":"Paint the Town Red","href":"https://www.worldofinteriors.com/story/renee-gailhoustet-a-thousand-and-one-ways-of-living-architecture"},{"text":"\", "},{"text":"The World of Interiors","italic":true},{"text":" (publié le 17 janvier 2026)."}]},
            {"segments":[{"text":"\""},{"text":"En 2026, le Grand Paris a besoin d'un projet commun","href":"https://www.lagrandeconversation.com/societe/en-2026-le-grand-paris-a-besoin-dun-projet-commun/"},{"text":"\", "},{"text":"La Grande Conversation","italic":true},{"text":" (publié le 21 janvier 2025)."}]},
            {"segments":[{"text":"\""},{"text":"Incendies à Los Angeles : les constructions en bois, boucs émissaires des négligences d'urbanisme","href":"https://www.liberation.fr/international/amerique/incendies-a-los-angeles-les-constructions-en-bois-bouc-emissaire-des-negligences-durbanisme-20250115_OFQKOYGKA5AX7ADMP64LFYCBFY/?datawallToken=GFT-78f1d9a61700db9f057028ac46064cbb"},{"text":"\", "},{"text":"Libération","italic":true},{"text":"(publié le 15 janvier 2025)."}]},
            {"segments":[{"text":"\""},{"text":"What France got right about social housing—and the lessons for California urban planners","href":"https://localnewsmatters.org/2025/01/14/what-france-got-right-about-social-housing-and-the-lessons-for-california-urban-planners/"},{"text":"\", "},{"text":"Bay Area Local News Matters","italic":true},{"text":" (publié le 14 janvier 2025)."}]},
            {"segments":[{"text":"\""},{"text":"Logement social: l'exécutif remet en cause l'objectif de mixité","href":"https://www.lemonde.fr/idees/article/2024/03/12/logement-social-le-gouvernement-remet-en-cause-l-objectif-de-mixite_6221580_3232.html"},{"text":"\", "},{"text":"Le Monde","italic":true},{"text":" (publié le 13 mars 2024)."}]},
            {"segments":[{"text":"\""},{"text":"Les patients en affection longue durée surreprésentés dans les zones pauvres du Grand Paris","href":"https://www.liberation.fr/societe/sante/les-patients-en-affection-longue-duree-surrepresentes-dans-les-zones-pauvres-du-grand-paris-20231019_WGZKTEDBFNAXZFQT2IJJCGCULM/"},{"text":"\", "},{"text":"Libération","italic":true},{"text":"(publié le 19 octobre 2023)."}]},
            {"segments":[{"text":"\""},{"text":"Dans quel quartier de Paris trouve-t-on le plus de médecins ?","href":"https://actu.fr/ile-de-france/paris_75056/carte-dans-quel-quartier-de-paris-trouve-t-on-le-plus-de-medecins_58645188.html"},{"text":"\", "},{"text":"Actualités de Paris","italic":true},{"text":" (publié le 3 avril 2023)."}]},
            {"segments":[{"text":"\"Déserts médicaux : quelles villes des Hauts-de-Seine ont le plus de médecins\", "},{"text":"Actualités des Hauts-de-Seine","italic":true},{"text":" (publié le 3 avril 2023)."}]},
            {"segments":[{"text":"\"Logement social : ce que le modèle de Rennes peut inspirer aux autres communes\", "},{"text":"Envies de Ville – Nexity","italic":true},{"text":" (publié le 3 mars 2022)."}]},
            {"segments":[{"text":"\"Logement social. 'Rennes est un modèle à copier'\", "},{"text":"Ouest-France","italic":true},{"text":" (publié le 4 janvier 2022)."}]},
            {"segments":[{"text":"\""},{"text":"Les sanctions de la Loi SRU n'ont pas d'effet incitatif","href":"https://www.lagazettedescommunes.com/765814/les-sanctions-de-la-loi-sru-nont-pas-deffet-incitatif/"},{"text":"\", "},{"text":"La Gazette des Communes","italic":true},{"text":" (publié le 1er octobre 2021)."}]}
        ],
    }
];
