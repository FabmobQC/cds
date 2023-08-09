interface MontrealGeobase {
  COTE_RUE_ID: string
  ID_TRC: string
  ID_VOIE: string
  NOM_VOIE: string
  NOM_VILLE: string
  DEBUT_ADRESSE: string
  FIN_ADRESSE: string
  COTE: "Droit" | "Gauche"
  TYPE_F: -1 | 0 | 1
  SENS_CIR: SensCir
}

enum SensCir {
  same = -1,
  opposite = 1,
  both = 0,
}
