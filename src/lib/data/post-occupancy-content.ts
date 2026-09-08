import type {Language} from '$lib/i18n';
import type {EditorialStory} from '$lib/utils/editorial-markdown';
import {CASE_STUDY_IMAGE_IDS, type CaseStudyImageId} from './case-study-ids';
import {postOccupancyCaptionsFr, residentTopicsFr} from './post-occupancy.fr';

export type PostOccupancyPageText = {
    title: string;
    residentVoicesTitle: string;
};

export type ResidentTopic = {
    id: string;
    label: string;
    quotes: readonly string[];
};

export const localPostOccupancyText: Record<Language, PostOccupancyPageText> = {
    en: {
        title: 'A call for more post‑occupancy evaluations',
        residentVoicesTitle: 'Residents assess the housing projects',
    },
    fr: {
        title: 'Appel à développer plus d’évaluations de l’usage des bâtiments de logements sociaux',
        residentVoicesTitle: 'Les habitants évaluent les projets de logements',
    },
};

export const localPostOccupancyIntroduction: Record<Language, EditorialStory> = {
    en: {
        blocks: [
            {type: 'paragraph', html: 'This call proposes to shift attention from how many social housing units are delivered to how they are actually lived in. Under frameworks such as the Loi SRU, we now have twenty‑plus years of built projects, yet very few systematic post-occupancy evaluations that center residents’ experiences, building performance, and neighborhood effects. I am calling for planners, architects, housing providers, researchers, and resident organizations to develop shared, rigorous, and repeatable ways of assessing life in these developments—combining quantitative indicators (comfort, health, maintenance, environmental performance) with qualitative insights on dignity, everyday use, and social relations.'},
            {type: 'paragraph', html: 'The goal is to move beyond compliance metrics and architectural intentions, and to build an evidence base that allows us to identify what actually works, what fails, and how future projects and policies should be revised. This page will serve as a living platform to gather tools, case studies, and collaborations around post-occupancy evaluations in social housing, and to invite others to join this agenda.'},
            {type: 'paragraph', html: 'This call is grounded in seven post-occupancy case studies, from Paris to Brittany, Provence, and the overseas territories, that anchor these questions in concrete places and lived experiences.'},
        ],
        notes: [],
    },
    fr: {
        blocks: [
            {type: 'paragraph', html: 'Cet appel propose de déplacer l’attention du nombre de logements sociaux produits vers la manière dont ils sont effectivement habités. Dans le cadre de dispositifs tels que la loi SRU, plus de vingt ans de projets ont désormais été réalisés, mais très peu d’évaluations post-occupationnelles systématiques ont été menées en plaçant au centre l’expérience des habitants, la performance des bâtiments et les effets à l’échelle des quartiers. Ce projet appelle les urbanistes, architectes, bailleurs sociaux, chercheurs et organisations de résidents à élaborer des méthodes communes, rigoureuses et reproductibles pour évaluer la vie dans ces opérations. Ces méthodes devraient combiner des indicateurs quantitatifs (confort, santé, entretien et performance environnementale) avec des données qualitatives portant sur la dignité, les usages quotidiens et le lien social.'},
            {type: 'paragraph', html: 'L’objectif est d’aller au-delà des quotas de logements sociaux et des intentions architecturales, afin de constituer une base de connaissances permettant d’identifier ce qui fonctionne réellement, ce qui échoue et la manière dont les futurs projets et politiques devraient être repensés. Cette page servira de plateforme évolutive pour rassembler des outils, des études de cas et des collaborations autour des évaluations post-occupationnelles dans le logement social, et pour inviter d’autres acteurs à rejoindre cette démarche.'},
            {type: 'paragraph', html: 'Cet appel s’appuie sur sept études de cas post-occupationnelles, de Paris à la Bretagne, de la Provence aux départements et territoires d’outre-mer. Les sept zooms ancrent ces questions dans des lieux concrets et des expériences vécues.'},
        ],
        notes: [],
    },
};

