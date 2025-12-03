export const useGlossary = () => {
  const { data: glossary } = useAsyncData("glossary", () =>
    queryCollection("glossary").all()
  )

  const getDefinition = (slug: string) => {
    if (!glossary.value) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const term = glossary.value.find((item: any) => item.path?.endsWith(`/${slug}`))
    return term?.description
  }

  return {
    glossary,
    getDefinition
  }
}
