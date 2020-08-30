import React from "react"
import { Change } from "diff"

type TextDiffProps = {
  changes: Change[]
}

function displayChanges(changes: Change[]) {
  return changes.map(change => {
    let color = "green"
    if (change.added) {
      color = "red"
    }
    if (change.removed) {
      color = "gray"
    }
    return <span style={{ color }}>{change.value}</span>
  })
}

export default function TextDiff({ changes }: TextDiffProps) {
  return (
    <>
      <p>{displayChanges(changes)}</p>
    </>
  )
}
