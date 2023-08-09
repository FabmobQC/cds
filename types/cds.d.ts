import { Polygon } from "@turf/helpers"
import { UUID } from "crypto"

type CdsActivity = "parking" | "no parking" | "loading" | "no loading" | "unloading" | "no unloading" | "stopping" | "no stopping" | "travel" | "no travel"
type CdsUnitOfTime = "second" | "minute" | "hour" | "day" | "week" | "month" | "year"
type CdsDayOfWeek = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"

interface CdsZone {
  curb_zone_id: UUID
  geometry: Polygon
  curb_policy_ids: UUID[]
  prev_policies?: CdsPreviousPolicy[]
  published_date: EpochTimeStamp 
  last_updated_date: EpochTimeStamp
  prev_curb_zone_ids?: UUID
  start_date: EpochTimeStamp
  end_date?: EpochTimeStamp
  location_references?: CdsLocationReference[]
  name?: string
  user_zone_id?: string 
  street_name?: string
  cross_street_start_name?: string
  cross_street_end_name?: string
  length?: number
  available_space_lengths?: number[]
  availability_time?: EpochTimeStamp
  width?: number
  parking_angle?: string
  num_spaces?: number
  street_side?: string
  median?: boolean
  entire_roadway?: boolean
  curb_area_ids?: UUID[]
  curb_space_ids?: UUID[]
}

interface CdsArea {
  curb_area_id: UUID
  geometry: Polygon
  name?: string
  published_date: EpochTimeStamp
  last_updated_date: EpochTimeStamp
  curb_zone_ids: UUID[]
}

interface CdsCurbSpace {
  curb_space_id: UUID
  geometry: Polygon
  name?: string
  published_date: EpochTimeStamp
  last_updated_date: EpochTimeStamp
  curb_zone_id: UUID
  space_number?: number
  length: number
  width?: number
  available?: boolean
  availability_time?: EpochTimeStamp
}

interface CdsPolicy {
  curb_policy_id: UUID
  published_date: EpochTimeStamp
  priority: number
  rules: CdsRule[]
  time_spans?: CdsTimeSpan[]
  data_source_operator_id?: UUID
}

interface CdsRule {
  activity: CdsActivity
  max_stay?: number
  max_stay_unit?: CdsUnitOfTime
  no_return?: number
  no_return_unit?: CdsUnitOfTime
  user_classes: string[]
  rate: CdsRate[]
}

interface CdsTypeSpan {
  start_date?: EpochTimeStamp
  end_date?: EpochTimeStamp
  days_of_week?: CdsDayOfWeek[]
  days_of_month?: number[]
  months?: number[]
  time_of_day_start?: `${number}:${number}`
  time_of_day_end?: `${number}:${number}`
  designated_period?: string
  designated_period_except?: boolean
}

interface CdsRate {
  rate: number
  rate_unit: CdsUnitOfTime
  rate_unit_period: "rolling" | "calendar"
  increment_duration?: number
  increment_amount?: number
  start_duration?: number
  end_duration?: number
}

interface CdsLocationReference {
  source: string
  ref_id: string
  start: number
  end: number
  side?: string
}

interface CdsPreviousPolicy {
  curb_policy_ids: UUID[]
  start_date: EpochTimeStamp
  end_date: EpochTimeStamp
}