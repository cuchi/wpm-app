import TypingBoard, { TypingBoardProps } from "../components/TypingBoard"
import TypingConfiguration from "../components/TypingConfiguration"
import React, { useState } from "react"
import "./styles.scss"

type State = {
  typingBoardProps?: TypingBoardProps
}

export default function Typing() {
  const [state, setState] = useState<State>({})
  const { typingBoardProps } = state

  function onExit() {
    setState({ ...state, typingBoardProps: undefined })
  }

  return (
    <main className="container">
      {!typingBoardProps && (
        <TypingConfiguration
          onStart={({ text, timerEnabled, timeInSeconds }) =>
            setState({
              typingBoardProps: {
                sourceText: text,
                timerInSecs: timerEnabled ? timeInSeconds : undefined,
                onExit,
              },
            })
          }
        />
      )}
      {typingBoardProps && <TypingBoard {...typingBoardProps} />}
    </main>
  )
}
