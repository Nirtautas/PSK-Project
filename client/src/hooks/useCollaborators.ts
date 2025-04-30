import { useState, useEffect } from 'react'
import CollaboratorApi from '@/api/collaborator.api'
import { BoardUser } from '@/types/types'

export const useCollaborators = (boardId: number, userName?: string | null) => {
  const [collaborators, setCollaborators] = useState<BoardUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const { result } = await CollaboratorApi.getCollaborators(boardId)

        if (result) {
          const filteredCollaborators = userName
            ? result.filter((collaborator: BoardUser) =>
                collaborator.userName.toLowerCase().includes(userName.toLowerCase())
              )
            : result
            
          setCollaborators(filteredCollaborators || [])
        } else {
          setCollaborators([])
        }
        setError(null)
      } catch {
        setError('Failed to fetch collaborators')
      } finally {
        setLoading(false)
      }
    }

    fetchCollaborators()
  }, [boardId, userName])

  return { collaborators, error, loading, setCollaborators }
}