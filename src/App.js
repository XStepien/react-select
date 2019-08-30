import React from 'react';
import Select from './Select/Select';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="row">
            <div className="col-xs-6 col-xs-offset-3">
                <div className="form-control">
                    <Select
                        placeholder="Select a field"
                        style={{ container: { width: '100%' } }}
                    />
                </div>
            </div>
          </div>
        </div> 
      </header>
    </div>
  );
}

export default App;