const postOccupancyCaptionsEnInImageOrder = [
    "The Samaritaine block on Place de l’École, where the redevelopment combines luxury retail with new social housing in the historic heart of Paris.",
    "Behind the Samaritaine façade, a back‑of‑house workspace reveals the everyday, unseen life that coexists with the project’s polished public image.",
    "A discreet, glowing entrance on a side street leads residents into the Samaritaine’s social housing, tucked behind the department store façade.",
    "Behind Samaritaine’s restored Art Nouveau façade, new social housing apartments light up the former department store’s display windows.",
    "A Samaritaine social housing resident waits at the bus stop outside her building, her daily commute shortened by now living just a few stops from her workplace in central Paris.",
    "As she walks out her Samaritaine apartment, a resident checks her route on a transit app, illustrating how central social housing can radically shrink daily commute times.",
    "Above the historic Samaritaine sign on Rue Baillet, everyday objects in the windows hint at the social housing now inhabiting this former department store.",
    "A resident enters the Samaritaine’s discreet social housing entrance, framed by restored Art Nouveau details in the heart of Paris.",
    "A resident’s art‑history notebook from classes at the École du Louvre, which she was able to attend because the Samaritaine is next door to this world‑class museum.",
    "Portrait of a Samaritaine resident on the steps of the Louvre, where she was able to take art‑history classes just a few minutes’ walk from home.",
    "A dog hurries toward the Samaritaine’s residential doorway, underscoring how this former department store now hosts ordinary domestic life.",
    "Number 20 now opens onto a bright lobby for Samaritaine’s residents, seamlessly woven into the restored historic façade.",
    "Former “MÉNAGE,” “OUTILS,” and “CHAUFFAGE” display bands now frame the windows of social housing apartments, where residents’ plants and objects replace merchandise.",
    "A resident swipes her badge at the Samaritaine intercom, a small everyday gesture that now anchors social housing in one of Paris’s most exclusive blocks.",
    "Inside a Samaritaine social housing apartment, a resident reads among books and potted plants on the balcony, with everyday views onto world‑class, historically preserved monuments like the Tour Saint‑Jacques and the Eiffel Tower.",
    "From the bus stop across the street, a Samaritaine resident looks toward her new building, claiming a central Paris address as home.",
    "The pale, curved façade of Maréchal Fayolle’s social housing, with its tall windows and Juliet balconies, introduces a modern presence into Paris’s bourgeois 16th arrondissement—a quiet victory over the NIMBY abutters who tried to block the project.",
    "Light and shadow slide across the curved courtyard façades, offering residents generous windows and privacy in a building many neighbors once tried to prevent.",
    "The circular volumes of Maréchal Fayolle enclose a quiet, sunlit courtyard, giving social housing residents shared outdoor space set back from the busy boulevards.",
    "Under the building’s raised circular volume, a sheltered bike cage and lawn offer children secure play and storage space.",
    "A teenager strolls under the pilotis of Maréchal Fayolle, where the open ground floor forms a covered passage between the bike storage, shared courtyard, and surrounding streets.",
    "From their windows at Maréchal Fayolle, residents look straight into a tall tree canopy, a pocket of greenery carved out amid the 16th arrondissement’s dense, high‑end buildings.",
    "At Maréchal Fayolle, three circular social housing buildings on pilotis open onto a shared garden, creating a generous interior landscape in a part of the 16th arrondissement long resistant to such collective spaces.",
    "Designed by Kazuyo Sejima and Ryue Nishizawa of SANAA, Maréchal Fayolle’s white, undulating volume is lifted on thin, round pilotis, freeing the ground for a planted garden that materializes the right to the commons for social housing residents in an otherwise very exclusionary arrondissement of Paris.",
    "Plans and section of the Rue Jean‑Bart project show how a former narrow police station, just off the Luxembourg Garden, has been reconfigured into stacked social housing units organized around the existing stair core.",
    "The rue Jean‑Bart façade now offers social housing residents stepped balconies and light‑filled apartments behind stonework that quietly aligns with the surrounding Haussmannian streetfront.",
    "A carved stone niche softens the corner of the former police station, marking a new social‑housing entrance on rue Jean‑Bart.",
    "In her bright, expanded kitchen at Tour Bois‑le‑Prêtre, a resident enjoys the extra space and light created by the tower’s renovation, which wrapped formerly cramped units with new winter‑garden additions.",
    "Behind the polycarbonate winter garden that now wraps every renovated unit, a resident’s painting studio shares the balcony with panoramic views of Paris, including the Eiffel Tower.",
    "In the generous winter‑garden extension added to every flat, a resident has turned her extra square meters into a light‑filled art studio, yoga studio, and dining space overlooking the city.",
    "In a space that once made residents dizzy during construction, when the old façade was removed and the new surface suddenly projected high above the ground, a tenant now calmly uses her expanded winter‑garden living room, enjoying a new lease on everyday life and doing far more from the comfort of her building.",
    "From her renovated flat, a resident draws back a specially designed curtain whose dense, pleated fabric improves thermal comfort while revealing a panoramic view over the périphérique and La Défense.",
    "Located in the small suburban middle-income town of Gignac-la-Nerthe, approximately 20 km northwest of Marseille, the project marks the transition between a residential neighborhood and the surrounding open landscape. West façade with a regular rhythm of Douglas-fir balconies set against solid ochre limestone walls, giving each dwelling access to a sheltered private outdoor space while helping buffer traffic noise.",
    "Open timber-and-steel access platforms connect the apartments while providing shared circulation space, private balconies, daylight and views across the surrounding landscape.",
    "The two-volume housing ensemble clad in 32 cm-thick Vers-Pont-du-Gard limestone, with recessed loggias and landscaped outdoor areas that extend residents’ living environment beyond the apartments.",
    "Ground-floor plan showing the two-building arrangement, shared garden, storage and bicycle rooms, and the circulation spaces that organize access between the homes. Gignac-la-Nerthe is a small, middle-income suburban commune within the Marseille–Aix metropolitan area, predominantly characterized by homeowner-oriented housing.",
    "The Talgen project inserts 24 social-rental homes into ViaSilva, a mixed-use expansion of Cesson-Sévigné, mediating between detached houses and larger collective buildings. The neighborhood connects residents to the metro, the Boudebois park, local services and employment areas.",
    "The plan brings together a range of apartment types around a compact shared circulation core, while terraces and balconies extend many of the homes into private outdoor space.",
    "A secure, dedicated bicycle room makes cycle storage convenient and accessible, supporting car-independent connections to nearby public transport, green space and local services.",
    "The communal circulation space is treated as an amenity rather than leftover space, combining natural light, timber, tiled surfaces and green metalwork to create a welcoming and legible entrance to the homes.",
    "The Les Jasmins residence provides 38 homes through a social homeownership scheme within Cœur de Ville, La Possession’s new urban centre. Shaded balconies, deep overhangs and screened openings create comfortable outdoor spaces suited to the tropical climate.",
    "Planted paths, palms, shared gardens and porous pedestrian spaces create a shaded setting around the housing. In Cœur de Ville, this “garden-city” approach extends access to cooling, recreation and social interaction beyond the individual dwelling.",
    "The site plan situates Les Jasmins within Cœur de Ville, a 34-hectare development combining housing with green spaces, schools, shops, public facilities and pedestrian routes. Conceived in response to La Possession’s rapid demographic growth, the district aims to bring everyday amenities closer to residents.",
    "The axonometric view presents Cœur de Ville as a socially mixed neighborhood combining housing, shops, offices, healthcare, schools, gardens and shared public spaces. Its planning links access to affordable housing with access to the facilities of a new town center."
] as const;

