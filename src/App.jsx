import React, { useState, useEffect } from 'react';
import faker from 'faker';

import Select from './Select/Select';
import './style.scss';

function generateOptions(count = 1000, id = 1) {
    let options = [];
    for (let i = 1; i < count + 1; i += 1) {
        options = [...options, {
            id: `${i}-${id}`,
            name: faker.random.words(3),
            value: `value-option-${i}-${id}`,
            grpTitle: i % 10 === 0,
        }];
    }

    return options;
}


function App() {
    const [options] = useState({
        'Suggested segment': generateOptions(30, 1),
        'Catalogue fields': generateOptions(40, 2),
        Reports: [
            ...generateOptions(20, 3),
            {
                id: 666,
                name: 'callback',
                value: 'callback-0-3',
                grpTitle: true,
                callback: true,
            },
        ],
    });
    const [optSelected, setOptSelected] = useState(options.Reports[6]);

    function onOptionCallback(option) {
        console.log('CALLBACK', option);
    }

    function handleButtonClick() {
        setOptSelected(null);
    }

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
        }}
        >
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>SELECT</h1>
                        <div style={{ height: '200px', overflow: 'scroll' }}>
                            <pre>{JSON.stringify(options, null, 2)}</pre>
                        </div>

                        <br />

                        <button
                            type="button"
                            onClick={handleButtonClick}
                        >
                            Reset Select
                        </button>

                        <p>
                            {JSON.stringify(optSelected, null, 2)}
                        </p>

                        <div className="form-control">
                            <Select
                                searchable
                                tabbed
                                footerHeight={60}
                                placeholder="Select a field"
                                style={{
                                    container: { width: '740px' },
                                    dropDown: { width: '100%' },
                                }}
                                options={options}
                                optionCallback={onOptionCallback}
                                optionsConfig={{
                                    itemSize: [40, 10, 90],
                                    listHeight: 300,
                                }}
                                onChanged={(opt) => setOptSelected(opt)}
                                value={optSelected && optSelected.value}
                                labelKey="name"
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
