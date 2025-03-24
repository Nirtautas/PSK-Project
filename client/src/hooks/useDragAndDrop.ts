import { useEffect, useState } from 'react'

type DragAndDropArgs<T> = {
    onDrop: (event: MouseEvent, droppedOn: Element | null, targetItem: T) => void
    dropTargets: DropTargets
}

type DropTargets = CssSelectorDropTargets
    | Element[]

type CssSelectorDropTargets = { dropTargetsSelector: string }

const isSelector = (dropTargets: DropTargets): dropTargets is CssSelectorDropTargets => {
    if ((dropTargets as CssSelectorDropTargets).dropTargetsSelector !== undefined) return true
    return false
}


const useDragAndDrop = <T>({
    onDrop,
    dropTargets: dropTargetsUnknown,
}: DragAndDropArgs<T>) => {

    const [target, setTarget] = useState<HTMLElement | null>(null)
    const [selectedItem, setSelectedItem] = useState<T | null>(null)
    let isDragging = false
    const setIsDragging = (val: boolean) => isDragging = val
    const onStartDragging = (e: MouseEvent) => {
        setIsDragging(true)
        if (!target) return
        const width = target.clientWidth
        const height = target.clientHeight
        target.style.position = 'absolute'
        target.style.left = `${e.x}px`
        target.style.top = `${e.y}px`
        target.style.zIndex = '10'
        target.style.width = `${width}px`
        target.style.height = `${height}px`
    }
    const handleRelease = () => {
        setSelectedItem(null)
        target?.remove()
        setTarget(null)
    }

    const handleMouseDown = (e: MouseEvent, selectedItem: T) => {
        const target = (e.currentTarget as HTMLButtonElement)
        setSelectedItem(selectedItem)

        setTarget(target)
    }
    const handleMouseUp = async (e: MouseEvent) => {
        if (!selectedItem || !isDragging) {
            setTarget(null)
            setIsDragging(false)
            return
        }
        setIsDragging(false)
        let dropTarget: Element
        const dropTargets = isSelector(dropTargetsUnknown)
            ? document.querySelectorAll(dropTargetsUnknown.dropTargetsSelector)
            : dropTargetsUnknown
        dropTargets.forEach((dropBox) => {
            const rect = dropBox.getBoundingClientRect()
            if (e.clientX > rect.x && e.clientX < rect.x + rect.width) {
                dropTarget = dropBox
            }
        })
        try {
            // @ts-ignore
            onDrop(e, dropTarget || null, selectedItem)
        } catch (err) {
            console.error(err as Error)
        } finally {
            handleRelease()
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (target) {
            if (!isDragging) {
                onStartDragging(e)
                return
            }
            target.style.transform = 'translate(-50%, -50%)'
            target.style.left = `${e.clientX}px`
            target.style.top = `${e.clientY}px`
        }
    }

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mousemove', handleMouseMove)
        return () => {
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [target])

    return {
        handleMouseDown
    }
}

export default useDragAndDrop
