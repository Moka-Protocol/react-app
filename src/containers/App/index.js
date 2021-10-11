import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

//COMPONENTS
import About from 'containers/About';
import Activity from 'containers/Activity';
import Dashboard from 'containers/Dashboard';
import Leaderboard from 'containers/Leaderboard';

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
          <Redirect exact from="/" to="/d" />
          <Redirect exact from="/d/:id" to="/d/:id/latest" />
          <Route path={["/d/:id/:time","/d"]} render={(props) => (<Dashboard {...props} pageLoadTime={pageLoadTime} />)} />
          <Route path="/about" component={About} />
          <Route path="/activity" component={Activity} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route exact path="*" to="/d" />
        </Switch>
      </Router>
    </React.Suspense>
  );
}

export default App;