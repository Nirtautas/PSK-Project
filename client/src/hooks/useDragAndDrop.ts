import { useEffect, useState } from 'react'

type DragAndDropArgs<T> = {
    onDrop: (event: MouseEvent, droppedOn: Element | null, targetItem: T, targetElement: HTMLElement) => DragAndDropReleaseArgs | Promise<DragAndDropReleaseArgs>
    dropTargets: DropTargets
}

export type DragAndDropReleaseArgs = {
    shouldReset?: boolean
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
    const handleRelease = async (e: MouseEvent, dropTarget: Element | null, releaseArgs: DragAndDropReleaseArgs | Promise<DragAndDropReleaseArgs>) => {
        const parent = target?.parentElement
        setSelectedItem(null)
        target?.remove()
        if (target) target.style = ''
        setTarget(null)

        // A bit hacky, but works
        const releaseArgsResult = await releaseArgs
        await new Promise((resolve) => setTimeout(resolve, 100))
        if (!dropTarget || releaseArgsResult?.shouldReset) {
            parent?.appendChild(target as HTMLElement)
        }
    }

    const handleMouseDown = (e: MouseEvent, selectedItem: T) => {
        const target = (e.currentTarget as HTMLButtonElement)
        setSelectedItem(selectedItem)

        setTarget(target)
    }
    const handleMouseUp = async (event: MouseEvent) => {
        if (!selectedItem || !isDragging) {
            setTarget(null)
            setIsDragging(false)
            return
        }
        setIsDragging(false)
        let dropTarget: Element | null = null
        const dropTargets = isSelector(dropTargetsUnknown)
            ? document.querySelectorAll(dropTargetsUnknown.dropTargetsSelector)
            : dropTargetsUnknown
        dropTargets.forEach((dropBox) => {
            const rect = dropBox.getBoundingClientRect()
            if (event.clientX > rect.x && event.clientX < rect.x + rect.width
                && event.clientY > rect.y && event.clientY < rect.y + rect.height) {
                dropTarget = dropBox
            }
        })
        try {
            // @ts-ignore
            const releaseArgs = onDrop(event, dropTarget || null, selectedItem, target)
            handleRelease(event, dropTarget, releaseArgs)
        } catch (err) {
            console.error(err as Error)
            handleRelease(event, dropTarget, { shouldReset: true })
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
