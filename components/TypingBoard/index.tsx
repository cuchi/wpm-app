import { Component, SyntheticEvent, ChangeEvent } from 'react'
import { differenceInSeconds, addSeconds, differenceInMilliseconds } from 'date-fns'
import TextDiff from '../TextDiff'
import { diffChars, Change } from 'diff'
import ResultBoard, { History } from '../ResultBoard'

const wordSize = 5

type TypingBoardProps = {
    sourceText: string,
    timerInSecs?: number
}

type State = {
    input: string,
    progress: number,
    wordsPerMinute: number,
    isRunning: boolean,
    firstStroke?: Date,
    remainingSeconds: number,
    changes: Change[],
    history: History
}

export default class TypingBoard extends Component<TypingBoardProps, State> {

    private timer?: NodeJS.Timeout
    private tick?: NodeJS.Timeout

    constructor(props: TypingBoardProps) {
        super(props)
        this.state = {
            input: '',
            progress: 0,
            wordsPerMinute: 0,
            firstStroke: undefined,
            remainingSeconds: 0,
            isRunning: true,
            changes: diffChars(this.props.sourceText, ''),
            history: []
        }
    }

    componentWillUnmount() {
        this.clearTimers()
    }
    
    private clearTimers() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        if (this.tick) {
            clearInterval(this.tick)
        }
    }
    
    private getInputEventChar(event: Event) {
        if (event instanceof InputEvent) {
            if (event.data) {
                return event.data
            }
            if (event.inputType === 'deleteContentBackward') {
                return '\x7F'
            }
        }
    }

    private isValidWpm(wordsPerMinute: number) {
        return wordsPerMinute && Number.isFinite(wordsPerMinute)
    }

    private setInput(event: ChangeEvent<HTMLTextAreaElement>) {
        const input = event.target.value
        if (!this.state.firstStroke && this.props.timerInSecs) {
            this.initializeTimer(this.props.timerInSecs)
            this.initializeTick()
        }
        const firstStroke = this.state.firstStroke ?? new Date()
        const elapsedTime = differenceInMilliseconds(new Date(), firstStroke)
        const inputSize = input.length
        const wordsPerMinute = (inputSize / wordSize) / (elapsedTime / 1000 / 60)
        const { progress, changes } = this.getProgress(input)
        const isRunning = progress !== 100
        if (!isRunning) {
            this.clearTimers()
        }
        this.setState({
            ...this.state,
            isRunning,
            progress,
            changes,
            wordsPerMinute,
            firstStroke,
            input,
            history: [...this.state.history, {
                wordsPerMinute,
                progress,
                time: new Date(),
                char: this.getInputEventChar(event.nativeEvent)
            }]
        })
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

    private getProgress(input: string) {
        const changes = diffChars(this.props.sourceText, input)
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
            progress: Math.max(correctChars, 0)
                / this.props.sourceText.length * 100
        }
    }

    render() {
        const {
            input,
            wordsPerMinute,
            remainingSeconds,
            firstStroke,
            changes,
            progress,
            isRunning
        } = this.state

        return (
            <div>
                <TextDiff changes={changes}/>
                <textarea
                    value={input}
                    onChange={this.setInput.bind(this)}
                    disabled={!this.state.isRunning}
                    onPaste={this.onPaste.bind(this)}
                    onDrop={this.onPaste.bind(this)}
                />
                {firstStroke && <p>
                    WPM: {this.isValidWpm(wordsPerMinute)
                        ? wordsPerMinute
                        : '--'}
                    {this.props.timerInSecs && <>
                        <br/>
                        Remaining time: {remainingSeconds}
                    </>}
                    <br/>
                    Progress: {progress}%
                </p>}
                {this.state.firstStroke && <ResultBoard 
                    history={this.state.history}
                    firstStroke={this.state.firstStroke}
                />}
            </div>
        )
    }
}