import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

//COMPONENTS
import Dashboard from 'containers/Dashboard';

function App(props) {
  const pageLoadTime = new Date().getTime();

  return (
    <React.Suspense
      fallback={
        <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          loading...
        </div>
      }
    >
      <Router>
        <Switch>

          <Redirect exact from="/" to="/feed" />
          <Redirect exact from="/rewards" to="/rewards/daily" />
          <Redirect exact from="/profile" to="/profile/activity" />
          <Route path={["/rewards/:type/:date", "/rewards/:type", "/profile/:type", "/rewards", "/profile", "/feed"]} render={(props) => (<Dashboard {...props} pageLoadTime={pageLoadTime} />)} />

        </Switch>
      </Router>
    </React.Suspense>
  );
}

export default App;