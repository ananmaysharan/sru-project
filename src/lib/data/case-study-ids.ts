export type CaseStudyProjectId =
    | 'samaritaine'
    | 'marechal-fayolle'
    | 'rue-jean-bart'
    | 'tour-bois-le-pretre'
    | 'talgen'
    | 'gignac-la-nerthe'
    | 'les-jasmins';

export const CASE_STUDY_IMAGE_IDS = [
    '000016390005',
    '000016390007-2',
    '000016390009',
    '000016390013',
    '000064690007',
    '000064690014',
    '000064700002',
    '000064700003',
    '000086750006',
    '000086750011',
    '000086760003',
    '000086760007',
    '000086760009',
    '7918512c-eab2-42ea-8d28-5f22f76dc604',
    'DSC02107',
    'a6a4358f-d0c0-48d5-9c19-bb3ff977df70',
    'DSC01776',
    'DSC01779',
    'DSC01780',
    'DSC01794',
    'DSC01796',
    'DSC01797',
    'DSC01798',
    'DSC01799',
    'paris-01',
    'DSC01781',
    'DSC01783',
    '7685ce4e-bef7-419c-8d9e-68536a49e292',
    'cd3ed7fa-1ded-4c80-b2a8-21da3751b6d1',
    'laguiole-280',
    'laguiole-291',
    'laguiole-297',
    'gignac-la-nerthe-01',
    'gignac-la-nerthe-02',
    'gignac-la-nerthe-03',
    'gignac-la-nerthe-04',
    'talgen-01',
    'talgen-02',
    'talgen-03',
    'talgen-04',
    'les-jasmins-01',
    'les-jasmins-02',
    'les-jasmins-03',
    'les-jasmins-04',
] as const;

export type CaseStudyImageId = (typeof CASE_STUDY_IMAGE_IDS)[number];
