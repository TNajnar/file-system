import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/:path*" children={<FileSystem />} />
      </Switch>
    </Router>
  );
}

export default App;
