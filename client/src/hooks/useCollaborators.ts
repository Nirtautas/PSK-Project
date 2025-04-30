import { useState, useEffect } from 'react'
import CollaboratorApi from '@/api/collaborator.api'
import { BoardUser } from '@/types/types'

export const useCollaborators = (boardId: number) => {
  const [collaborators, setCollaborators] = useState<BoardUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const { result } = await CollaboratorApi.getCollaborators(boardId)
        setCollaborators(result || [])
        setError(null)
      } catch {
        setError('Failed to fetch collaborators')
      } finally {
        setLoading(false)
      }
    }

    fetchCollaborators()
  }, [boardId])

  return { collaborators, error, loading, setCollaborators }
}