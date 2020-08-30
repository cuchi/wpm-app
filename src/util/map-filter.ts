type Nullable<T> = T | null | undefined

export default function mapFilter<T, U>(
  fn: (item: T) => Nullable<U>,
  items: T[]
) {
  const result: U[] = []
  for (const item of items) {
    const mappedItem = fn(item)
    if (mappedItem != null) {
      result.push(mappedItem)
    }
  }
  return result
}
