import React, { useState, useEffect } from 'react';
import faker from 'faker';

import Select from './Select/Select'
import './style.scss';

function generateOptions(count = 1000, id = 1) {
  let options = [];
  for (let i = 1; i < count + 1; i++) {
    options = [...options, {
      id: `${i}-${id}`,
      name: faker.random.words(3),
      value: `value-option-${i}-${id}`,
      grpTitle: i%10 === 0,
    }]
  }

  return options;
}


function App() {
  const [options] = useState({
    'Suggested segment': generateOptions(2000, 1),
    'Catalogue fields': generateOptions(2000, 2),
    'Reports': generateOptions(2000, 3),
  });
  const [optSelected, setOptSelected] = useState(options['Suggested segment'][6]);

  useEffect(() => {
    console.log('[APP] Option selected', optSelected);
  }, [optSelected]);

  return (
    <div style={{ 
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      }}>
    <div className="container">
      <div className="row">
        <div className="col-xs-12">
          <h1>SELECT</h1>
          <div style={{ height: '700px', overflow: 'scroll' }}>
            <pre>{JSON.stringify(options, null, 2)}</pre>
          </div>

          <br />  

          <div className="form-control">
            <Select
              searchable
              tabbed
              footerHeight={60}
              placeholder="Select a field"
              style={{
                container: { width: '740px' },
                dropDown: { width: '100%' }
              }}
              options={options}
              onChanged={(opt) => setOptSelected(opt)}
              value={optSelected && optSelected.value}
              labelKey='name'
            />
          </div>

          {/* <div style={{ height: '500px' }}/> */}
        </div>
      </div>
    </div>
    <div className="footer" />
    </div> 
);
}

export default App;
