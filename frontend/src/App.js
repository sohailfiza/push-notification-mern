import './App.css';
import { regSw, subscribe } from './serviceWorker';

function App() {
    async function registerAndSubscribe() {
        try {
            const serviceWorkerReg = await regSw();
            await subscribe(serviceWorkerReg);
        } catch (error) {
            console.error('Error during registration and subscription:', error);
        }
    }

    return (
        <div className="App">
            <button onClick={registerAndSubscribe}>
                Subscribe for Push Notifications
            </button>
        </div>
    );
}

export default App;