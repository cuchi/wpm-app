import React, { useState } from "react"

type TypingConfigurationState = {
  timerEnabled: boolean
  timeInSeconds: number
  text: string
}

type TypingConfigurationProps = {
  onStart: (state: TypingConfigurationState) => void
}

export default function TypingConfiguration(props: TypingConfigurationProps) {
  const { onStart } = props
  const [state, setState] = useState<TypingConfigurationState>({
    timerEnabled: false,
    timeInSeconds: 120,
    text: "",
  })
  const { timerEnabled, timeInSeconds, text } = state

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
          placeholder="Text to be typed..."
          onChange={event => {
            setState({ ...state, text: event.target.value })
          }}
        />
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
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{
            float: "right",
          }}
          onClick={() => onStart(state)}
        >
          Start
        </button>
      </fieldset>
    </form>
  )
}
