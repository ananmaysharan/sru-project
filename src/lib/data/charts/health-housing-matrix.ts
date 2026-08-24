export type HealthHousingStudy = {
	title: string;
	url: string;
};

export type HealthHousingRow = {
	group: 'location' | 'proximity' | 'indoor' | 'outdoor';
	groupLabel: string;
	label: string;
	studies: (HealthHousingStudy | null)[];
};

export const HEALTH_OUTCOMES = [
	'Prevalence of Respiratory Illness',
	'Prevalence of Non-Communicable Disease (diabetes, obesity, cardiovascular)',
	'Prevalence of Thermal Discomforts + Disease (heatstroke, hypothermia)',
	'Prevalence of Communicable Disease or Toxic Poisoning (water-borne, Pb, aesbestos)',
	'Stress and Anxiety',
	'Depression and Social Isolation',
	'Cognitive and Behavioral Issues'
] as const;

export const HEALTH_HOUSING_CITATIONS: Readonly<Record<string, string>> = {
	'https://www.mdpi.com/1660-4601/18/6/2815': 'Wimalasena, N. N., et al. (2021). International Journal of Environmental Research and Public Health, 18(6), 2815.',
	'https://jech.bmj.com/content/73/4/287.abstract': 'Booth, G. L., et al. (2019). Journal of Epidemiology and Community Health, 73(4), 287–294.',
	'https://jech.bmj.com/content/68/2/171.short': 'Jones-Rounds, M. L., Evans, G. W., & Braubach, M. (2014). Journal of Epidemiology and Community Health, 68(2), 171–175.',
	'https://doi.org/10.1016/j.healthplace.2010.04.006': 'Mair, C., Diez Roux, A. V., & Morenoff, J. D. (2010). Health & Place, 16(5), 811–819.',
	'https://www.sciencedirect.com/science/article/abs/pii/S0049089X18306987?via%3Dihub': 'Anderson, S., Johnston, W., & Leventhal, T. (2019). Social Science Research, 81, 1–11.',
	'https://www.mdpi.com/1660-4601/19/23/15975': 'Riva, A., et al. (2022). International Journal of Environmental Research and Public Health, 19(23), 15975.',
	'https://doi.org/10.1016/j.ypmed.2017.09.020': 'Pevalin, D. J., et al. (2017). Preventive Medicine, 105, 304–310.',
	'https://link.springer.com/article/10.1186/s12889-026-28500-z': 'Fritz, Z., et al. (2026). BMC Public Health, 26(1), 2391.',
	'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0133603': 'Gariepy, G., et al. (2015). PLOS ONE, 10(7), e0133603.',
	'https://www.sciencedirect.com/science/article/abs/pii/S104727971500304X?via%3Dihub': 'Clarke, P. J., et al. (2015). Annals of Epidemiology, 25(11), 849–854.',
	'https://www.mdpi.com/1660-4601/18/21/11028': 'Nguyen, P. Y., et al. (2021). International Journal of Environmental Research and Public Health, 18(21), 11028.',
	'https://link.springer.com/article/10.1186/1476-069X-13-20': 'Tamosiunas, A., et al. (2014). Environmental Health, 13(1), 20.',
	'https://www.sciencedirect.com/science/article/abs/pii/S0160412016300666': 'Dadvand, P., et al. (2016). Environment International, 91, 161–167.',
	'https://doi.org/10.1093/ije/dyab089': 'Astell-Burt, T., et al. (2022). International Journal of Epidemiology, 51(1), 99–110.',
	'https://doi.org/10.1371/journal.pmed.1003213': 'Bijnens, E. M., et al. (2020). PLOS Medicine, 17(8), e1003213.',
	'https://www.sciencedirect.com/science/article/abs/pii/S0013935114001832': 'Rovira, E., et al. (2014). Environmental Research, 133, 156–163.',
	'https://ajph.aphapublications.org/doi/full/10.2105/AJPH.2011.300183': 'Brender, J. D., Maantay, J. A., & Chakraborty, J. (2011). American Journal of Public Health, 101(S1), S37–S52.',
	'https://journals.sagepub.com/doi/abs/10.1177/002214650504600306': 'Downey, L., & Van Willigen, M. (2005). Journal of Health and Social Behavior, 46(3), 289–305.',
	'https://doi.org/10.2105/AJPH.2024.307730': 'Willis, M. D., et al. (2024). American Journal of Public Health, 114(9), 923–934.',
	'https://www.nature.com/articles/s41370-021-00369-7': 'Zhang, C. H., et al. (2022). Journal of Exposure Science & Environmental Epidemiology, 32(1), 124–134.',
	'https://www.sciencedirect.com/science/article/pii/S2214140522001852': 'Oviedo, D., et al. (2022). Journal of Transport & Health, 27, 101513.',
	'https://www.sciencedirect.com/science/article/pii/S0091743524003591?via%3Dihub': 'Matsumoto, K., et al. (2025). Preventive Medicine, 191, 108204.',
	'https://www.mdpi.com/1660-4601/17/16/5704': 'Cardoza, J. E., et al. (2020). International Journal of Environmental Research and Public Health, 17(16), 5704.',
	'https://www.sciencedirect.com/science/article/pii/S0277953622007675': 'Clair, A., & Baker, E. (2022). Social Science & Medicine, 314, 115461.',
	'https://pmc.ncbi.nlm.nih.gov/articles/PMC7665158/': 'Raju, S., Siddharthan, T., & McCormack, M. C. (2020). Clinics in Chest Medicine, 41(4), 825–843.',
	'https://www.sciencedirect.com/science/article/abs/pii/S0269749119362803': 'Huang, S., et al. (2020). Environmental Pollution, 265(Pt A), 114999.',
	'https://www.cambridge.org/core/journals/bjpsych-open/article/air-quality-and-mental-health-evidence-challenges-and-future-directions/FF3A143292CD1783BA7DC7B744573C5C': 'Bhui, K., et al. (2023). BJPsych Open, 9(4), e120.',
	'https://doi.org/10.1016/j.envpol.2021.117350': 'Li, C., Zhou, Y., & Ding, L. (2021). Environmental Pollution, 283, 117350.',
	'https://www.sciencedirect.com/science/article/pii/S0160412020322066': 'Cao, L., et al. (2021). Environment International, 146, 106251.',
	'https://heart.bmj.com/content/99/14/984.short': 'Painschab, M. S., et al. (2013). Heart, 99(14), 984–991.',
	'https://pubs.acs.org/evhpaz/article/117/3/468/5247943/Exposure-of-U-S-Children-to-Residential-Dust-Lead': 'Dixon, S. L., et al. (2009). Environmental Health Perspectives, 117(3), 468–474.',
	'https://link.springer.com/article/10.1186/s13643-022-01963-y': 'Heidari, S., et al. (2022). Systematic Reviews, 11(1), 106.',
	'https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2020.00014/full': 'Manisalidis, I., et al. (2020). Frontiers in Public Health, 8, 14.',
	'https://www.bmj.com/content/350/bmj.h1111': 'Power, M. C., et al. (2015). BMJ, 350, h1111.',
	'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2801241': 'Qiu, X., et al. (2023). JAMA Network Open, 6(2), e2253668.',
	'https://pubs.acs.org/evhpaz/article/130/6/067008/5224301/Associations-of-Pre-and-Postnatal-Air-Pollution': 'Ni, Y., et al. (2022). Environmental Health Perspectives, 130(6), 067008.',
	'https://www.sciencedirect.com/science/article/abs/pii/S0048969722054316?via%3Dihub': 'Faurie, C., et al. (2022). Science of The Total Environment, 852, 158332.',
	'https://www.sciencedirect.com/science/article/pii/S0160412023005202?via%3Dihub': 'Fang, W., et al. (2023). Environment International, 181, 108247.',
	'https://doi.org/10.1093/gerona/glaf209': 'Fang, B., et al. (2025). The Journals of Gerontology, Series A: Biological Sciences and Medical Sciences, 80(12), glaf209.',
	'https://www.sciencedirect.com/science/article/abs/pii/S0013935126008443?via%3Dihub': 'Hu, L., et al. (2026). Environmental Research, 301, 124513.',
	'https://academic.oup.com/eurpub/article/30/3/516/5731324': 'Beutel, M. E., et al. (2020). European Journal of Public Health, 30(3), 516–521.',
	'https://www.tandfonline.com/doi/abs/10.1080/09540261.2022.2095200': 'Tortorella, A., et al. (2022). International Review of Psychiatry, 34(7-8), 783–796.'
};

