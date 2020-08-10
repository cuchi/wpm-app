import TypingBoard from '../components/TypingBoard'

export default function Index() {
    return <main className="container">
        <TypingBoard 
            sourceText="Lorem ipsum dolor sit amet, consectetur adipiscing elit." 
            // timerInSecs={500}
        />
    </main>;
}
