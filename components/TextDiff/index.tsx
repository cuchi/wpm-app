import { Change } from 'diff'

type Props = {
    sourceText: string,
    changes: Change[]
}

function displayChanges(changes: Change[]) {
    return changes.map(change => {
        let color = 'green'
        if (change.added) {
            color = 'red'
        }
        if (change.removed) {
            return
        }
        return <span style={{ color }}>{change.value}</span>
    })
}

export default function TextDiff({ sourceText, changes }: Props) {
    return <>
        <p>{sourceText}</p>
        <p>{displayChanges(changes)}</p>
    </>
}