if (postOccupancyCaptionsEnInImageOrder.length !== CASE_STUDY_IMAGE_IDS.length) {
    throw new Error('The English case study caption count does not match the permanent image ID list.');
}

const postOccupancyCaptionsEn = Object.fromEntries(
    CASE_STUDY_IMAGE_IDS.map((imageId, index) => [imageId, postOccupancyCaptionsEnInImageOrder[index]]),
) as Record<CaseStudyImageId, string>;

export const localPostOccupancyCaptions: Record<Language, Record<CaseStudyImageId, string>> = {
    en: postOccupancyCaptionsEn,
    fr: postOccupancyCaptionsFr,
};

export const residentTopicsEn = [
    {
        id: "residential-pride",
        label: "Residential pride and the symbolic value of place",
        quotes: [
            "We all felt like we’d won the lottery when we were allocated housing in this neighborhood.",
            "I cried the day I saw how beautiful the apartment was and the view from my balcony. It opened up the field of possibilities.",
            "I have a large studio, with an incredible view and a small balcony. I can see the Eiffel Tower, the Louvre, the Sacré Cœur, the Montparnasse Tower, and a bit of the Seine.",
            "It nourishes the soul. I’m very proud to live here.",
            "My daughter was even able to find a job at La Samaritaine, and it made her very proud. It’s also a source of pride for my daughters to live at La Samaritaine.",
        ],
    },
    {
        id: "retail-food-access",
        label: "Everyday retail and food access",
        quotes: [
            "For my budget, it’s a bit of a food desert. There should be more supermarkets. Everything costs a fortune. I do my grocery shopping when I go to my parents’ place. My neighbors all have to take the metro to get to the nearest Lidl, which is still five metro stops away.",
            "Sometimes the crowds are a bit much, but being in the heart of the city is priceless. We’re close to everything—except large supermarkets.",
            "I’ve always done my shopping at the Aligre market. That suits me perfectly. It’s still a bit far and I have to take the metro, so we have to be two people if I’m heavily loaded with the shopping cart.",
            "There’s a market on Sunday mornings on Rue de Montmartre, but the prices are prohibitive.",
            "It’s a showcase neighborhood. So, there are a huge number of tourists. It’s really geared toward a tourist clientele.",
        ],
    },
    {
        id: "healthcare-access",
        label: "Healthcare access and affordability",
        quotes: [
            "Around here, the problem is that there are a lot of health centers that charge extra fees, and depending on our complementary insurance, we’re not covered 100%, even when we have civil-servant insurance.",
            "I’m in favor of local medicine, but it’s impossible to find a new primary care doctor in the neighborhood. So I see my doctor where I used to live before. Here, doctors all refuse to take new patients.",
            "On the other hand, for all other care, I go nearby. I found a great dentist. Same for the ophthalmologist. Same for the imaging center. There are a huge number of care centers that are not necessarily cheap, that I find very luxurious, but for now they help me out.",
        ],
    },
    {
        id: "thermal-comfort",
        label: "Thermal comfort and housing design in use",
        quotes: [
            "Our homes are not energy sieves, but we die of heat in the summer. They’re real thermal kettles. I have a small AC unit, but even with that, I can barely survive. So if I can, I escape to my parents’ place outside Paris.",
            "At the Tour Bois-le-Prêtre, when the balconies were added by the architects, for a long time the neighbors were afraid to go out there to cool off and enjoy the view; it made them dizzy.",
            "They installed these nice thermal curtains for us, which require a minimum of know-how for everyday maintenance. Many of my neighbors forget to open them and air out the whole apartment for at least ten minutes a day.",
            "Here, this must have been the storage floor. So our apartment is attic-style, with a sloping ceiling. We’re right under the zinc roof. So, yes, in the summer, the whole envelope is hot, sometimes burning.",
        ],
    },
    {
        id: "cultural-capital",
        label: "Cultural capital and proximity to amenities",
        quotes: [
            "I was able to take art history classes at the Louvre museum because it’s right next door. I wouldn’t have done it if I didn’t live in the neighborhood. The Louvre is what symbolizes my experience of this home. I spent wonderful hours studying there.",
        ],
    },
    {
        id: "governance-coordination",
        label: "Governance, coordination and the “after” of flagship projects",
        quotes: [
            "These are all the questions about the post-inauguration phase that Paris Habitat and every social housing provider managing these more recent projects should be asking themselves. They honored their part of the deal. With a bit more coordination of resources at the neighborhood scale, we wouldn’t be having these problems in terms of access to services and well-being.",
        ],
    },
] as const satisfies readonly ResidentTopic[];

export const localResidentTopics: Record<Language, readonly ResidentTopic[]> = {
    en: residentTopicsEn,
    fr: residentTopicsFr,
};
