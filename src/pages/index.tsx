import TypingBoard, { TypingBoardProps } from "../components/TypingBoard"
import TypingSettings from "../components/TypingSettings"
import React, { useState } from "react"
import "./styles.scss"
import { Helmet } from "react-helmet"

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
      <Helmet>
        <meta charSet="utf-8" />
        <title>WPM App</title>
      </Helmet>
      {!typingBoardProps && (
        <TypingSettings
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
