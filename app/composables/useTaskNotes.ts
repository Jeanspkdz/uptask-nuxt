export const useTaskNotes = (
  projectId: MaybeRefOrGetter<string>,
  taskId: MaybeRefOrGetter<string>
) => {
  const {
    data: notes,
    pending: isNotesPending,
    refresh: refreshNotes,
  } = useFetch(
    `/api/project/${toValue(projectId)}/task/${toValue(taskId)}/note`,
    {
      key: `${toValue(projectId)}-${toValue(taskId)}`,
      transform (data) {
        return data.map((d) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        }))
      },
      deep: true,
    }
  )

  const addNote = (
    note: TaskNote & { owner: { id: string; name: string } }
  ) => {
    notes.value?.push(note)
  }

  const deleteNote = (noteId: string) => {
    notes.value = notes.value?.filter(note => note.id !== noteId)
  }

  return {
    notes,
    isNotesPending,
    refreshNotes,
    addNote,
    deleteNote
  }
}
