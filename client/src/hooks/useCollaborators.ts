import { useState, useEffect } from 'react'
import CollaboratorApi from '@/api/collaborator.api'
import { BoardUser, Role } from '@/types/types'

export const useCollaborators = (boardId: number, userName?: string | null) => {
  const [collaborators, setCollaborators] = useState<BoardUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const { result } = await CollaboratorApi.getCollaborators(boardId)

        if (result) {
          let filteredCollaborators = result

          if (userName) {
            filteredCollaborators = filteredCollaborators.filter(
              (collaborator) => collaborator.userRole !== Role.OWNER
            )
          }

          filteredCollaborators = filteredCollaborators.filter(
            (collaborator) =>
              userName
                ? collaborator.userName.toLowerCase().includes(userName.toLowerCase())
                : true
          )

          if (!userName) {
            const owner = filteredCollaborators.find(
              (collaborator) => collaborator.userRole === Role.OWNER
            )

            if (owner) {
              filteredCollaborators = filteredCollaborators.filter(
                (collaborator) => collaborator.userRole !== Role.OWNER
              )
              filteredCollaborators.unshift(owner)
            }
          }

          setCollaborators(filteredCollaborators)
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