export const HEALTH_HOUSING_ROWS: HealthHousingRow[] = [
	{
		group: 'location',
		groupLabel: 'Location + Conditions',
		label: 'Location',
		studies: [
			{ title: 'Housing Risk Factors Associated with Respiratory Disease: A Systematic Review', url: 'https://www.mdpi.com/1660-4601/18/6/2815' },
			{ title: 'Neighbourhood walkability and the incidence of diabetes: an inverse probability of treatment weighting analysis', url: 'https://jech.bmj.com/content/73/4/287.abstract' },
			null,
			null,
			{ title: 'The interactive effects of housing and neighbourhood quality on psychological well-being', url: 'https://jech.bmj.com/content/68/2/171.short' },
			{ title: 'Neighborhood stressors and social support as predictors of depressive symptoms.', url: 'https://doi.org/10.1016/j.healthplace.2010.04.006' },
			{ title: 'When neighborhoods matter: Developmental timing and youth reading achievement and problem behaviors', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0049089X18306987?via%3Dihub' }
		]
	},
	{
		group: 'location',
		groupLabel: 'Location + Conditions',
		label: 'Housing Quality',
		studies: [
			{ title: 'Housing Risk Factors Associated with Respiratory Disease: A Systematic Review', url: 'https://www.mdpi.com/1660-4601/18/6/2815' },
			null,
			null,
			null,
			{ title: 'Can Homes Affect Well-Being? A Scoping Review among Housing Conditions, Indoor Environmental Quality, and Mental Health Outcomes', url: 'https://www.mdpi.com/1660-4601/19/23/15975' },
			{ title: 'The impact of persistent poor housing conditions on mental health.', url: 'https://doi.org/10.1016/j.ypmed.2017.09.020' },
			{ title: 'Housing quality as a social determinant of developmental & behavioral health', url: 'https://link.springer.com/article/10.1186/s12889-026-28500-z' }
		]
	},
	{
		group: 'proximity',
		groupLabel: 'Proximities + Accessibility',
		label: 'Proximity to Services',
		studies: [
			null,
			null,
			null,
			null,
			null,
			{ title: 'The Neighbourhood Built Environment and Trajectories of Depression Symptom Episodes in Adults: A Latent Class Growth Analysis', url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0133603' },
			{ title: 'Cognitive decline and the neighborhood environment', url: 'https://www.sciencedirect.com/science/article/abs/pii/S104727971500304X?via%3Dihub' }
		]
	},
	{
		group: 'proximity',
		groupLabel: 'Proximities + Accessibility',
		label: 'Proximity to Green Spaces',
		studies: [
			{ title: 'Green Space Quality and Health: A Systematic Review', url: 'https://www.mdpi.com/1660-4601/18/21/11028' },
			{ title: 'Accessibility and use of urban green spaces, and cardiovascular health', url: 'https://link.springer.com/article/10.1186/1476-069X-13-20' },
			null,
			null,
			{ title: 'Green spaces and General Health: Roles of mental health status, social support, and physical activity', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0160412016300666' },
			{ title: 'More green, less lonely? A longitudinal cohort study', url: 'https://doi.org/10.1093/ije/dyab089' },
			{ title: 'Residential green space and child intelligence and behavior across urban, suburban, and rural areas in Belgium: A longitudinal birth cohort study of twins', url: 'https://doi.org/10.1371/journal.pmed.1003213' }
		]
	},
	{
		group: 'proximity',
		groupLabel: 'Proximities + Accessibility',
		label: 'Proximity to Industrial Sites',
		studies: [
			{ title: 'Asthma, respiratory symptoms and lung function in children living near a petrochemical site', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0013935114001832' },
			null,
			null,
			{ title: 'Residential Proximity to Environmental Hazards and Adverse Health Outcomes', url: 'https://ajph.aphapublications.org/doi/full/10.2105/AJPH.2011.300183' },
			{ title: 'Environmental Stressors: The Mental Health Impacts of Living Near Industrial Activity', url: 'https://journals.sagepub.com/doi/abs/10.1177/002214650504600306' },
			{ title: 'Residential Proximity to Oil and Gas Development and Mental Health', url: 'https://doi.org/10.2105/AJPH.2024.307730' },
			{ title: 'Proximity to coal-fired power plants and neurobehavioral symptoms in children', url: 'https://www.nature.com/articles/s41370-021-00369-7' }
		]
	},
	{
		group: 'proximity',
		groupLabel: 'Proximities + Accessibility',
		label: 'Transit Accessibility',
		studies: [
			null,
			null,
			null,
			null,
			{ title: 'Perceived liveability, transport, and mental health: A story of overlying inequalities', url: 'https://www.sciencedirect.com/science/article/pii/S2214140522001852' },
			{ title: 'Proximity to public transportation and incidence of depression risk among older adults: A three-year longitudinal analysis from the Japan Gerontological evaluation study', url: 'https://www.sciencedirect.com/science/article/pii/S0091743524003591?via%3Dihub' },
			{ title: 'Cognitive decline and the neighborhood environment', url: 'https://www.sciencedirect.com/science/article/abs/pii/S104727971500304X?via%3Dihub' }
		]
	},
	{
		group: 'indoor',
		groupLabel: 'Indoor Environmental Quality',
		label: 'Thermal Comfort',
		studies: [
			null,
			null,
			{ title: 'Heat-Related Illness Is Associated with Lack of Air Conditioning and Pre-Existing Health Problems in Detroit, Michigan', url: 'https://www.mdpi.com/1660-4601/17/16/5704' },
			null,
			{ title: 'Cold homes and mental health harm: Evidence from the UK Household Longitudinal Study', url: 'https://www.sciencedirect.com/science/article/pii/S0277953622007675' },
			{ title: 'Cold homes and mental health harm: Evidence from the UK Household Longitudinal Study', url: 'https://www.sciencedirect.com/science/article/pii/S0277953622007675' },
			null
		]
	},
	{
		group: 'indoor',
		groupLabel: 'Indoor Environmental Quality',
		label: 'Indoor Air Quality',
		studies: [
			{ title: 'Indoor Air Pollution and Respiratory Health', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7665158/' },
			{ title: 'Ambient air pollution and body weight status in adults: A systematic review and meta-analysis', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0269749119362803' },
			null,
			null,
			{ title: 'Air quality and mental health: evidence, challenges and future directions', url: 'https://www.cambridge.org/core/journals/bjpsych-open/article/air-quality-and-mental-health-evidence-challenges-and-future-directions/FF3A143292CD1783BA7DC7B744573C5C' },
			{ title: 'Effects of long-term household air pollution exposure from solid fuel use on depression', url: 'https://doi.org/10.1016/j.envpol.2021.117350' },
			{ title: 'Association between solid fuel use and cognitive impairment: A cross-sectional and follow-up study in a middle-aged and older Chinese population', url: 'https://www.sciencedirect.com/science/article/pii/S0160412020322066' }
		]
	},
	{
		group: 'indoor',
		groupLabel: 'Indoor Environmental Quality',
		label: 'Chemical Exposure',
		studies: [
			null,
			{ title: 'Chronic exposure to biomass fuel is associated with increased carotid artery intima-media thickness and a higher prevalence of atherosclerotic plaque.', url: 'https://heart.bmj.com/content/99/14/984.short' },
			null,
			{ title: 'Exposure of U.S. Children to Residential Dust Lead, 1999–2004', url: 'https://pubs.acs.org/evhpaz/article/117/3/468/5247943/Exposure-of-U-S-Children-to-Residential-Dust-Lead' },
			null,
			null,
			{ title: 'The effect of lead exposure on IQ test scores in children under 12 years: a systematic review and meta-analysis of case-control studies', url: 'https://link.springer.com/article/10.1186/s13643-022-01963-y' }
		]
	},
	{
		group: 'outdoor',
		groupLabel: 'Outdoor Environmental Quality',
		label: 'Prevalence of Air Pollution',
		studies: [
			{ title: 'Environmental and Health Impacts of Air Pollution: A Review', url: 'https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2020.00014/full' },
			null,
			null,
			null,
			{ title: 'The relation between past exposure to fine particulate air pollution and prevalent anxiety: observational cohort study', url: 'https://www.bmj.com/content/350/bmj.h1111' },
			{ title: 'Association of Long-term Exposure to Air Pollution With Late-Life Depression in Older Adults in the US', url: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2801241' },
			{ title: 'Associations of Pre- and Postnatal Air Pollution Exposures with Child Behavioral Problems and Cognitive Performance: A U.S. Multi-Cohort Study', url: 'https://pubs.acs.org/evhpaz/article/130/6/067008/5224301/Associations-of-Pre-and-Postnatal-Air-Pollution' }
		]
	},
	{
		group: 'outdoor',
		groupLabel: 'Outdoor Environmental Quality',
		label: 'Significant Extreme Heat / UHI',
		studies: [
			null,
			null,
			{ title: 'Association between high temperature and heatwaves with heat-related illnesses: A systematic review and meta-analysis', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0048969722054316?via%3Dihub' },
			null,
			{ title: 'Heat exposure intervention, anxiety level, and multi-omic profiles: A randomized crossover study', url: 'https://www.sciencedirect.com/science/article/pii/S0160412023005202?via%3Dihub' },
			{ title: 'Association of heatwave exposure and multimorbidity with depression trajectories among older adults.', url: 'https://doi.org/10.1093/gerona/glaf209' },
			{ title: 'Urban heat exposure patterns and domain-specific executive function in adolescents', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0013935126008443?via%3Dihub' }
		]
	},
	{
		group: 'outdoor',
		groupLabel: 'Outdoor Environmental Quality',
		label: 'Noise Pollution',
		studies: [
			null,
			null,
			null,
			null,
			{ title: 'Noise annoyance predicts symptoms of depression, anxiety and sleep disturbance 5 years later.', url: 'https://academic.oup.com/eurpub/article/30/3/516/5731324' },
			{ title: 'New determinants of mental health: the role of noise pollution. A narrative review', url: 'https://www.tandfonline.com/doi/abs/10.1080/09540261.2022.2095200' },
			null
		]
	}
];
