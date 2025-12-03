export function useQuestions() {
  const { data, pending, error, refresh } = useAsyncData("questions-list", () =>
    queryCollection("questions").all()
  )

  const questions = computed(() => {
    if (!data.value) return {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.value.reduce((acc: Record<string, any>, q: any) => {
      const id = q.path.split("/").pop()
      if (id) {
        acc[id] = q
      }
      return acc
    }, {})
  })
  const startId = computed(() => "separe_physiquement")

  return {
    data,
    questions,
    startId,
    pending,
    error,
    refresh
  }
}
