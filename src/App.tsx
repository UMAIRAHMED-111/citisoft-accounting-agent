import { AgentProviderComponent } from './agent/AgentProvider';
import { AppRoutes } from './app/routes';

function App() {
  return (
    <AgentProviderComponent>
      <AppRoutes />
    </AgentProviderComponent>
  );
}

export default App;
