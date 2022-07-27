import "bootstrap/dist/css/bootstrap.min.css";
import { ProvideAuth } from "./hooks/useAuth";
import { UserDataProvider } from "./hooks/useUserData";
import { UseNotificationsProvider } from "./hooks/useNotifications";

import Routes from "./routes";
import "./App.css";
import { LanguageSwitcherProvider } from "./hooks/useLanguageSwitcher";

function App() {
  return (
    <div className="App">
      <ProvideAuth>
        <UseNotificationsProvider>
          <LanguageSwitcherProvider>
            <UserDataProvider>
              <Routes />
            </UserDataProvider>
          </LanguageSwitcherProvider>
        </UseNotificationsProvider>
      </ProvideAuth>
    </div>
  );
}

export default App;
