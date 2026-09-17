import type { BucketListState } from "@/store/useBucketListStore"
import type { Country } from "@/types"

export type Getters<T extends object> = {
  [K in keyof T as K extends string ? `get${Capitalize<K>}` : never]: () => T[K]
}

export type UnwrapData<T> = T extends Promise<infer P>
  ? UnwrapData<P>
  : T extends readonly (infer E)[]
    ? UnwrapData<E>[]
    : T extends { data: infer D }
      ? UnwrapData<D>
      : T

export type CountryApiResponse = {
  data: {
    objects: Country[]
  }
}

export type CountryPayload = UnwrapData<Promise<CountryApiResponse>>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function isCountry(value: unknown): value is Country {
  if (!isRecord(value)) return false

  const continent = value.continent
  const languages = value.languages

  const hasValidContinent =
    continent === undefined ||
    (isRecord(continent) && typeof continent.name === "string")

  const hasValidLanguages =
    languages === undefined ||
    (Array.isArray(languages) &&
      languages.every(
        (language: unknown) => isRecord(language) && typeof language.name === "string"
      ))

  return (
    typeof value.code === "string" &&
    typeof value.name === "string" &&
    hasValidContinent &&
    hasValidLanguages
  )
}

export function updateField<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): T {
  const updated = { ...obj }
  updated[key] = value
  return updated
}

export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer E)[]
    ? ReadonlyArray<DeepReadonly<E>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T

export type ReadonlyCountry = DeepReadonly<Country>
export type BucketListStateGetters = Getters<BucketListState>