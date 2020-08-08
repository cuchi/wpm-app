import { Component, SyntheticEvent } from 'react'
import { differenceInSeconds, addSeconds } from 'date-fns'
import TextDiff from '../TextDiff'
import { diffChars } from 'diff'

const wordSize = 5

type Props = {
    sourceText: string,
    timerInSecs?: number
}

type State = {
    input: string,
    accuracy: number,
    wordsPerMinute: number,
    isRunning: boolean,
    firstStroke?: Date,
    remainingSeconds: number
}

export default class TypingBoard extends Component<Props, State> {

    private timer?: NodeJS.Timeout
    private tick?: NodeJS.Timeout

    constructor(props: Props) {
        super(props)
        this.state = {
            input: '',
            accuracy: 0,
            wordsPerMinute: 0,
            firstStroke: undefined,
            remainingSeconds: 0,
            isRunning: true
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        if (this.tick) {
            clearInterval(this.tick)
        }
    }

    private isValidWpm(wordsPerMinute: number) {
        return wordsPerMinute && Number.isFinite(wordsPerMinute)
    }

    private setInput(input: string) {
        if (!this.state.firstStroke && this.props.timerInSecs) {
            this.initializeTimer(this.props.timerInSecs)
            this.initializeTick()
        }

        const firstStroke = this.state.firstStroke ?? new Date()
        const elapsedTime = differenceInSeconds(new Date(), firstStroke)
        const inputSize = input.length
        const wordsPerMinute = (inputSize / wordSize) / (elapsedTime / 60)
        this.setState({ ...this.state, firstStroke, wordsPerMinute, input })
    }

    private initializeTimer(secs: number) {
        this.timer = setTimeout(() => {
            this.setState({
                ...this.state,
                isRunning: false,
                remainingSeconds: 0
            })
            if (this.tick) {
                clearInterval(this.tick)
            }
        }, secs * 1000)
    }

    private initializeTick() {
        this.tick = setInterval(() => {
            if (!this.state.firstStroke || !this.props.timerInSecs) {
                return
            }
            const remainingSeconds = differenceInSeconds(
                addSeconds(this.state.firstStroke, this.props.timerInSecs),
                new Date()
            )
            this.setState({ ...this.state, remainingSeconds })
        }, 500)
    }

    private onPaste(event: SyntheticEvent) {
        event.preventDefault()
    }

    private getAccuracy() {
        const changes = diffChars(this.props.sourceText, this.state.input)
        const correctChars = changes
            .reduce(
                (correctChars, change) => {
                    const count = change.count ?? 0
                    if (change.added) {
                        return correctChars - count
                    }
                    if (change.removed) {
                        return correctChars
                    }
                    return correctChars + count
                }, 
                0
            )
        return {
            changes,
            accuracy: Math.max(correctChars, 0)
                / this.props.sourceText.length * 100
        }
    }

    render() {
        const { input, wordsPerMinute, remainingSeconds } = this.state
        const { changes, accuracy } = this.getAccuracy()

        return (
            <div>
                <TextDiff sourceText={this.props.sourceText} changes={changes}/>
                <textarea
                    value={input}
                    onChange={event => this.setInput(event.target.value)}
                    disabled={!this.state.isRunning}
                    onPaste={this.onPaste.bind(this)}
                    onDrop={this.onPaste.bind(this)}
                />
                <p>
                    WPM: {this.isValidWpm(wordsPerMinute)
                        ? wordsPerMinute
                        : '--'}
                    <br/>
                    Remaining time: {remainingSeconds}
                    <br/>
                    Accuracy: {accuracy}
                </p>
            </div>
        )
    }
}