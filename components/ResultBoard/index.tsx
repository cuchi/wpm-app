import { ResponsiveLine, Serie } from '@nivo/line'
import { differenceInMilliseconds } from 'date-fns'
import mapFilter from '../../util/map-filter'

export type History = Array<{
    wordsPerMinute: number,
    progress: number,
    time: Date,
}>

export type ResultBoardProps = {
    history: History,
    firstStroke: Date
}

function breakTickValues(values: number[], amount: number) {
    const tickValues: number[] = []
    for (let i = 0; i < amount; i++) {
        tickValues.push(values[Math.floor(i * values.length / amount)])
    }
    tickValues.push(values[values.length - 1])
    
    return tickValues
}

function getTickValues(series: Serie[]) {
    const xValues = mapFilter(
        entry => typeof entry.x === 'number' ? entry.x : null,
        series[0]?.data ?? []
    )
    
    return xValues.length <= 10
        ? xValues
        : breakTickValues(xValues, 10)
}

function historyToData({ history, firstStroke }: ResultBoardProps) {
    const plottableHistory = history.slice(2)
    const series =  [{
        id: 'Words per minute',
        data: plottableHistory
            .map(event => ({
                x: differenceInMilliseconds(event.time, firstStroke) / 1000,
                y: event.wordsPerMinute,
            }))
    }, {
        id: 'Progress',
        data: plottableHistory.map(event => ({
            x: differenceInMilliseconds(event.time, firstStroke) / 1000,
            y: event.progress,
        }))
    }]
    
    const tickValues = getTickValues(series)
    
    return { series, tickValues }
}

export default function ResultBoard(props: ResultBoardProps) {
    const { series, tickValues } = historyToData(props)
    
    return <>
        <h2>Results:</h2>
        <div style={{
            height: '300px',
            width: '100%'
        }}>
            <ResponsiveLine
                data={series}
                margin={{ top: 10, right: 50, bottom: 50, left: 50 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                axisTop={null}
                axisRight={{
                    orient: 'right',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Progress (%)',
                    legendOffset: 40,
                    legendPosition: 'middle'
                }}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Seconds after the first keystroke',
                    legendOffset: 40,
                    legendPosition: 'middle',
                    tickValues: tickValues
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'WPM',
                    legendOffset: -40,
                    legendPosition: 'middle',
                }}
                colors={{ scheme: 'category10' }}
                pointSize={2}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                useMesh={true}
                yFormat={x => Number(x).toFixed(2)}
                enableSlices="x"
                legends={[
                    {
                        anchor: 'top',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    </>
}