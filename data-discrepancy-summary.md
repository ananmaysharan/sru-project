# SRU Data Source Discrepancy

## Summary

We found a significant mismatch between two primary data sources for SRU commune-level social housing data. Around 700 communes are missing from each source that exist in the other.

## The Two Sources

1. **Our working dataset** (`Total_social_housing_2004_2022.csv`) — 2,201 communes with social housing unit counts from 2004–2022
2. **Official government dataset** (`donnees-sru-data-gouv-maj2023-vf.csv`, published on data.gouv.fr) — 2,157 communes with SRU inventory as of January 1, 2022

## What We Found

| | Our dataset | Government dataset | In both |
|---|---|---|---|
| **Communes** | 2,201 | 2,157 | 1,456 |
| **Unique to source** | 745 | 701 | — |

- **745 communes in our data but not the government file**: Nearly all are labeled "Non soumise sous seuil pop" — meaning they fall below the population threshold for SRU obligations. They have social housing, but aren't legally required to meet SRU targets.

- **701 communes in the government file but not our data**: These are officially SRU-tracked communes, some with substantial social housing inventories (e.g. Oyonnax: 4,632 units; Soissons: 5,934 units). They span 84 departments across all of metropolitan France and overseas territories.

- **17 departments with zero communes in our data**: As a consequence of the missing communes, 17 entire departments (04, 05, 09, 11, 12, 15, 23, 32, 39, 46, 48, 52, 55, 61, 85, 89, 976/Mayotte) have no commune-level data at all in our working dataset. The department-level statistics file (`SRU_Departements_2022.csv`) does include these departments, but there is no underlying commune data to support them.

## SRU vs Social Housing

Social housing exists across all of France, but the SRU law (Loi Solidarité et Renouvellement Urbain, Article 55) only applies to communes with 3,500+ inhabitants (1,500+ in Île-de-France) that belong to agglomerations of 50,000+ with at least one commune over 15,000. These communes must reach 20–25% social housing.

This explains the discrepancy: our working dataset includes communes that have social housing but aren't SRU-obligated ("Non soumise sous seuil pop"), while missing many that are. The government file only tracks the ~2,200 communes that fall under the SRU obligation. The department-level CSV (`SRU_Departements_2022.csv`) reports broader national housing statistics covering all departments regardless of SRU status.

## Impact

Our dataset includes many small communes that aren't SRU-obligated while missing ~700 communes that are. This means any commune-level analysis or visualization of SRU compliance is incomplete — roughly a third of the officially tracked communes aren't represented. Additionally, 17 departments appear completely empty at the commune level despite having social housing activity.