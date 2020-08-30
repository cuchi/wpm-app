import React, { useState } from "react"

type TypingSettingsState = {
  timerEnabled: boolean
  timeInSeconds: number
  text: string
  paragraphs: string[]
  textError?: string
  textInfo?: string
}

type TypingConfigurationProps = {
  onStart: (state: TypingSettingsState) => void
}

function getTextInfo(paragraphs: string[]) {
  const realTextLength = paragraphs.join("").length

  return `${paragraphs.length} paragraph(s), ${realTextLength} character(s)`
}

export default function TypingSettings(props: TypingConfigurationProps) {
  const { onStart } = props
  const [state, setState] = useState<TypingSettingsState>({
    timerEnabled: false,
    timeInSeconds: 120,
    paragraphs: [],
    text: "",
  })
  const {
    timerEnabled,
    timeInSeconds,
    text,
    textError,
    textInfo,
    paragraphs,
  } = state

  function start() {
    if (!state.text) {
      return setState({
        ...state,
        textError: "At least one paragraph of text is required!",
      })
    }
    onStart(state)
  }

  function updateText(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = event.target.value
    if (!text) {
      return setState({ ...state, text, textInfo: undefined })
    }

    const paragraphs = text
      .split("\n")
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph !== "")

    const textInfo = getTextInfo(paragraphs)

    setState({ ...state, text, textError: undefined, textInfo })
  }

  return (
    <form className="pure-form pure-form-stacked">
      <fieldset>
        <legend>
          <h2>Typing settings</h2>
        </legend>
        <label htmlFor="text">Text to be typed</label>
        <textarea
          id="text"
          value={text}
          style={{ height: "10em" }}
          placeholder="Text to be typed..."
          onChange={updateText}
        />
        {textInfo && <span className="pure-form-message">{textInfo}</span>}
        {textError && <span className="pure-form-message error">{textError}</span>}
        <hr />
        <label htmlFor="timer-enabled" className="pure-checkbox">
          <input
            type="checkbox"
            id="timer-enabled"
            checked={timerEnabled}
            onClick={() => {
              setState({
                ...state,
                timerEnabled: !timerEnabled,
              })
            }}
          />
          &nbsp; Enable timer
        </label>
        {timerEnabled && (
          <>
            <label htmlFor="time-limit">Time limit in seconds</label>
            <input
              type="number"
              id="time-limit"
              min={10}
              value={timeInSeconds}
              onChange={event => {
                setState({
                  ...state,
                  timeInSeconds: Number(event.target.value),
                })
              }}
            />
          </>
        )}
        <hr />
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ float: "right" }}
          onClick={start}
        >
          Start
        </button>
      </fieldset>
    </form>
  )
}
